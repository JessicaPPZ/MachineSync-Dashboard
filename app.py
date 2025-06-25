from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime
from database import SessionLocal, engine
from models import MachineDB, Base

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Crea las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Modelo Pydantic para validación
class Machine(BaseModel):
    name: str
    type: str
    status: str
    uptime: int
    last_error: Optional[str] = None

class MachineResponse(Machine):
    id: int
    timestamp: datetime

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rutas
@app.get("/", response_class=HTMLResponse)
async def get_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/machines", response_model=list[MachineResponse])
async def get_machines(db: Session = Depends(get_db)):
    return db.query(MachineDB).all()

@app.post("/machines", response_model=MachineResponse)
async def create_machine(machine: Machine, db: Session = Depends(get_db)):
    db_machine = MachineDB(**machine.dict())
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return db_machine

@app.put("/machines/{id}", response_model=MachineResponse)
async def update_machine(id: int, machine: Machine, db: Session = Depends(get_db)):
    db_machine = db.query(MachineDB).filter(MachineDB.id == id).first()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Máquina no encontrada")
    for key, value in machine.dict().items():
        setattr(db_machine, key, value)
    db_machine.timestamp = datetime.utcnow()
    db.commit()
    db.refresh(db_machine)
    return db_machine

@app.delete("/machines/{id}")
async def delete_machine(id: int, db: Session = Depends(get_db)):
    db_machine = db.query(MachineDB).filter(MachineDB.id == id).first()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Máquina no encontrada")
    db.delete(db_machine)
    db.commit()
    return {"detail": "Máquina eliminada"}