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


class DeleteAccount:
    """Handles Database Interaction for User Deletion."""

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

    def Delete_User(self, email: str) -> Tuple[bool, str]:
        """Deletes a User from the Database based on Email.

        Args:
            user_identifier (str): Email of the User to be Deleted.

        Returns:
            Tuple[bool, str]: A tuple containing a Boolean Indicating Success and a Message.
        """
        connection = None
        try:
            connection = self.Database_Connection()
            with connection.cursor() as cursor:
                # Delete User from the Database
                delete_query = """
                    DELETE FROM UsersData
                    WHERE Email = %s;
                """
                cursor.execute(delete_query, (email,))
                connection.commit()
                
                if cursor.rowcount == 0:
                    return False, "No User Found with the Given Email."
                
                return True, "User Account Deleted Successfully."

        except pymysql.MySQLError:
            logging.error("Database Error Occurred: ", exc_info=True)
            return False, "Database Error Occurred. Please try again later."
        except Exception:
            logging.error("An Unexpected Error Occurred: ", exc_info=True)
            return False, "An Unexpected Error Occurred. Please try again later."

        finally:
            if connection:
                connection.close()


class DeleteAccountAPI:
    """Flask API Class for Handling Delete Account Requests."""

    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.delete_account = DeleteAccount()
        self.blueprint = Blueprint('DeleteAccount', __name__)
        self.blueprint.add_url_rule(
            rule='/delete_account',
            endpoint='delete_account',
            view_func=self.Delete_Account,
            methods=['DELETE']
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
            req_data.get("token") == os.getenv("AUTH_TOKEN_DELETE")
        )

    def Delete_Account(self) -> Response:
        """Handles DELETE requests for User Account Deletion.

        Returns:
            Response: A Flask Response object containing the JSON Response.
        """
        try:
            req_data = request.get_json()

            # Authenticate Request
            if not self.Authenticate_Request(req_data):
                return jsonify({"success": False, "message": "Authentication Failed"}), 403

            # Delete User
            success, message = self.delete_account.Delete_User(req_data["email"])
            response = {"success": success, "message": message}
            return jsonify(response), 200

        except Exception:
            logging.error("An Error Occurred during the Account Deletion Process", exc_info=True)
            return jsonify({"success": False, "message": "An Error Occurred. Please try again later."}), 500

    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0', port=port)
        except Exception:
            logging.error("An Error Occurred while running the App", exc_info=True)


if __name__ == "__main__":
    
    delete_account_api = DeleteAccountAPI()
    delete_account_api.run()
