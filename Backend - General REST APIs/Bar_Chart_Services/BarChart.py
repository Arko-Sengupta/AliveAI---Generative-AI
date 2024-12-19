import os
import logging
import pymysql
from typing import Tuple
from dotenv import load_dotenv
from flask import Blueprint, Flask, jsonify, request, Response
from google.cloud.sql.connector import Connector, IPTypes

# Set Up Logging
logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO,
    handlers=[logging.StreamHandler()]
)

# Load Environment Variables
load_dotenv(dotenv_path='.env')

# Initialize SERVER PORT
port = int(os.getenv('PORT', 5000))


class BarChart:
    """Handles Database Interaction for Bar Charts"""
    
    def __init__(self) -> None:
        """Initializes Database Connection parameters from Environment Variables."""
        self.user: str = os.getenv("USER")
        self.password: str = os.getenv("PASSWORD")
        self.host: str = os.getenv("HOST")
        self.port: str = int(os.getenv("PORT"))
        self.database: str = os.getenv("DATABASE")

    def Database_Connection(self) -> pymysql.connections.Connection:
        """Establishes a Connection to the database using the Google Cloud SQL Connector.
        
        Returns:
            pymysql.connections.Connection: The database connection object.
        """
        connector = Connector(IPTypes.PUBLIC)
        return connector.connect(
            self.host,
            "pymysql",
            user=self.user,
            password=self.password,
            db=self.database
        )
        
    def BarChart_Values(self, email:str, feature: str, table: str, column: str) -> Tuple[bool, list, str]:
        """
        Return Diagnosis of each Health Feature
        
        Args:
            email (str): User's email address.
            feature (str): Feature Name that user is using.
            table (str): Table name of the Feature Diagnosis.
            column (str): Column of the Feature Table where the diagnosis value exists.
            
        Returns:
            Tuple[bool, list, str]: A tuple containing a boolean indicating success, list containing values and a message.
        """
        connection = None
        try:
            connection = self.Database_Connection()
            with connection.cursor() as cursor:
                
                get_query = f"""
                    SELECT {column}
                    FROM {table}
                    WHERE Email = %s;
                """
                cursor.execute(get_query, (email,))
                value = cursor.fetchone()

                if value and value[0] is not None:
                    diagnosis = round(100*float(value[0]), 4)
                      
                    get_all_query = f"""SELECT {column} FROM {table}"""
                    cursor.execute(get_all_query)
                    
                    values = cursor.fetchall()
                    values = [100*float(row[0]) for row in values]
                    less_values = [val for val in values if val <= diagnosis]
                    
                    percentile = (len(less_values)/len(values))*100
                    
                    return True, percentile
                else:
                    return False, 0  
        except pymysql.MySQLError:
            logging.error("Database Error Occurred: ", exc_info=True)
            return False, "Database Error Occurred. Please try again later."
        except Exception:
            logging.error("An Unexpected Error Occurred: ", exc_info=True)
            return False, "An Unexpected Error Occurred. Please try again later."
        
        finally:
            if connection:
                connection.close()

    def Users_Features_Table(self, email: str) -> Tuple[bool, list]:
        """Get the value of a particluar feature diagnosis report
        
        Args:
            email (str): User's email address.
        
        Returns:
            Tuple[bool, str]: A tuple containing a boolean indicating success and a message.
        """
        try:
            feature_list = {
                "Diabetes": ["UsersDiabetesData", "DiabetesStatus"],
                "Asthma": None,
                "Cadiovascular": None,
                "Arthritis": None,
                "Heart & Stroke": None,
                "Migrane Control": None,
                "Bronchitis": None,
                "Live Condition Analysis": None
            }
            percentile_sum = 0
            
            for key, value in feature_list.items():
                # Remove the Condition afterward once all Services are started.
                if value is not None:
                    success, percentile = self.BarChart_Values(email=email,
                                                                    feature=key,
                                                                    table=value[0],
                                                                    column=value[1])
                    percentile_sum += percentile
            return True, percentile/8, "Percentile of the User Successfully Calculated."
        except Exception:
            logging.error("An Unexpected Error Occurred: ", exc_info=True)
            return False, None, "An Unexpected Error Occurred. Please try again later."


class BarChartsAPI:
    """Flask API Class for Handling Bar Chart Requests."""
    
    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.bar_chart = BarChart()
        self.blueprint = Blueprint('BarChart', __name__)
        self.blueprint.add_url_rule(
            rule='/BarChart',
            endpoint='BarChart',
            view_func=self.Bar_Chart,
            methods=['POST']
        )
        self.app.register_blueprint(self.blueprint)
        
    def Authenticate_Request(self, req_data: dict) -> bool:
        """Authenticates the Incoming Request based on Environment-Stored Credentials.
        
        Args:
            req_data (dict): The request data containing user, password, and token.
        
        Returns:
            bool: True if the request is authenticated, False otherwise.
        """
        return (
            req_data.get("user") == os.getenv("AUTH_NAME") and
            req_data.get("password") == os.getenv("AUTH_PASSWORD") and
            req_data.get("token") == os.getenv("AUTH_TOKEN_BARCHART")
        )

    def Bar_Chart(self) -> Response:
        """Handles POST requests for Bar Chart.
        
        Returns:
            Response: A Flask Response object containing the JSON Response.
        """
        try:
            req_data = request.get_json()

            # Authenticate Request
            if not self.Authenticate_Request(req_data):
                return jsonify({"success": False, "message": "Authentication failed"}), 403

            success, percentile, message = self.bar_chart.Users_Features_Table(req_data["email"])
            response = {"success": success, "data": percentile, "message": message}

            return jsonify(response), 200
        except Exception:
            logging.error("An Error Occurred during the Fetching Bar Charts Data.", exc_info=True)
            return jsonify({"success": False, "message": "An Error Occurred. Please try again later."}), 500

    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0')
        except Exception:
            logging.error("An Error Occurred while running the App", exc_info=True)


if __name__ == "__main__":
    
    bar_chart_api = BarChartsAPI()
    bar_chart_api.run()