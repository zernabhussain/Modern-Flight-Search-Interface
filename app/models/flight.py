from pydantic import BaseModel

class Flight(BaseModel):
    id: str
    airline: str
    source: str
    sink: str
    duration: str
    price: float
