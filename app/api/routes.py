from typing import Optional
from fastapi import HTTPException, Query, APIRouter 
from starlette.requests import Request
from datetime import date
from app.services.flight_service import get_flights

router = APIRouter() 

@router.get("/flights")
async def flight_search(
    request: Request,
    source: str = Query(..., description="Departure location", min_length=3, max_length=50),
    sink: str = Query(..., description="Arrival location", min_length=3, max_length=50),
    departure_date: date = Query(..., description="Flight departure date"),
    return_date: Optional[date] = Query(None, description="Flight return date (if applicable)"),
    from_db: Optional[bool] = Query(False, description="Fetch data from DynamoDB if True, otherwise fetch from stub")
):
    try:
        # Fetch filtered flight data based on the provided criteria
        flights = get_flights(source, sink, departure_date, return_date, from_db)
        
        if not flights:
            return {"message": "No flights found for the given criteria."} 
        
        return flights 
       

    except ValueError as ve:
        # Handle cases like invalid date formats or other validation issues
        raise HTTPException(status_code=400, detail=str(ve))

    except Exception as e:
        # Log the error for debugging
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
