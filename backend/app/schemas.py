from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None

class ServiceCreate(ServiceBase):
    customer_id: int
    
class ServiceUpdate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int
    customer_id: int

    class Config:
        orm_mode = True


class TicketBase(BaseModel):
    subject: str
    content: str
    analysis: str
    priority: str
    status: Optional[str] = "Open"
    agent_response: Optional[str] = None

class TicketCreate(TicketBase):
    customer_id: int

class TicketUpdate(BaseModel):
    status: Optional[str]
    agent_response: Optional[str]
    
class Ticket(TicketBase):
    id: int
    unique_id: str
    customer_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class SLABase(BaseModel):
    level: str
    response_time: str
    resolution_time: str

class SLACreate(SLABase):
    customer_id: int
    
class SLAUpdate(SLABase):
    pass

class SLA(SLABase):
    id: int
    customer_id: int

    class Config:
        orm_mode = True

class CustomerBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    services: List[Service] = []
    slas: List[SLA] = []
    tickets: List[Ticket] = []

    class Config:
        orm_mode = True


class EmailTemplateBase(BaseModel):
    name: str
    subject: str
    body: str


class EmailTemplateCreate(EmailTemplateBase):
    pass

class EmailTemplate(EmailTemplateBase):
    id: int

    class Config:
        orm_mode = True

class CommunicationHistoryBase(BaseModel):
    ticket_id: int
    content: str

class CommunicationHistoryCreate(CommunicationHistoryBase):
    pass

class CommunicationHistory(CommunicationHistoryBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True





class UserRole(str, Enum):
    ADMIN = "admin"
    AGENT = "agent"
    CUSTOMER = "customer"

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: UserRole = UserRole.AGENT

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: UserRole

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    username: str = None
    email: str = None
    password: str = None
    role: UserRole = None

class AuditLogCreate(BaseModel):
    action: str
    performed_by: str
    details: str

class AuditLogOut(BaseModel):
    id: int
    action: str
    performed_by: str
    timestamp: datetime
    details: str

    class Config:
        orm_mode = True


class Login(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True

 

class UserOutWithToken(BaseModel):
    id: int
    username: str
    email: str
    role: UserRole
    token: str  # Include the token in the response

    class Config:
        orm_mode = True


class Configurationcreate(BaseModel):
    email_retrieval_frequency: int
    sla_response_time: float

class ConfigurationUpdate(BaseModel):
    email_retrieval_frequency: int = None
    sla_response_time: float = None  

class Configuration(BaseModel):
    id: int
    email_retrieval_frequency: int
    sla_response_time: float

    class Config:
        orm_mode = True