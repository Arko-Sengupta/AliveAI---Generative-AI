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


class SignUp:
    """Handles Database Interaction for User Sign-Up."""
    
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
                      country: str, country_code: str, phone_number: str, address: str) -> Tuple[bool, str]:
        """Registers a New User in the Database after Validating Input.
        
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
                # Validate if the Email, Username, or Phone number Already Exists
                validate_query = """
                    SELECT Email, Username, MobileNumber
                    FROM UsersData
                    WHERE Email = %s OR Username = %s OR MobileNumber = %s;
                """
                cursor.execute(validate_query, (email, user_name, phone_number))
                existing_data = cursor.fetchall()

                email_exists = any(row[0] == email for row in existing_data)
                username_exists = any(row[1] == user_name for row in existing_data)
                phone_exists = any(row[2] == phone_number for row in existing_data)

                if email_exists:
                    return False, "Email Already Registered."
                if username_exists:
                    return False, "Username Already Registered."
                if phone_exists:
                    return False, "Phone Number Already Registered."

                # Insert New User into the Database
                insert_query = """
                    INSERT INTO UsersData (
                        FullName, Username, Email, `Password`, Country,
                        CountryCode, MobileNumber, Address
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
                """
                cursor.execute(insert_query, (full_name, user_name, email, password, country, country_code, phone_number, address))
                connection.commit()
                return True, "User Registered Successfully"
        
        except pymysql.MySQLError:
            logging.error("Database Error Occurred: ", exc_info=True)
            return False, "Database Error Occurred. Please try again later."
        except Exception:
            logging.error("An Unexpected Error Occurred: ", exc_info=True)
            return False, "An Unexpected Error Occurred. Please try again later."
        
        finally:
            if connection:
                connection.close()


class SignUpAPI:
    """Flask API Class for Handling Sign-Up Requests."""
    
    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.sign_up = SignUp()
        self.blueprint = Blueprint('SignUp', __name__)
        self.blueprint.add_url_rule(
            rule='/SignUp',
            endpoint='SignUp',
            view_func=self.Sign_Up,
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
            req_data.get("token") == os.getenv("AUTH_TOKEN_SIGNUP")
        )

    def Sign_Up(self) -> Response:
        """Handles POST requests for User Sign-Up.
        
        Returns:
            Response: A Flask Response object containing the JSON Response.
        """
        try:
            req_data = request.get_json()

            # Authenticate Request
            if not self.Authenticate_Request(req_data):
                return jsonify({"success": False, "message": "Authentication failed"}), 403

            # Register User
            success, message = self.sign_up.Users_Data_Table(
                req_data["fullname"], req_data["username"], req_data["email"], req_data["userpassword"],
                req_data["country"], req_data["countrycode"], req_data["phone"], req_data["address"]
            )
            response = {"success": success, "message": message}
            return jsonify(response), 200

        except Exception:
            logging.error("An Error Occurred during the Sign-Up Process", exc_info=True)
            return jsonify({"success": False, "message": "An Error Occurred. Please try again later."}), 500

    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0')
        except Exception:
            logging.error("An Error Occurred while running the App", exc_info=True)


if __name__ == "__main__":
    
    sign_up_api = SignUpAPI()
    sign_up_api.run()