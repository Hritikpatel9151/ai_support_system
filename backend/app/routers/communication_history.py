from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import SessionLocal

router = APIRouter(
    prefix="/communication_history",
    tags=["communication_history"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.CommunicationHistory)
def create_communication_history(ticket_id: int, communication: schemas.CommunicationHistoryCreate, db: Session = Depends(get_db)):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    new_communication = schemas.CommunicationHistory(
        ticket_id=ticket_id,
        content=communication.content
    )
    db.add(new_communication)
    db.commit()
    db.refresh(new_communication)
    
    return new_communication

@router.get("/", response_model=List[schemas.CommunicationHistory])
def read_communication_history(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    communication_history = db.query(models.CommunicationHistory).offset(skip).limit(limit).all()
    return communication_history

@router.get("/{ticket_id}", response_model=List[schemas.CommunicationHistory])
def read_communication_history(ticket_id: int, db: Session = Depends(get_db)):
    communication_history = db.query(models.CommunicationHistory).filter(models.CommunicationHistory.ticket_id == ticket_id).all()
    if communication_history is None:
        raise HTTPException(status_code=404, detail="Communication history not found")
    return communication_history

@router.get("/{unique_id}", response_model=List[schemas.CommunicationHistory])
def get_communication_history(unique_id: str, db: Session = Depends(get_db)):
    history = db.query(models.CommunicationHistory).filter(models.CommunicationHistory.unique_id==unique_id).all()
    if not history:
        raise HTTPException(status_code=404, detail="No communication history found for this Ticket ID")
    return history