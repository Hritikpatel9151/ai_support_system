import openai
import spacy
import logging
from typing import Tuple
from app.models import Ticket
from transformers import GPT2LMHeadModel, GPT2Tokenizer


logger = logging.getLogger(__name__)
# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")

# OpenAI API key
#openai.api_key = "your api key"

# Load pre-trained model and tokenizer
#Model: gpt2, gpt2-medium, gpt2-large, gpt2-xl
model_name = "gpt2-medium"  # or any other model name from the Hugging Face model hub
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)
tokenizer.pad_token_id = tokenizer.eos_token_id

if tokenizer.pad_token is None:
    tokenizer.add_special_tokens({'pad_token': '[PAD]'})
    model.resize_token_embeddings(len(tokenizer))



def analyze_email_content(email_body: str) -> str:
    prompt = f"Analyze the following email and extract the main intent: {email_body}"
    inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)
  # Generate the response
    #outputs = model.generate(inputs, max_length=150, num_return_sequences=1, attention_mask=attention_mask)
    outputs = model.generate(
        inputs['input_ids'], 
        max_new_tokens=150, 
        attention_mask=inputs['attention_mask'],
        pad_token_id=tokenizer.eos_token_id
    )
    # Decode the generated text
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return generated_text


def classify_priority(email_content: str) -> str:
    doc = nlp(email_content)
    # Simple rule-based classification for demonstration purposes
    if "urgent" in doc.text or "immediately" in doc.text or "asap" in doc.text or "critical" in doc.text:
        return "High"
    elif "as soon as possible" in doc.text or "priority" in doc.text or "important" in doc.text:
        return "Medium"
    else:
        return "Low"

def analyze_and_classify_email(email_body: str) -> Tuple[str, str]:
    content_analysis = analyze_email_content(email_body)
    priority = classify_priority(content_analysis)
    return content_analysis, priority


def generate_acknowledgment_email(ticket: Ticket):
    # function for generating acknowledgment email content
    if ticket is None:
        logger.error("Received a NoneType ticket object")
        return "Error: Ticket information is missing."

    customer_name = getattr(ticket.customer, 'name', 'Customer')  # Default to 'Customer' if name is missing
    if not customer_name:
        logger.error("Ticket's customer object does not have a valid 'name' attribute")
        return "Error: Customer name is missing."
    
    acknowledgment_email_content = (
        f"Dear {customer_name},<br><br>"
        f"Thank you for reaching out to our support team. Your ticket has been created successfully.<br><br>"
        f"<strong>Ticket Details:</strong><br>"
        f"Ticket ID: {ticket.id}<br>"
        f"Ticket Unique Number: {ticket.unique_id}<br>"
        f"Priority: {ticket.priority}<br>"
        f"Expected Resolution Timeframe: {get_sla_timeframe(ticket.priority)}<br><br>"
        f"Best Regards,<br>"
        f"Support Team"
    )
    return acknowledgment_email_content


def get_sla_timeframe(priority: str) -> str:
    if priority == "High":
        return "24 hours"
    elif priority == "Medium":
        return "48 hours"
    else:
        return "72 hours"