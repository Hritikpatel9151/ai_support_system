import imaplib
from fastapi import HTTPException
import json
import smtplib
from email.mime.multipart import MIMEMultipart
import email
from email.header import decode_header
import logging
import uuid

from email.utils import parseaddr
from email.mime.text import MIMEText
from sqlalchemy.orm import Session
import asyncio
from app.models import Customer, Ticket,EmailTemplate,CommunicationHistory
from app.database import SessionLocal
from app.ai_service import analyze_and_classify_email, generate_acknowledgment_email


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


IMAP_SSL_HOST = 'imap.gmail.com'
IMAP_SSL_PORT = 993
USERNAME = 'your_email@gmail.com'
PASSWORD = 'your_email_password'

async def connect_to_mailbox():
    try:
        mail = imaplib.IMAP4_SSL(host=IMAP_SSL_HOST, port=IMAP_SSL_PORT)
        mail.login(USERNAME, PASSWORD)
        mail.select('inbox')
        print("connect to the mail")
        return mail
    except Exception as e:
        print(f"Failed to connect to mailbox: {e}")
        return None

# Search for unseen emails
async def search_for_unseen_emails(mail):
    try:
        status, response = mail.search(None, 'UNSEEN')
        if status == 'OK':
            unseen_emails = response[0].split()
            logger.info("Email fetch successful")
            return unseen_emails
        else:
            logger.error(f"Failed to search for unseen emails. Status: {status}, Messages: {response}")
            return []
    except Exception as e:
        logger.error(f"Error searching for unseen emails: {e}")
        return []


async def fetch_emails(mail):
    try:
        unseen_emails = await search_for_unseen_emails(mail)
        email_data = []
        for e_id in unseen_emails:
            e_id = e_id.decode()
            status, msg_data = mail.fetch(e_id, '(RFC822)')
            if status != 'OK':
                logger.error(f"Failed to fetch email ID {e_id}. Status: {status}, Messages: {msg_data}")
                continue
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    email_data.append(parse_email(msg))
        return email_data
    except Exception as e:
        logger.error(f"An error occurred while fetching emails: {e}")
        return []

def parse_email(msg):
    subject, encoding = decode_header(msg["Subject"])[0]
    if isinstance(subject, bytes):
        subject = subject.decode(encoding or "utf-8")

    sender = msg.get("From")

    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain" and part.get("Content-Disposition") is None:
                body = part.get_payload(decode=True).decode()
                break
    else:
        body = msg.get_payload(decode=True).decode()

    return {
        "subject": subject,
        "sender": sender,
        "body": body
    }

def validate_email(sender_email: str, db: Session):
        # Extract the email address from the "From" field
    _, sender_email = parseaddr(sender_email)

    # Log the sender email being validated
    logger.info(f"Validating email: {sender_email}")

    # Ensure the email comparison is case-insensitive
    customer = db.query(Customer).filter(Customer.email.ilike(sender_email)).first()

    if customer:
        logger.info(f"Customer found: {customer.name}")
        return True, customer
    else:
        logger.info("Customer not found")
        return False, None 

def generate_unrecognized_email_response(sender_email):
    response = f"Dear {sender_email},\n\nWe could not recognize your email ID. Please provide additional details or verify your information.\n\nThank you."
    return response


def create_ticket(email_data, customer, content_analysis, priority, db: Session) -> Ticket:
    try:
        new_ticket = Ticket(
            customer_id=customer.id,
            subject=email_data["subject"],
            content=email_data["body"],
            analysis=content_analysis,
            priority=priority,
            unique_id=str(uuid.uuid4())
        )
        db.add(new_ticket)
        db.commit()
        db.refresh(new_ticket)  # Refresh to get the generated ID and any other updated fields
        logger.info(f"Created ticket with ID: {new_ticket.id}")
        return new_ticket
    except Exception as e:
        logger.error(f"Failed to create ticket: {e}")
        

async def send_email(to, subject, body):
    sender_email ='your_email@gmail.com'
    sender_password = 'email_password'

    to = str(to)
    subject = str(subject)
    if isinstance(body, dict):
        body = json.dumps(body)  # Ensure the body is a string
    elif not isinstance(body, str):
        body = str(body)

    # Create email message
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = to
    message['Subject'] = subject
    message.attach(MIMEText(body, 'html'))  # or 'plain' for plain text 

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to, message.as_string())
            print(f"Email sent to {to}")
    except Exception as e:
        print(f"Failed to send email: {e}")


async def send_status_update(ticket_id: int, db:Session):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    customer = db.query(Customer).filter(Customer.id == ticket.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    email_template = db.query(EmailTemplate).filter(EmailTemplate.name == "Status Update").first()
    if not email_template:
        raise HTTPException(status_code=404, detail="Email template not found")

    subject = email_template.subject
    body = email_template.body.format(
        customer_name=customer.name,
        ticket_id=ticket.id,
        ticket_status=ticket.status,
        resolution_time="48 hours"  # Example: Customize based on SLA
    )

    await send_email(to=customer.email, subject=subject, body=body)
    communication = CommunicationHistory(ticket_id=ticket.id, content=body)
    db.add(communication)
    db.commit()

async def process_emails():
    mail = await connect_to_mailbox()
    if not mail:
        return

    db = SessionLocal()
    emails = await fetch_emails(mail)
    logger.info(f"Fetched {len(emails)} emails.")
   
    for email_data in emails:
        is_valid,customer = validate_email(email_data["sender"], db)
        if is_valid:
            logger.info(f"Valid email from {email_data['sender']}")
            # Process valid email (create ticket)
            content_analysis, priority = analyze_and_classify_email(email_data["body"])
            ticket=create_ticket(email_data, customer, content_analysis, priority, db)
            acknowledgment_email_content = generate_acknowledgment_email(ticket)
            await send_email(email_data['sender'], "Acknowledgment: Your Support Request", acknowledgment_email_content)
            

        else:
            logger.info(f"Unrecognized email from {email_data['sender']}")
            response = generate_unrecognized_email_response(email_data["sender"])
            # Send response to unrecognized email
            await send_email(email_data["sender"], "Unrecognized Email ID", response)

    
    db.close()
    mail.logout()
     


# Periodically fetch emails (e.g., every 5 minutes)
async def periodic_email_fetch():
    while True:
        await process_emails()
        await asyncio.sleep(300)

if __name__ == "__main__":
    asyncio.run(periodic_email_fetch())
