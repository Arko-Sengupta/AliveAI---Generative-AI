import os
import random
import smtplib
import logging
from dotenv import load_dotenv
from email.message import EmailMessage
from flask import Blueprint, Flask, jsonify, request, Response

# Set Up Logging
logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO,
    handlers=[logging.StreamHandler()]
)

# Load Environment Variables
load_dotenv(dotenv_path='.env')


class EmailOTP:
    """Class for Generating and Handling Email OTP Tasks."""
    
    def __init__(self) -> None:
        """Initializes Email Server Credentials from Environment Variables."""
        self.email = os.getenv("SERVER_EMAIL")
        self.password = os.getenv("SERVER_PASSWORD")
    
    def Generate_OTP(self) -> str:
        """Generates a 6-digit OTP.
        
        Returns:
            str: The generated 6-digit OTP.
        """
        try:
            otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
            logging.info("OTP Generated Successfully.")
            return otp
        except Exception as e:
            logging.error('An Error Occurred while Generating OTP: ', exc_info=True)
            raise e


class EmailOTPAPI:
    """Flask API Class for Handling OTP Generation and Email Sending."""
    
    def __init__(self) -> None:
        """Initializes the Flask App and sets up the Blueprint."""
        self.app = Flask(__name__)
        self.email_otp = EmailOTP()
        self.blueprint = Blueprint('generate_otp', __name__)
        self.blueprint.add_url_rule('/GenerateOTP', 'GenerateOTP', self.Generate_Email_OTP, methods=['POST'])
        self.app.register_blueprint(self.blueprint)
    
    def Authenticate_Request(self, req_data: dict) -> bool:
        """Authenticates the Incoming Request based on Evironment-Stored Credentials.
        
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

    def Generate_Email_Message(self, otp: str, recipient_email: str) -> EmailMessage:
        """Creates an Email Message containing the OTP.
        
        Args:
            otp (str): The OTP to be sent.
            recipient_email (str): The recipient's email address.
        
        Returns:
            EmailMessage: The constructed email message.
        """
        try:
            msg = EmailMessage()
            msg['Subject'] = 'AliveAI Email Authentication'
            msg['From'] = f'AliveAI <{self.email_otp.email}>'
            msg['To'] = recipient_email
            msg.set_content(f"Your OTP is: {otp}. It will expire within 300 seconds.")
            logging.info(f"Email Message created for Recipient: {recipient_email}")
            return msg
        except Exception as e:
            logging.error('An Error Occurred while creating the Email Message: ', exc_info=True)
            raise e

    def Email_Server_AUTH(self) -> smtplib.SMTP_SSL:
        """Logs in to the Email Server and returns the SMTP Connection.
        
        Returns:
            smtplib.SMTP_SSL: The SMTP server connection.
        """
        try:
            server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            server.login(self.email_otp.email, self.email_otp.password)
            logging.info("Successfully logged in to the email server.")
            return server
        except Exception as e:
            logging.error('An error occurred during email server login: ', exc_info=True)
            raise e

    def Generate_Email_OTP(self) -> Response:
        """Handles OTP Generation and sends an email to the Specified Recipient.
        
        Returns:
            Response: A Flask response object containing the result of the OTP generation.
        """
        try:
            request_data = request.get_json()

            # Authenticate the Incoming Request
            if not self.Authenticate_Request(request_data):
                logging.warning("Request Authentication Failed.")
                return jsonify({
                    "success": False,
                    "message": "Authentication Failed."
                }), 403

            recipient_email = request_data.get('to_mail')
            otp = self.email_otp.Generate_OTP()

            # Create the Email Message
            email_message = self.Generate_Email_Message(otp, recipient_email)

            # Log in to Email Server and Send the Message
            email_server = self.Email_Server_AUTH()
            email_server.send_message(email_message)
            email_server.quit()
            logging.info(f"OTP Sent Successfully to {recipient_email}.")

            # Prepare the Response
            response = {
                "success": True,
                "data": {
                    "email": recipient_email,
                    "otp": otp
                },
                "message": f"OTP Sent Successfully to {recipient_email}."
            }
            return jsonify(response), 200

        except Exception:
            logging.error('An Error Occurred during OTP Generation or Email Sending: ', exc_info=True)
            return jsonify({
                "success": False,
                "message": "Failed to send OTP. Please try again."
            }), 500

    def run(self) -> None:
        """Runs the Flask App."""
        try:
            self.app.run(debug=True, host='0.0.0.0')
        except Exception as e:
            logging.error('An Error Occurred while running the App: ', exc_info=True)
            raise e


if __name__ == '__main__':
    
    email_otp_api = EmailOTPAPI()
    email_otp_api.run()