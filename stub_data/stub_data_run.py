import boto3
import uuid
from app.utils.flight_data_generator import flight_data
from datetime import date
from botocore.exceptions import ClientError

# DynamoDB connection
dynamodb = boto3.resource('dynamodb')
flights_table = dynamodb.Table('FlightsServiceDataTable')

def insert_flights_to_dynamodb(flights):
    total_flights = len(flights)
    successful_inserts = 0
    failed_inserts = 0

    for idx, flight in enumerate(flights, start=1):
        # Add a unique FlightId
        flight['FlightId'] = str(uuid.uuid4())  # Generate a unique ID
        flight['departure_dt'] = flight['departure_dt'].isoformat()
        flight['arrival_dt'] = flight['arrival_dt'].isoformat()

        try:
            # Insert into DynamoDB
            flights_table.put_item(Item=flight)
            successful_inserts += 1
            print(f"Inserted {idx}/{total_flights} - FlightId: {flight['FlightId']}")
        except ClientError as e:
            failed_inserts += 1
            print(f"Error inserting flight {idx}/{total_flights}: {e.response['Error']['Message']}")

    # Final summary
    print(f"\nInsertion complete: {successful_inserts} successful, {failed_inserts} failed.")

if __name__ == "__main__":
    flights = flight_data(
        source="London",
        sink="Amsterdam",
        departure_date=date(2024, 10, 3),
        return_date=date(2024, 10, 10),
    )

    # Insert flights into DynamoDB with progress and error handling
    insert_flights_to_dynamodb(flights)
