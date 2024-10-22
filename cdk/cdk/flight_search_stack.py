from aws_cdk import Stack, CfnOutput
from aws_cdk import aws_dynamodb as dynamodb
from constructs import Construct

class FlightSearchStack(Stack):

    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Define the DynamoDB table
        flights_table = dynamodb.Table(
            self, "FlightsTable",
            table_name='FlightsServiceDataTable',
            partition_key=dynamodb.Attribute(
                name="FlightId",  # Use a Flight ID or a unique key
                type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST
        )

        # Output the table name
        CfnOutput(
            self, "FlightsTableName",
            value=flights_table.table_name
        )
