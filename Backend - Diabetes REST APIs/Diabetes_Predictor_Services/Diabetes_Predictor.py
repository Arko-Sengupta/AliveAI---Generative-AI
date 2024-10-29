import os
import logging
import requests
from dotenv import load_dotenv
from flask import Blueprint, Flask, jsonify, request, Response

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

class DiabetesPredictor:
    def __init__(self) -> None:
        self.keys = [
                     "Age",
                     "Gender",
                     "Weight",
                     "Height",
                     "Family History",
                     "Physical Activity Level",
                     "Dietary Habits",
                     "Ethinicity/Race",
                     "Medication Use",
                     "Sleep Quality",
                     "Stress Levels",
                     "Waist Circumference",
                     "Hip Circumference",
                     "Smoking Status",
                     "Fasting Blood Glucose"
                     ]
        self.Diabetes_Main_AuthName = os.getenv("AUTH_NAME")
        self.Diabetes_Main_AuthPassword = os.getenv("AUTH_PASSWORD")
        self.Diabetes_Main_AuthToken = os.getenv("AUTH_TOKEN")
        self.Unit_Converter_AuthToken = os.getenv("UNIT_AUTH_TOKEN")
        self.Unit_Converter_Endpoint = os.getenv("UNIT_URL")
    
    def Iterate_None(self, request_data):
        try:
            for key in self.keys:
                if key not in request_data.keys():
                    return False, request_data
                
            for value in request_data.values():
                if value == None or value == "":
                    return False, request_data
            return True, request_data
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e

    def Unit_Converter(self, url, request_data):
        try:
            response = requests.post(url, json=request_data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP Error Occurred: {http_err}")
        except requests.exceptions.ConnectionError as conn_err:
            print(f"Connection Error Occurred: {conn_err}")
        except requests.exceptions.Timeout as timeout_err:
            print(f"Timeout Error Occurred: {timeout_err}")
        except requests.exceptions.RequestException as req_err:
            print(f"Request Error Occurred: {req_err}")
        return None
    
    def Diabetes_Analyze(self, request_data):
        try:
            request_data_copy = request_data
            
            # Check whether all the Features are present with it's values.
            bool, request_data = self.Iterate_None(request_data)
            if not bool:
                return bool, "Features or Values Missing", request_data_copy
            
            # Convert the User Data to standard Units           
            request_data["token"] = self.Unit_Converter_AuthToken
            request_data = self.Unit_Converter(self.Unit_Converter_Endpoint, request_data)
            if request_data["success"] == False:
                return False, "Error Occured while Unit Conversion", request_data_copy
            request_data = request_data["data"]
            
            # Calculate Derived Features
            
            # Predict Cholesterol Level
            # request_data["user"] = self.Diabetes_Main_AuthName
            # request_data["password"] = self.Diabetes_Main_AuthPassword
            # request_data["token"] = self.Diabetes_Main_AuthToken
            
            return True, "Diabetes Prediction Success!", request_data
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e

class DiabetesPredictorAPI:
    
    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.diabetes_predictor = DiabetesPredictor()
        self.blueprint = Blueprint('diabetes_predictor', __name__)
        self.blueprint.add_url_rule('/diabetes_predictor', 'diabetes_predictor', self.Diabetes_Predict, methods=['POST'])
        self.app.register_blueprint(self.blueprint)
        
    def Authenticate_Request(self, req_data: dict) -> bool:
        """Authenticates the Incoming Request based on Environment-Stored Credentials."""
        return (
            req_data.get("user") == os.getenv("AUTH_NAME") and
            req_data.get("password") == os.getenv("AUTH_PASSWORD") and
            req_data.get("token") == os.getenv("AUTH_TOKEN")
        )

    def Diabetes_Predict(self) -> Response:
        """Predicts the Diabetes based on Incoming request Data."""
        try:
            request_data = request.get_json()

            if not self.Authenticate_Request(request_data):
                logging.warning("Request Authentication Failed.")
                return jsonify({
                    "success": False,
                    "message": "Authentication Failed."
                }), 403

            bool, message, prediction = self.diabetes_predictor.Diabetes_Analyze(request_data)

            response = {
                "success": bool,
                "data": prediction,
                "message": message
            }
            return jsonify(response), 200

        except Exception as e:
            logging.error('An Error Occurred while Diabetes Prediction: ', exc_info=e)
            return jsonify({
                "success": False,
                "message": "Failed to Predict Diabetes"
            }), 500

    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0', port=port)
        except Exception as e:
            logging.error('An Error Occurred while running the App: ', exc_info=e)
            raise


if __name__ == '__main__':
    
    diabetes_predictor_api = DiabetesPredictorAPI()
    diabetes_predictor_api.run()