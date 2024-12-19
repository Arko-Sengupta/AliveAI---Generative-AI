import os
import logging
import pymysql
from typing import Tuple
from datetime import date
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


class UpdateDiabetesData:
    """Handles Database Interaction for User Diabetes Data Update."""
    
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

    def Users_Diabetes_Data_Table(self, email: str, data: dict) -> Tuple[bool, str]:
        """Update Diabetes Data of an User in the Database
        
        Args:
            email (str): User's Email of the Account.
            data (dict): User's Updated Diabetes Data.
        
        Returns:
            Tuple[bool, str]: A tuple containing a boolean indicating success and a message.
        """
        connection = None
        try:
            connection = self.Database_Connection()
            with connection.cursor() as cursor:
                fetch_OprCount = """
                  SELECT OperationCount
                  FROM UsersDiabetesData
                  WHERE Email = %s;
                """
                cursor.execute(fetch_OprCount, (email,))
                
                try:
                    OperationCount = cursor.fetchone()[0]
                    if OperationCount == None:
                        OperationCount = 1
                    else:
                        None_Value = lambda d: any(value is None for value in d.values())
                        if None_Value(data):
                            return False, "Missing Diabetes Data from the Table."
                        OperationCount += 1
                except:
                    return False, "Email does not exists."
                
                LastDate = date.today()
                   
                # Update User Diabetes Data in Database
                update_query = """
                 UPDATE UsersDiabetesData
                 SET 
                     Age = %s,
                     Gender = %s,
                     Weight = %s,
                     Height = %s,
                     FamilyHistory = %s,
                     PhysicalActivityLevel = %s,
                     DietaryHabits = %s,
                     EthnicityRace = %s,
                     MedicationUse = %s,
                     SleepDurationQuality = %s,
                     StressLevels = %s,
                     WaistCircumference = %s,
                     HipCircumference = %s,
                     SmokingStatus = %s,
                     FastingBloodGlucose = %s,
                     HbA1c = %s,
                     WaistToHipRatio = %s,
                     BMI = %s,
                     CholesterolLevel = %s,
                     DiabetesStatus = %s,
                     DiabetesCategory = %s,
                     OperationCount = %s,
                     LastDate = %s
                WHERE
                     Email = %s
                """
                
                # Define the values to update
                values = (
                    data["Age"],
                    data["Gender"],
                    data["Weight"],
                    data["Height"],
                    data["Family History"],
                    data["Physical Activity Level"],
                    data["Dietary Habits"],
                    data["Ethinicity/Race"],
                    data["Medication Use"],
                    data["Sleep Quality"],
                    data["Stress Levels"],
                    data["Waist Circumference"],
                    data["Hip Circumference"],
                    data["Smoking Status"],
                    data["Fasting Blood Glucose"],
                    data["HbA1c"],
                    data["Waist-to-Hip Ratio"],
                    data["BMI"],
                    data["Cholesterol Level"],
                    data["Diabetes"],
                    data["Diabetes Category"],
                    OperationCount,
                    LastDate,
                    email
                )
                cursor.execute(update_query, values)
                connection.commit()

                return True, "User Diabetes Data Updated Successfully"
        except pymysql.MySQLError:
            logging.error("Database Error Occurred: ", exc_info=True)
            return False, "Database Error Occurred. Please try again later."
        except Exception:
            logging.error("An Unexpected Error Occurred: ", exc_info=True)
            return False, "An Unexpected Error Occurred. Please try again later."      
        finally:
            if connection:
                connection.close()


class UpdateDiabetesDataAPI:
    """Flask API Class for Handling User Diabetes Data Update Requests."""
    
    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.update_diabetes_data = UpdateDiabetesData()
        self.blueprint = Blueprint('UpdateDiabetesData', __name__)
        self.blueprint.add_url_rule(
            rule='/UpdateDiabetesData',
            endpoint='UpdateDiabetesData',
            view_func=self.Update_Diabetes_Data,
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
            req_data.get("token") == os.getenv("AUTH_TOKEN_UPDATEDIA")
        )

    def Update_Diabetes_Data(self) -> Response:
        """Handles POST requests for User Update Diabetes Data.
        
        Returns:
            Response: A Flask Response object containing the JSON Response.
        """
        try:
            req_data = request.get_json()

            # Authenticate Request
            if not self.Authenticate_Request(req_data):
                return jsonify({"success": False, "message": "Authentication failed"}), 403

            # Register User
            success, message = self.update_diabetes_data.Users_Diabetes_Data_Table(req_data["email"], req_data["data"])
            response = {"success": success, "message": message}
            return jsonify(response), 200

        except Exception:
            logging.error("An Error Occurred during the Updating User's Diabetes Data", exc_info=True)
            return jsonify({"success": False, "message": "An Error Occurred. Please try again later."}), 500
        
    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0')
        except Exception:
            logging.error("An Error Occurred while running the App", exc_info=True)


if __name__ == "__main__":
    
    update_user_diabetes_data_api = UpdateDiabetesDataAPI()
    update_user_diabetes_data_api.run()