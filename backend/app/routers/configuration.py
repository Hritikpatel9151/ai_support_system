
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models,schemas


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/configurations/", response_model=schemas.Configuration)
def create_configuration(config: schemas.Configurationcreate, db: Session = Depends(get_db)):
    new_config = models.Configuration(**config.dict())
    db.add(new_config)
    db.commit()
    db.refresh(new_config)
    return new_config

@router.get("/configurations/", response_model=schemas.Configuration)
def get_configuration(db: Session = Depends(get_db)):
    config = db.query(models.Configuration).first()
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return config

@router.put("/configurations/")
def update_configuration(config_update: schemas.ConfigurationUpdate,
                         db: Session = Depends(get_db)):
    config = db.query(models.Configuration).first()
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    
    for var, value in vars(config_update).items():
        setattr(config, var, value) if value else None
    
    db.commit()
    return config