from datetime import date
from app.utils.flight_data_generator import flight_data

def test_flight_data_generator():
    flights = flight_data("London", "Amsterdam", date(2024, 10, 3), date(2024, 10, 10))
    assert len(flights) > 0
    assert flights[0]["source"] == "London"
    assert flights[0]["sink"] == "Amsterdam"
