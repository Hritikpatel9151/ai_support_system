from sqlalchemy import Column, Integer, String, ForeignKey,Text,DateTime,Enum,Float
from datetime import datetime
from sqlalchemy.orm import relationship
from .database import Base
from enum import Enum as PyEnum

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(255), index=True)
    address = Column(String(255))
    services = relationship("Service", back_populates="customer")
    slas = relationship("SLA", back_populates="customer")
    tickets = relationship("Ticket", back_populates="customer")

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    description = Column(String(255))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    customer = relationship("Customer", back_populates="services")

class SLA(Base):
    __tablename__ = "slas"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(255), index=True)
    response_time = Column(String(255))
    resolution_time = Column(String(255))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    customer = relationship("Customer", back_populates="slas")


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    subject = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    analysis = Column(Text, nullable=False)
    priority = Column(String(50), nullable=False)
    status = Column(String(50), default="Open")
    unique_id = Column(String(100), unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    agent_response = Column(Text, nullable=True)

    customer = relationship("Customer", back_populates="tickets")
    communications = relationship("CommunicationHistory", back_populates="ticket")

class EmailTemplate(Base):
    __tablename__ = "email_templates"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    subject = Column(String(200), nullable=False)
    body = Column(Text, nullable=False)

class CommunicationHistory(Base):
    __tablename__ = "communication_history"
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    ticket = relationship("Ticket", back_populates="communications")


class UserRole(PyEnum):
    ADMIN = "admin"
    AGENT = "agent"
    CUSTOMER = "customer"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(200), unique=True, index=True)
    email = Column(String(200), unique=True, index=True)
    password = Column(String(255))
    role = Column(Enum(UserRole), default=UserRole.AGENT)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(255))
    performed_by = Column(String(255))
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String(255))


class Configuration(Base):
    __tablename__ = "configurations"
    id = Column(Integer, primary_key=True, index=True)
    email_retrieval_frequency = Column(Integer, nullable=False)  
    sla_response_time = Column(Float, nullable=False)
