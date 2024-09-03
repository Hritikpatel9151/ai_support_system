from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.routers.user import create_audit_log
import uuid
from typing import List
from app import models, schemas
from app.database import SessionLocal
from app.email_service import  send_status_update


router = APIRouter(
    prefix="/tickets",
    tags=["tickets"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Ticket)
def create_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    db_ticket = models.Ticket(
        customer_id=ticket.customer_id,
        subject=ticket.subject,
        content=ticket.content,
        analysis=ticket.analysis,
        priority=ticket.priority,
        unique_id=str(uuid.uuid4())
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.get("/", response_model=List[schemas.Ticket])
def read_tickets(db: Session = Depends(get_db)):
    tickets = db.query(models.Ticket).all()
    return tickets

@router.put("/{ticket_id}", response_model=schemas.Ticket)
async def update_ticket(ticket_id: int, ticket_update: schemas.TicketUpdate, db: Session = Depends(get_db)):
    db_ticket = db.query(models.Ticket).options(joinedload(models.Ticket.customer)).filter(models.Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    

    if ticket_update.status:
        db_ticket.status = ticket_update.status
        #await send_status_update(db_ticket, db)
    if ticket_update.agent_response:
        db_ticket.agent_response = ticket_update.agent_response
    
    db.commit()
    db.refresh(db_ticket)
    await send_status_update(ticket_id, db)
    create_audit_log(db, action=f"Updated ticket {ticket_id} status to {db_ticket.status}", user=db_ticket.customer_id, details=f"Ticket ID: {ticket_id}")
    return db_ticket

