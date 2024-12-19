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


class UpdatePassword:
    """Handles Database Interaction for Update Password."""
    
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

    def Users_Data_Table(self, email: str, new_password: str, confirm_password: str) -> Tuple[bool, str]:
        """Update Account Password in the Database.
        
        Args:
            email (str): User's email address.
            new_password (str): User's new password.
            confirm_password (str): User's confirm password.
        
        Returns:
            Tuple[bool, str]: A tuple containing a boolean indicating success and a message.
        """
        connection = None
        try:
            if new_password != confirm_password:
                return False, "Password and Confirm Password didn't matched."
            
            connection = self.Database_Connection()
            with connection.cursor() as cursor:
                # Update Accouunt Password
                update_query = """
                    UPDATE UsersData
                    SET Password = %s
                    WHERE Email = %s;
                """
                cursor.execute(update_query, (new_password, email))
                connection.commit()

                return True, "Password Updated Successfully."
        
        except pymysql.MySQLError:
            logging.error("Database Error Occurred: ", exc_info=True)
            return False, "Database Error Occurred. Please try again later."
        except Exception:
            logging.error("An Unexpected Error Occurred: ", exc_info=True)
            return False, "An Unexpected Error Occurred. Please try again later."
        
        finally:
            if connection:
                connection.close()


class UpdatePasswordAPI:
    """Flask API Class for Handling Update Password Requests."""
    
    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.update_password = UpdatePassword()
        self.blueprint = Blueprint('UpdatePassword', __name__)
        self.blueprint.add_url_rule(
            rule='/UpdatePassword',
            endpoint='UpdatePassword',
            view_func=self.Update_Password,
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
            req_data.get("token") == os.getenv("AUTH_TOKEN_UPDATEPASS")
        )

    def Update_Password(self) -> Response:
        """Handles POST requests for Update Password.
        
        Returns:
            Response: A Flask Response object containing the JSON Response.
        """
        try:
            req_data = request.get_json()

            # Authenticate Request
            if not self.Authenticate_Request(req_data):
                return jsonify({"success": False, "message": "Authentication failed"}), 403

            # Check whether Account Exists or not
            success, message = self.update_password.Users_Data_Table(req_data["email"], req_data["userpassword"], req_data["confirmpassword"])
            response = {"success": success, "message": message}

            return jsonify(response), 200
        except Exception:
            logging.error("An Error Occurred during the Updating Password", exc_info=True)
            return jsonify({"success": False, "message": "An Error Occurred. Please try again later."}), 500

    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0', port=port)
        except Exception:
            logging.error("An Error Occurred while running the App", exc_info=True)


if __name__ == "__main__":
    
    update_password_api = UpdatePasswordAPI()
    update_password_api.run()