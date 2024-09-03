from fastapi import APIRouter, Depends, HTTPException,Body
from sqlalchemy.orm import Session
from app import models, schemas
from app.models import AuditLog
from app.schemas import UserOutWithToken
from typing import List
from datetime import timedelta
from sqlalchemy.exc import SQLAlchemyError
from app.database import SessionLocal
from app.security import get_password_hash,verify_password,create_access_token,get_current_user



router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        hashed_password = get_password_hash(user.password)
        
        db_user = models.User(username=user.username, email=user.email, password=hashed_password, role=user.role)
        #Check if a user with the same email already exists
        db_item = db.query(models.User).filter(models.User.email == db_user.email).first()

        if db_item is not None:
            raise HTTPException(status_code=400, detail="User with the email already exists")
         
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        create_audit_log(db, action=f"Created user {db_user.username}", user=db_user.username, details=f"User ID: {db_user.id}")
        return db_user
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="An error occurred while creating the user")

 
@router.post("/login", response_model=UserOutWithToken)
def login_user(login: schemas.Login = Body(...), db: Session = Depends(get_db)):
    try:
        # Retrieve the user from the database
        db_user = db.query(models.User).filter(models.User.email == login.email).first()
        
        if db_user is None:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        #Verify the user's password
        is_password_valid = verify_password(login.password, db_user.password)
        
        if not is_password_valid:
            raise HTTPException(status_code=401, detail="Invalid password")
        

        # Generate a JWT access token for authentication
        token = create_access_token(db_user)
        create_audit_log(db, action=f"loged user {db_user.username}", user=db_user.username, details=f"User ID: {db_user.id}")

        return UserOutWithToken(
            id=db_user.id,
            username=db_user.username,
            email=db_user.email,
            role=db_user.role,
            token=token
        )
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/me", response_model=schemas.UserOut)  
async def read_current_user(current_user: schemas.UserOut = Depends(get_current_user)):  
    return current_user 


@router.get("/", response_model=List[schemas.UserOut])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.username:
        db_user.username = user_update.username
    if user_update.email:
        db_user.email = user_update.email
    if user_update.password:
        db_user.password = get_password_hash(user_update.password)
    if user_update.role:
        db_user.role = user_update.role

    db.commit()
    db.refresh(db_user)
    create_audit_log(db, action=f"Updated user {db_user.username}", user=db_user.username, details=f"User ID: {db_user.id}")
    return db_user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    create_audit_log(db, action=f"Deleted user {db_user.username}", user=db_user.username, details=f"User ID: {db_user.id}")
    return {"message": "User deleted successfully"}


def create_audit_log(db: Session, action: str, user: str, details: str = None):
    audit_log = AuditLog(
        action=action,
        performed_by=user,
        details=details
    )
    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)
    return audit_log

@router.get("/audit-logs/", response_model=List[schemas.AuditLogOut])
def get_audit_logs( db: Session = Depends(get_db)):
    logs = db.query(models.AuditLog).all()
    return logs

