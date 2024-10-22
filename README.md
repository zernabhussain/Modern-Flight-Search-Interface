# Modern Flight Search Interface

A modern flight search interface that demonstrates the power of minimal JavaScript architecture using cutting-edge web technologies. This project showcases how to build an interactive flight search application with a clean, user-friendly interface while maintaining excellent performance and developer experience.

## Project Overview

The application consists of two main components:

### Frontend
A modern web interface built with a "HTML-first" approach using:
- **HTMX** for dynamic content updates without complex JavaScript
- **AlpineJS** for lightweight UI interactions and state management
- **Tailwind CSS** for utility-first styling and consistent design

### Backend
A robust API service powered by:
- **FastAPI** framework for high-performance API endpoints
- **AWS DynamoDB** for scalable flight data storage
- **AWS CDK** for infrastructure as code
- Python stub data generator for development and testing

The project demonstrates how modern web applications can be built with minimal JavaScript while maintaining rich interactivity through HTMX's HTML-over-the-wire approach. The interface provides real-time flight search capabilities, advanced filtering options, and dynamic sorting functionality, all while maintaining a clean and maintainable codebase.

## Project Scope and Limitations

As this is a demonstration project focused on showcasing the integration of HTMX, AlpineJS, and Tailwind CSS, certain aspects were intentionally left out of scope:

### Current Implementation Focus
- Desktop and tablet viewport optimization
- Core flight search and filtering functionality
- AWS DynamoDB integration demonstration
- Basic error handling and user feedback
- Demonstration of HTMX's dynamic content-loading capabilities

### Intentionally Out of Scope
- Mobile responsiveness (focused on desktop-first approach for demonstration)
- Test coverage (unit tests, integration tests, and end-to-end tests)
- Authentication and user management
- Booking and payment processing
- Advanced error handling and edge cases
- Performance optimization and caching
- Accessibility features
- Comprehensive documentation

## Project Structure

```
├── app/                          # Main FastAPI app
│   ├── main.py                   # FastAPI entry point
│   ├── models                    # Flight data model
│   ├── utils/                    # Utility functions
│   ├── static/                   # UI styling and images files
│   └── templates                 # HTML files 
│
├── cdk/                          # AWS CDK code for provisioning DynamoDB table
│   ├── cdk/                      # CDK stack for DynamoDB
│   └── cdk.json                  # CDK configuration
│
├── stub_data/                    # Stub data generation for DynamoDB
│   ├── stub_data_run.py         # Inserts stub data into DynamoDB                     
│
└── pyproject.toml                # Poetry configuration
```

## Setup Instructions

### Prerequisites

Ensure you have the following installed:
- **Python 3.10 or later** (For running FastAPI)
- **Poetry** (For managing dependencies)
- **AWS CLI** (For deploying to AWS and configuring DynamoDB)
- **AWS CDK** (For provisioning DynamoDB)
- **Boto3** (AWS SDK for Python)
- **npm** - Comes bundled with Node.js (version 10.x or higher)

### Installation and Setup

Detailed setup instructions for local development:

1. **Install Dependencies**
   ```bash
   cd flight-search-suite
   npm i && poetry install
   ```

2. **AWS CDK Setup (Provision DynamoDB)**
   ```bash
   cd cdk
   pip install -r requirements.txt
   cdk bootstrap
   cdk deploy
   ```

3. **Generate and Insert Stub Data**
   ```bash
   cd stub_data
   python stub_data_run.py
   ```

4. **Run the FastAPI Server**
   ```bash
   poetry run uvicorn app.main:app --reload
   ```
   Access the UI at `http://127.0.0.1:8000`

## API Endpoints

### GET /flights
Retrieve available flights based on query parameters.

**Parameters:**
- `source` (Required): Departure city
- `sink` (Required): Arrival city
- `departure_date` (Required): Date of departure
- `return_date` (Optional): Date of return
- `from_db` (Optional, default: false): If true, fetch from DynamoDB

**Example Requests:**
```bash
# Fetch from DynamoDB
GET /flights?source=London&sink=Amsterdam&departure_date=2024-10-03&from_db=true

# Fetch stub data
GET /flights?source=London&sink=Amsterdam&departure_date=2024-10-03
```

## AWS DynamoDB

The backend uses AWS DynamoDB for flight data storage. Key attributes:
- FlightId (Partition Key)
- source
- sink
- Airline
- Departure DateTime
- Arrival DateTime
- Price

The application effectively demonstrates the potential of using HTMX with AlpineJS for building modern web interfaces while showcasing how traditional server-rendered applications can be enhanced with contemporary tools and practices.