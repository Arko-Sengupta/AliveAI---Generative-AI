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

class Login:
    """Handles Database Interaction for User Login."""
    
    def __init__(self) -> None:
        """Initializes Database Connection parameters from Environment Variables."""
        self.user: str = os.getenv("USER")
        self.password: str = os.getenv("PASSWORD")
        self.host: str = os.getenv("HOST")
        self.port: str = int(os.getenv("PORT"))
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

    def Users_Data_Table(self, email: str, password: str) -> Tuple[bool, str]:
        """Validates the User's Email and Password against the Database.
        
        Args:
            email (str): The user's email.
            password (str): The user's password.
        
        Returns:
            Tuple[bool, str]: A tuple containing a boolean indicating success and a message.
        """
        connection = None
        try:
            connection = self.Database_Connection()
            with connection.cursor() as cursor:
                # Validate Email Existence
                email_query = "SELECT COUNT(*) FROM UsersData WHERE Email = %s"
                cursor.execute(email_query, (email,))
                email_count = cursor.fetchone()[0]
                
                if email_count == 0:
                    return False, "Invalid Email"
                
                # Validate Password
                password_query = "SELECT Password FROM UsersData WHERE Email = %s"
                cursor.execute(password_query, (email,))
                stored_password = cursor.fetchone()[0]
                
                if stored_password == password:
                    return True, "Login Success!"
                else:
                    return False, "Invalid Password"
        except Exception:
            logging.error("An Error Occurred during user validation", exc_info=True)
            return False, "An Error Occurred. Please try again later."
        
        finally:
            if connection:
                connection.close()

class LoginAPI:
    """Flask API Class for Handling Login Requests."""
    
    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.login = Login()
        self.blueprint = Blueprint('Login', __name__)
        self.blueprint.add_url_rule(
            rule='/Login',
            endpoint='Login',
            view_func=self.Users_Login_Data,
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
            req_data.get("token") == os.getenv("AUTH_TOKEN_LOGIN")
        )

    def Users_Login_Data(self) -> Response:
        """Handles POST requests for User Login.
        
        Returns:
            Response: A Flask Response object containing the JSON Response.
        """
        try:
            req_data = request.get_json()

            if not self.Authenticate_Request(req_data):
                return jsonify({"success": False, "message": "Authentication failed"}), 403

            # Validate Email and Password
            success, message = self.login.Users_Data_Table(req_data["email"], req_data["userpassword"])
            response = {"success": success, "message": message}
            return jsonify(response), 200

        except Exception as e:
            logging.error("An Error Cccurred during the Login Process", exc_info=True)
            return jsonify({"success": False, "message": str(e)}), 400

    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0')
        except Exception:
            logging.error("An Error Occurred while running the App", exc_info=True)


if __name__ == "__main__":
    
    login_api = LoginAPI()
    login_api.run()