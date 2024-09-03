from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import SessionLocal
from typing import List


router = APIRouter(
    prefix="/slas",
    tags=["slas"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.SLA)
def create_sla(sla: schemas.SLACreate, db: Session = Depends(get_db)):
    db_sla = models.SLA(**sla.dict())
    db.add(db_sla)
    db.commit()
    db.refresh(db_sla)
    return db_sla

@router.get("/", response_model=List[schemas.SLA])
def read_slas(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    slas = db.query(models.SLA).offset(skip).limit(limit).all()
    return slas

@router.get("/{sla_id}", response_model=schemas.SLA)
def read_sla(sla_id: int, db: Session = Depends(get_db)):
    sla = db.query(models.SLA).filter(models.SLA.id == sla_id).first()
    if sla is None:
        raise HTTPException(status_code=404, detail="SLA not found")
    return sla

@router.put("/{sla_id}", response_model=schemas.SLA)
def update_sla(sla_id: int, sla: schemas.SLAUpdate, db: Session = Depends(get_db)):
    db_sla = db.query(models.SLA).filter(models.SLA.id == sla_id).first()
    if db_sla is None:
        raise HTTPException(status_code=404, detail="SLA not found")
    for key, value in sla.dict().items():
        setattr(db_sla, key, value)
    db.commit()
    db.refresh(db_sla)
    return db_sla

@router.delete("/{sla_id}", response_model=schemas.SLA)
def delete_sla(sla_id: int, db: Session = Depends(get_db)):
    db_sla = db.query(models.SLA).filter(models.SLA.id == sla_id).first()
    if db_sla is None:
        raise HTTPException(status_code=404, detail="SLA not found")
    db.delete(db_sla)
    db.commit()
    return db_sla
