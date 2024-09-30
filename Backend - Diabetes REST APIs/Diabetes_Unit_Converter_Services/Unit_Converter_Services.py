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

class UnitConverter:
    def __init__(self) -> None:
        pass
    
    def circumference_convert(self, circumference: float, unit: str) -> tuple:
        """Convert circumference to centimeters."""
        try:
            if unit == "cm":
                return circumference, unit
            elif unit == "m":
                return circumference * 100, "cm"
            elif unit == "in":
                return circumference * 2.54, "cm"
            else:
                return circumference, "Unknown"
        except Exception as e:
            logging.error("Error Occurred in Circumference Conversion: ", exc_info=e)
            raise e

    def glucose_convert(self, blood_glucose: float, unit: str) -> tuple:
        """Convert Blood Glucose to mg/dl."""
        try:
            if unit == "mg/dl":
                return blood_glucose, unit
            elif unit == "mg/L":
                return blood_glucose / 10, "mg/dl"
            else:
                return blood_glucose, "Unknown"
        except Exception as e:
            logging.error("Error Occurred in Glucose Conversion: ", exc_info=e)
            raise e


class UnitConverterAPI:
    
    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.unit_convert = UnitConverter()
        self.blueprint = Blueprint('unit_converter', __name__)
        self.blueprint.add_url_rule('/d-convert_units', 'd-convert_units', self.Convert_Units, methods=['POST'])
        self.app.register_blueprint(self.blueprint)
        
    def Authenticate_Request(self, req_data: dict) -> bool:
        """Authenticates the Incoming Request based on Environment-Stored Credentials."""
        return (
            req_data.get("user") == os.getenv("AUTH_NAME") and
            req_data.get("password") == os.getenv("AUTH_PASSWORD") and
            req_data.get("token") == os.getenv("AUTH_TOKEN")
        )

    def Convert_Units(self) -> Response:
        """Handles the conversion of units based on incoming request data."""
        try:
            request_data = request.get_json()

            if not self.Authenticate_Request(request_data):
                logging.warning("Request authentication failed.")
                return jsonify({
                    "success": False,
                    "message": "Authentication Failed."
                }), 403

            converted_data = {
                "Hip Circumference": self.unit_convert.circumference_convert(*request_data["Hip Circumference"]),
                "Waist Circumference": self.unit_convert.circumference_convert(*request_data["Waist Circumference"]),
                "Fasting Blood Glucose": self.unit_convert.glucose_convert(*request_data["Fasting Blood Glucose"])
            }

            response = {
                "success": True,
                "data": converted_data,
                "message": "Units Converted Successfully!"
            }
            return jsonify(response), 200

        except Exception as e:
            logging.error('An Error Occurred while Converting Units: ', exc_info=e)
            return jsonify({
                "success": False,
                "message": "Failed to Convert Units"
            }), 500

    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0', port=port)
        except Exception as e:
            logging.error('An Error Occurred while running the App: ', exc_info=e)
            raise


if __name__ == '__main__':
    
    unit_converter_api = UnitConverterAPI()
    unit_converter_api.run()