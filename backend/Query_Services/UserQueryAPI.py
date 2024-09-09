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


class UserQuery:
    """Handles Database Interaction for Storing User Queries."""

    def __init__(self) -> None:
        """Initializes Database Connection parameters from Environment Variables."""
        self.user: str = os.getenv("USER")
        self.password: str = os.getenv("PASSWORD")
        self.host: str = os.getenv("HOST")
        self.port: str = int(os.getenv("PORT"))
        self.database: str = os.getenv("DATABASE")

    def Database_Connection(self) -> pymysql.connections.Connection:
        """Establishes a Connection to the Database using Google Cloud SQL Connector.
        
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

    def Users_Query_Table(self, name: str, email: str, query: str) -> Tuple[bool, str]:
        """Saves the User's Query to the Database.
        
        Args:
            name (str): The user's name.
            email (str): The user's email.
            query (str): The user's query.
        
        Returns:
            Tuple[bool, str]: A tuple containing a success flag and a message.
        """
        connection = None
        try:
            connection = self.Database_Connection()
            with connection.cursor() as cursor:
                insert_query = """
                    INSERT INTO UsersQueries (Name, Email, Query)
                    VALUES (%s, %s, %s)
                """
                cursor.execute(insert_query, (name, email, query))
                connection.commit()
                logging.info("Query saved successfully for user: %s", name)
                return True, "Query Saved Successfully"     
        except pymysql.MySQLError:
            logging.error("Database Error Occurred: ", exc_info=True)
            return False, "Database Error Occurred. Please try again later." 
        except Exception:
            logging.error("An Unexpected Error Occurred: ", exc_info=True)
            return False, "An Unexpected Error Occurred. Please try again later."
        finally:
            if connection:
                connection.close()


class UserQueryAPI:
    """Flask API Class for Handling User Query Submissions."""

    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.user_query = UserQuery()
        self.blueprint = Blueprint('UserQuery', __name__)
        self.blueprint.add_url_rule(
            rule='/UserQuery',
            endpoint='UserQuery',
            view_func=self.User_Query,
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
            req_data.get("token") == os.getenv("AUTH_TOKEN")
        )

    def User_Query(self) -> Response:
        """Handles POST Requests to save User Queries.
        
        Returns:
            Response: A Flask Response object containing the result of the query submission.
        """
        try:
            req_data = request.get_json()

            # Authenticate Request
            if not self.Authenticate_Request(req_data):
                logging.warning("Request Authentication Failed.")
                return jsonify({
                    "success": False,
                    "message": "Authentication Failed."
                }), 403

            # Save User Query
            success, message = self.user_query.Users_Query_Table(req_data["name"], req_data["email"], req_data["query"])

            response = {"success": success, "message": message}
            return jsonify(response), 200 if success else 500

        except Exception:
            logging.error("An Error Occurred while Handling the Query Submission: ", exc_info=True)
            return jsonify({
                "success": False,
                "message": "Failed to process query. Please try again."
            }), 500

    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0')
        except Exception as e:
            logging.error("An Error Occurred while running the App: ", exc_info=True)
            raise e


if __name__ == "__main__":
    
    user_query_api = UserQueryAPI()
    user_query_api.run()