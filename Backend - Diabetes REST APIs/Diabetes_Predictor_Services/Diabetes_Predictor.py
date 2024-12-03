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
            "Age", "Gender", "Weight", "Height", "Family History", "Physical Activity Level",
            "Dietary Habits", "Ethinicity/Race", "Medication Use", "Sleep Quality", "Stress Levels",
            "Waist Circumference", "Hip Circumference", "Smoking Status", "Fasting Blood Glucose"
        ]
        self.Diabetes_Main_AuthName = os.getenv("AUTH_NAME")
        self.Diabetes_Main_AuthPassword = os.getenv("AUTH_PASSWORD")
        self.Diabetes_Main_AuthToken = os.getenv("AUTH_TOKEN")
        self.Unit_Converter_AuthToken = os.getenv("UNIT_AUTH_TOKEN")
        self.Unit_Converter_Endpoint = os.getenv("UNIT_URL")
        self.Cholesterol_Level_AuthToken = os.getenv("CHOL_AUTH_TOKEN")
        self.Cholesterol_Level_Endpoint = os.getenv("CHOL_URL")
        self.Diabetes_Cat_AuthToken = os.getenv("DIA_AUTH_TOKEN")
        self.Diabetes_Cat_Endpoint = os.getenv("DIA_URL")
        
    def Handle_Request_Error(self, error: Exception) -> dict:
        """Handles and Logs Errors that Occur during API Requests."""
        logging.error("An Error Occurred: ", exc_info=error)
        return {"success": False, "message": str(error), "data": {}}

    def Unit_Remover(self, request_data: dict) -> dict:
        """Removes Units from certain columns in the Request Data."""
        unit_columns = ["Fasting Blood Glucose", "Height", "Waist Circumference", "Hip Circumference"]
        for col in unit_columns:
            request_data[col] = request_data[col][0]
        return request_data
    
    def Iterate_None(self, request_data: dict) -> tuple:
        """Checks if all required keys are present and have Valid Values."""
        for key in self.keys:
            if key not in request_data.keys():
                return False, request_data
            
        for value in request_data.values():
            if value == None or value == "":
                return False, request_data
        return True, request_data

    def Unit_Converter(self, request_data: dict) -> dict:
        """Converts user data to standard units via an external service."""
        payload = {
            "user": self.Diabetes_Main_AuthName,
            "password": self.Diabetes_Main_AuthPassword,
            "token": self.Unit_Converter_AuthToken,
            "data": request_data
        }
        try:
            response = requests.post(self.Unit_Converter_Endpoint, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return self.Handle_Request_Error(e)

    def Cholesterol_Prediction(self, request_data: dict) -> dict:
        """Predicts cholesterol levels based on the request data."""
        payload = {
            "user": self.Diabetes_Main_AuthName,
            "password": self.Diabetes_Main_AuthPassword,
            "token": self.Cholesterol_Level_AuthToken,
            "data": request_data
        }
        try:
            response = requests.post(self.Cholesterol_Level_Endpoint, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return self.Handle_Request_Error(e)

    def Diabetes_Prediction(self, request_data: dict) -> dict:
        """Predicts diabetes category based on the request data."""        
        payload = {
            "user": self.Diabetes_Main_AuthName,
            "password": self.Diabetes_Main_AuthPassword,
            "token": self.Diabetes_Cat_AuthToken,
            "data": request_data
        }   
        try:
            response = requests.post(self.Diabetes_Cat_Endpoint, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return self.Handle_Request_Error(e)

    def diabetes_analyze(self, request_data: dict) -> tuple:
        """Analyzes the diabetes data, performs predictions, and returns the results."""
        try:
            request_data_copy = request_data
            
            valid, request_data = self.Iterate_None(request_data)
            if not valid:
                return False, "Features or Values Missing", request_data_copy

            # Convert units
            response = self.Unit_Converter(request_data)
            if not response.get("success", False):
                return False, "Error Occurred while Unit Conversion", request_data_copy

            # Clean and Normalize Data
            request_data = self.Unit_Remover(response["data"])

            # Calculate Derived Features
            request_data["HbA1c"] = (request_data["Fasting Blood Glucose"] + 46.7) / 28.7
            request_data["Waist-to-Hip Ratio"] = request_data["Waist Circumference"] / request_data["Hip Circumference"]
            request_data["BMI"] = request_data["Weight"] / (request_data["Height"] ** 2)

            # Predict Cholesterol and Diabetes
            request_data = self.Cholesterol_Prediction(request_data)
            if not request_data.get("success", False):
                return False, "Error Occurred while Cholesterol Prediction", request_data_copy
            request_data["data"]["Ethinicity/Race"] = request_data["data"].pop("Ethnicity/Race")
            
            # Prepare Data for Diabetes Prediction
            diabetes_data = {}
            for key in [
                           'Age', 'Gender', 'Weight', 'Height', 'Family History',
                           'Physical Activity Level', 'Dietary Habits', 'Ethinicity/Race',
                           'Medication Use', 'Sleep Quality', 'Stress Levels',
                           'Waist Circumference', 'Hip Circumference', 'Smoking Status',
                           'Fasting Blood Glucose', 'HbA1c', 'Waist-to-Hip Ratio',
                           'BMI', 'Cholesterol Level'
                       ]:
                diabetes_data[key] = request_data["data"][key]
            
            diabetes_response = self.Diabetes_Prediction(diabetes_data)
            if not diabetes_response.get("success", False):
                return False, "Error Occurred while Diabetes Prediction", request_data_copy

            return True, "Diabetes Prediction Success!", diabetes_response.get("data", {})
        except Exception as e:
            logging.error("An Error Occurred during Diabetes Analysis: ", exc_info=e)
            return self.Handle_Request_Error(e)

class DiabetesPredictorAPI:
    
    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.Diabetes_Predictor = DiabetesPredictor()
        self.blueprint = Blueprint('diabetes_predictor', __name__)
        self.blueprint.add_url_rule('/diabetes_predictor', 'diabetes_predictor', self.Diabetes_Predict, methods=['POST'])
        self.app.register_blueprint(self.blueprint)
        
    def Authenticate_Request(self, req_data: dict) -> bool:
        """Authenticates the Incoming request using Environment-Stored Credentials."""
        return (
            req_data.get("user") == os.getenv("AUTH_NAME") and
            req_data.get("password") == os.getenv("AUTH_PASSWORD") and
            req_data.get("token") == os.getenv("AUTH_TOKEN")
        )

    def Diabetes_Predict(self) -> Response:
        """Predicts Diabetes based on Incoming Request Data."""
        try:
            request_data = request.get_json()

            if not self.Authenticate_Request(request_data):
                logging.warning("Request Authentication Failed.")
                return jsonify({"success": False, "message": "Authentication Failed.", "data": {}}), 403

            request_data = request_data["data"]
            success, message, prediction = self.Diabetes_Predictor.diabetes_analyze(request_data)

            return jsonify({"success": success, "message": message, "data": prediction}), 200

        except Exception as e:
            logging.error('An Error Occurred during Diabetes Prediction: ', exc_info=e)
            return jsonify({
                "success": False,
                "message": f"Failed to predict diabetes: {e}",
                "data": {}
            }), 500

    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0', port=port)
        except Exception as e:
            logging.error('An Error Occurred while running the App: ', exc_info=e)
            raise


if __name__ == '__main__':
    
    Diabetes_Predictor_api = DiabetesPredictorAPI()
    Diabetes_Predictor_api.run()