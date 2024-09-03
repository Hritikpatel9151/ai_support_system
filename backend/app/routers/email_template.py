from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import SessionLocal


router = APIRouter(
    prefix="/email_templates",
    tags=["email_templates"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.EmailTemplate)
def create_email_template(email_template: schemas.EmailTemplateCreate, db: Session = Depends(get_db)):
    db_email_template = models.EmailTemplate(**email_template.dict())
    db.add(db_email_template)
    db.commit()
    db.refresh(db_email_template)
    return db_email_template

@router.get("/", response_model=List[schemas.EmailTemplate])
def read_email_templates(skip: int = 0, limit: int = 10, db: Session = Depends(get_db) ):
    email_templates = db.query(models.EmailTemplate).offset(skip).limit(limit).all()
    return email_templates

@router.get("/{template_id}", response_model=schemas.EmailTemplate)
def read_email_template(template_id: int, db: Session = Depends(get_db)):
    email_template = db.query(models.EmailTemplate).filter(models.EmailTemplate.id == template_id).first()
    if email_template is None:
        raise HTTPException(status_code=404, detail="Email template not found")
    return email_template

@router.put("/{template_id}", response_model=schemas.EmailTemplate)
def update_email_template(template_id: int, email_template: schemas.EmailTemplateCreate, db: Session = Depends(get_db)):
    db_email_template = db.query(models.EmailTemplate).filter(models.EmailTemplate.id == template_id).first()
    if db_email_template is None:
        raise HTTPException(status_code=404, detail="Email template not found")
    for key, value in email_template.dict().items():
        setattr(db_email_template, key, value)
    db.commit()
    db.refresh(db_email_template)
    return db_email_template

@router.delete("/{template_id}")
def delete_email_template(template_id: int, db: Session = Depends(get_db)):
    db_email_template = db.query(models.EmailTemplate).filter(models.EmailTemplate.id == template_id).first()
    if db_email_template is None:
        raise HTTPException(status_code=404, detail="Email template not found")
    db.delete(db_email_template)
    db.commit()
    return {"message": "Email template deleted successfully"}
