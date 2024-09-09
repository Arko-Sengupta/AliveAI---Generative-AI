import os
import logging
import pymysql
from dotenv import load_dotenv
from typing import List, Dict, Any
from flask import Blueprint, Flask, jsonify, request, Response
from google.cloud.sql.connector import Connector, IPTypes

# Set Up Logging
logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO,
    handlers=[
        logging.StreamHandler()
    ]
)

# Load Environment Variables
load_dotenv(dotenv_path='.env')

class CountryCodes:
    """Handles Database Connection and Data Retrieval for Country Codes."""
    
    def __init__(self) -> None:
        """Initializes Database Connection Parameters from Environment Variables."""
        self.user: str = os.getenv("USER")
        self.password: str = os.getenv("PASSWORD")
        self.host: str = os.getenv("HOST")
        self.port: int = int(os.getenv("PORT"))
        self.database: str = os.getenv("DATABASE")
    
    def Database_Connection(self) -> pymysql.connections.Connection:
        """Establishes a Connection to the Database using the Google Cloud SQL Connector.
        
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

    def Country_Codes_Table(self) -> List[Dict[str, Any]]:
        """Fetches Country Codes from the Database.
        
        Returns:
            List[Dict[str, Any]]: A list of dictionaries containing Country Names and Country Codes.
        
        Raises:
            Exception: If any Error Occurs during Database Access.
        """
        connection = None
        try:
            connection = self.Database_Connection()
            with connection.cursor() as cursor:
                query = "SELECT CountryName, CountryCode FROM CountryCodes"
                cursor.execute(query)
                result = cursor.fetchall()

            countries = [{"CountryName": row[0], "CountryCode": row[1]} for row in result]
            return countries
        
        except Exception as e:
            logging.error("An Error Occurred while Fetching Country Codes", exc_info=True)
            raise e
        
        finally:
            if connection:
                connection.close()

class CountryCodesAPI:
    """Flask API Class for Handling requests related to Country Codes."""
    
    def __init__(self) -> None:
        self.app = Flask(__name__)
        self.country_codes = CountryCodes()
        self.blueprint = Blueprint('CountryCodes', __name__)
        self.blueprint.add_url_rule(
            rule='/CountryCodes',
            endpoint='CountryCodes',
            view_func=self.Country_Codes_Data,
            methods=['POST']
        )
        self.app.register_blueprint(self.blueprint)
        
    def Authenticate_Request(self, req_data: Dict[str, Any]) -> bool:
        """Authenticates the Incoming Request based on Environment-Stored Credentials.
        
        Args:
            req_data (Dict[str, Any]): The request data containing user, password, and token.
        
        Returns:
            bool: True if the request is Authenticated, False otherwise.
        """
        return (
            req_data.get("user") == os.getenv("AUTH_NAME") and
            req_data.get("password") == os.getenv("AUTH_PASSWORD") and
            req_data.get("token") == os.getenv("AUTH_TOKEN")
        )

    def Country_Codes_Data(self) -> Response:
        """Handles POST requests to fetch Country Codes, with Authentication.
        
        Returns:
            Response: A Flask Response object containing the JSON Response.
        """
        try:
            req_data = request.get_json()

            if not self.Authenticate_Request(req_data):
                return jsonify({"success": False, "message": "Authentication failed"}), 403

            data = self.country_codes.Country_Codes_Table()
            response = {
                "success": True,
                "data": data,
                "message": "Country codes successfully fetched."
            }
            return jsonify(response), 200
        
        except Exception as e:
            logging.error("An Error Occurred during the API Call", exc_info=True)
            return jsonify({"success": False, "message": str(e)}), 400
        
    def run(self):
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0')
        except Exception as e:
            logging.error("An error occurred while running the app", exc_info=True)
            raise e

if __name__ == "__main__":
    
    api = CountryCodesAPI()
    api.run()