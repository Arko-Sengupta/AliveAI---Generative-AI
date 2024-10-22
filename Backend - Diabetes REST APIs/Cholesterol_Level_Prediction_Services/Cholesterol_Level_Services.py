import os
import logging
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

class CholesterolLevel:
    def __init__(self) -> None:
        pass
    
    def Cholesterol_Predict(self, users_data: dict) -> tuple:
        """Predicts the Cholesterol Level based on User's General Data."""
        try:
            # Dummy Value
            users_data["Cholesterol Level"] = 205
            return users_data, True
        except Exception as e:
            logging.error("Error Occurred in Cholesterol Level Prediction: ", exc_info=e)
            raise e

class CholesterolPredictionAPI:
    
    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.cholesterol_level = CholesterolLevel()
        self.blueprint = Blueprint('cholesterol_level', __name__)
        self.blueprint.add_url_rule('/cholesterol_level', 'cholesterol_level', self.Cholesterol_Level, methods=['POST'])
        self.app.register_blueprint(self.blueprint)
        
    def Authenticate_Request(self, req_data: dict) -> bool:
        """Authenticates the Incoming Request based on Environment-Stored Credentials."""
        return (
            req_data.get("user") == os.getenv("AUTH_NAME") and
            req_data.get("password") == os.getenv("AUTH_PASSWORD") and
            req_data.get("token") == os.getenv("AUTH_TOKEN")
        )

    def Cholesterol_Level(self) -> Response:
        """Predicts the Cholesterol Level based on Incoming request Data."""
        try:
            request_data = request.get_json()

            if not self.Authenticate_Request(request_data):
                logging.warning("Request Authentication Failed.")
                return jsonify({
                    "success": False,
                    "message": "Authentication Failed."
                }), 403

            users_data = self.cholesterol_level.Cholesterol_Predict(request_data)

            response = {
                "success": True,
                "data": users_data,
                "message": "Cholesterol Level Predicted!"
            }
            return jsonify(response), 200

        except Exception as e:
            logging.error('An Error Occurred while Cholesterol Level Prediction: ', exc_info=e)
            return jsonify({
                "success": False,
                "message": "Failed to Predict Cholesterol"
            }), 500

    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0', port=port)
        except Exception as e:
            logging.error('An Error Occurred while running the App: ', exc_info=e)
            raise


if __name__ == '__main__':
    
    cholesterol_level_api = CholesterolPredictionAPI()
    cholesterol_level_api.run()