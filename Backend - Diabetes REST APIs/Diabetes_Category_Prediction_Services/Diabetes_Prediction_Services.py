import os
import pickle
import logging
import pandas as pd
from dotenv import load_dotenv
from flask import Blueprint, Flask, jsonify, request, Response
from LogisticRegression import LogisticRegressionPredictor

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

class DiabetesCategory:
    def __init__(self) -> None:
        pass
    
    def Diabetes_Predict(self, users_data: dict) -> tuple:
        """Predicts the Diabetes Category based on User's General Data."""
        try:
            X_new = pd.DataFrame([users_data])
            with open('lr_model.pkl', 'rb') as file:
                predictor = pickle.load(file)
                
            users_data["Diabetes"] = predictor.predict(X_new)[0]
            
            if users_data["Diabetes"] <= 0.25:
                users_data["Diabetes Category"] = "Pre-Diabetic"
            elif users_data["Diabetes"] > 0.25 and users_data["Diabetes"] <= 0.5:
                users_data["Diabetes Category"] = "Type-1 Diabetes"
            elif users_data["Diabetes"] > 0.5 and users_data["Diabetes"] <= 0.75:
                users_data["Diabetes Category"] = "Type-2 Diabetes"
            elif users_data["Diabetes"] > 0.75 and users_data["Diabetes"] <= 1.0:
                users_data["Diabetes Category"] = "Type-3 Diabetes"
            
            return users_data
        except Exception as e:
            logging.error("Error Occurred in Diabetes Category Prediction: ", exc_info=e)
            raise e

class DiabetesPredictionAPI:
    
    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.diabetes_category = DiabetesCategory()
        self.blueprint = Blueprint('diabetes_category', __name__)
        self.blueprint.add_url_rule('/diabetes_category', 'diabetes_category', self.Diabetes_Category, methods=['POST'])
        self.app.register_blueprint(self.blueprint)
        
    def Authenticate_Request(self, req_data: dict) -> bool:
        """Authenticates the Incoming Request based on Environment-Stored Credentials."""
        return (
            req_data.get("user") == os.getenv("AUTH_NAME") and
            req_data.get("password") == os.getenv("AUTH_PASSWORD") and
            req_data.get("token") == os.getenv("AUTH_TOKEN")
        )

    def Diabetes_Category(self) -> Response:
        """Predicts the Diabetes Category based on Incoming request Data."""
        try:
            request_data = request.get_json()

            if not self.Authenticate_Request(request_data):
                logging.warning("Request Authentication Failed.")
                return jsonify({
                    "success": False,
                    "data": {},
                    "message": "Authentication Failed."
                }), 403

            request_data = request_data["data"]
            users_data = self.diabetes_category.Diabetes_Predict(request_data)

            response = {
                "success": True,
                "data": users_data,
                "message": "Diabetes Category Predicted!"
            }
            return jsonify(response), 200

        except Exception as e:
            logging.error('An Error Occurred while Diabetes Category Prediction: ', exc_info=e)
            return jsonify({
                "success": False,
                "data": {},
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
    
    diabetes_category_api = DiabetesPredictionAPI()
    diabetes_category_api.run()