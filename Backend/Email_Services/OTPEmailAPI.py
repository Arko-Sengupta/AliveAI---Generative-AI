import os
import random
import smtplib
import logging
from dotenv import load_dotenv
from email.message import EmailMessage
from flask import Blueprint, Flask, jsonify, request

logging.basicConfig(level=logging.INFO)
logging.basicConfig(level=logging.ERROR)
logging.basicConfig(level=logging.WARNING)

load_dotenv(dotenv_path='.env')

class EmailOTP:
    
    def __init__(self):
        self.email = os.getenv("SERVER_EMAIL")
        self.password = os.getenv("SERVER_PASSWORD")
    
    def GenerateOTP(self):
        try:
            return ''.join([str(random.randint(0, 9)) for i in range(6)])
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e
        
class EmailOTP_API:
    
    def __init__(self):
        self.app = Flask(__name__)
        self.GenerateOTP_blueprint = Blueprint('generateOTP', __name__)
        self.GenerateOTP_blueprint.add_url_rule('/GenerateOTP', 'GenerateOTP', self.GenerateOTP, methods=['POST'])
        self.GenerateOTP_ = EmailOTP()
        
    def GenerateMessage(self):
        try:
            self.msg = EmailMessage()
            self.msg['Subject'] = 'AliveAI Email Authentication'
            self.msg['From'] = f'Deepqe <{self.GenerateOTP_.email}>'
            
            self.msg.set_content("Your OTP is: " + self.OTP + ". Your OTP will expire within 300 seconds.")
            return self.msg
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e
        
    def EmailServerLogin(self):
        try:
            self.server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            self.server.login(self.GenerateOTP_.email, self.GenerateOTP_.password)
            return self.server
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e
        
    def GenerateOTP(self):
        try:
            to_mail = request.get_json()
            
            if to_mail["user"] == os.getenv("AUTH_NAME") and to_mail["password"] == os.getenv("AUTH_PASSWORD") and to_mail["token"] == os.getenv("AUTH_TOKEN"):
                self.OTP = self.GenerateOTP_.GenerateOTP()
                self.server = self.EmailServerLogin()
                self.msg = self.GenerateMessage()
                self.msg['To'] = to_mail['to_mail']
                
                self.server.send_message(self.msg)
                
                response = {
                        "success": True,
                        "data": {
                            "email": to_mail['to_mail'],
                            "otp": self.OTP
                        },
                        "message": f"{self.OTP} sent to mail: {to_mail['to_mail']}"
                    }
                return jsonify({'response': response}), 200
            else:
                response = {
                        "success": False,
                        "data": {
                            "email": to_mail['to_mail'],
                            "otp": None
                        },
                        "message": f"Request Authentication Error"
                    }
                return jsonify({'response': response}), 200
        except Exception as e:
            logging.error('An Error OCcured: ', exc_info=e)
            response = {
                    "success": False,
                    "data": {
                        "email": to_mail['to_mail'],
                        "otp": None
                    },
                    "message": str(e)
                }
            return jsonify({"response": response}), 400
        
    def run(self):
        try:
            
            self.app.register_blueprint(self.GenerateOTP_blueprint)
            self.app.run(debug=True)
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e
        
if __name__=='__main__':
    
    EmailValAPI = EmailOTP_API()
    EmailValAPI.run()