from app.utils.flight_data_generator import flight_data
from datetime import date
from typing import List, Optional
from app.models.flight import Flight 
import boto3
from boto3.dynamodb.conditions import Key, Attr

# Set up DynamoDB connection
dynamodb = boto3.resource('dynamodb')
flights_table = dynamodb.Table('FlightsServiceDataTable')

def get_flights_from_db(departure: str, arrival: str, departure_date: Optional[date] = None, return_date: Optional[date] = None):
    # Convert dates to ISO 8601 format strings
    departure_date_str = departure_date.isoformat() if departure_date else None
    return_date_str = return_date.isoformat() if return_date else None

    # Base filter expression
    filter_expr = Key('source').eq(departure) & Key('sink').eq(arrival)

    # Add date conditions if provided
    if departure_date_str:
        filter_expr = filter_expr & Attr('departure_dt').begins_with(departure_date_str)
    if return_date_str:
        filter_expr = filter_expr & Attr('return_dt').begins_with(return_date_str)

    # Query DynamoDB
    response = flights_table.scan(FilterExpression=filter_expr)
    return response['Items'] 

def get_flights(
    source: str, 
    sink: str, 
    departure_date: date,
    return_date: Optional[date] = None,
    from_db: Optional[bool] = False
) -> List[Flight]:
    
    if from_db:
        return get_flights_from_db(source, sink, departure_date, return_date)
    else:
        return flight_data(source, sink, departure_date, return_date)
   




