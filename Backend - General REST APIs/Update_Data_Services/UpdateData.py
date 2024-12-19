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


class UpdateData:
    """Handles Database Interaction for User Data Update."""
    
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

    def Users_Data_Table(self, full_name: str, user_name: str, email: str, password: str,
                      country: str, country_code: str, phone_number: str, address: str, old_email: str) -> Tuple[bool, str]:
        """Update Data of an User in the Database
        
        Args:
            full_name (str): User's full name.
            user_name (str): Desired username.
            email (str): User's email address.
            password (str): User's password.
            country (str): Country of residence.
            country_code (str): Country code.
            phone_number (str): User's phone number.
            address (str): User's address.
        
        Returns:
            Tuple[bool, str]: A tuple containing a boolean indicating success and a message.
        """
        connection = None
        try:
            connection = self.Database_Connection()
            with connection.cursor() as cursor:
                # Update User Data in Database
                update_query = """
                    UPDATE UsersData
                    SET 
                        FullName = %s,
                        Username = %s,
                        Email = %s,
                        Password = %s,
                        Country = %s,
                        CountryCode = %s,
                        MobileNumber = %s,
                        Address = %s
                    WHERE 
                        Email = %s;

                """
                cursor.execute(update_query, (full_name, user_name, email, password, country, country_code, phone_number, address, old_email))
                connection.commit()

                return True, "User Data Updated Successfully"
        except pymysql.MySQLError:
            logging.error("Database Error Occurred: ", exc_info=True)
            return False, "Database Error Occurred. Please try again later."
        except Exception:
            logging.error("An Unexpected Error Occurred: ", exc_info=True)
            return False, "An Unexpected Error Occurred. Please try again later."      
        finally:
            if connection:
                connection.close()


class UpdateDataAPI:
    """Flask API Class for Handling User Data Update Requests."""
    
    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.update_data = UpdateData()
        self.blueprint = Blueprint('UpdateData', __name__)
        self.blueprint.add_url_rule(
            rule='/UpdateData',
            endpoint='UpdateData',
            view_func=self.Update_Data,
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
            req_data.get("token") == os.getenv("AUTH_TOKEN_UPDATE")
        )

    def Update_Data(self) -> Response:
        """Handles POST requests for User Update Data.
        
        Returns:
            Response: A Flask Response object containing the JSON Response.
        """
        try:
            req_data = request.get_json()

            # Authenticate Request
            if not self.Authenticate_Request(req_data):
                return jsonify({"success": False, "message": "Authentication failed"}), 403

            # Register User
            success, message = self.update_data.Users_Data_Table(
                req_data["fullname"], req_data["username"], req_data["email"], req_data["userpassword"],
                req_data["country"], req_data["countrycode"], req_data["phone"], req_data["address"], req_data["old_email"]
            )
            response = {"success": success, "message": message}
            return jsonify(response), 200

        except Exception:
            logging.error("An Error Occurred during the Updating User's Data", exc_info=True)
            return jsonify({"success": False, "message": "An Error Occurred. Please try again later."}), 500
        
    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0')
        except Exception:
            logging.error("An Error Occurred while running the App", exc_info=True)


if __name__ == "__main__":
    
    update_userdata_api = UpdateDataAPI()
    update_userdata_api.run()