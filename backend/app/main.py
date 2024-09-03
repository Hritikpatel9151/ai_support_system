from fastapi import FastAPI
from .database import engine, Base
from app.routers import ticket, customer, service, sla, communication_history, email_template,user,configuration
from app.email_service import periodic_email_fetch
import logging
import asyncio
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
   loop = asyncio.get_event_loop()
   task = loop.create_task(periodic_email_fetch())
   yield
   task.cancel()
   try:
       await task
   except asyncio.CancelledError:
       logger.info("Email processing task cancelled")
  
app = FastAPI(lifespan=lifespan)
# app = FastAPI()

origins = [
    "http://localhost:3000",  # Frontend development server
   
]

# Add CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Enabled Support System API"}

# Create database tablesc
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(ticket.router)
app.include_router(customer.router)
app.include_router(service.router)
app.include_router(sla.router)
app.include_router(email_template.router)
app.include_router(communication_history.router)
app.include_router(user.router)
app.include_router(configuration.router)




