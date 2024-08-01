import os
import logging
import pymysql
from dotenv import load_dotenv
from flask import Blueprint, Flask, jsonify, request
from google.cloud.sql.connector import Connector, IPTypes

logging.basicConfig(level=logging.INFO)
logging.basicConfig(level=logging.ERROR)
logging.basicConfig(level=logging.WARNING)

load_dotenv(dotenv_path='.env')

class Login:
    def __init__(self):
        self.USER = os.getenv("USER")
        self.PASSWORD = os.getenv("PASSWORD")
        self.HOST = os.getenv("HOST")
        self.PORT = int(os.getenv("PORT"))
        self.DATABASE = os.getenv("DATABASE")
    
    def UserTable(self, Email, Password):
        connection = False
        try:
            connector = Connector(IPTypes.PUBLIC)

            def getconn() -> pymysql.connections.Connection:
                conn: pymysql.connections.Connection = connector.connect(
                    self.HOST,
                    "pymysql",
                    user=self.USER,
                    password=self.PASSWORD,
                    db=self.DATABASE,
                )
                return conn
            connection = getconn()
            
            cursor = connection.cursor()
            validate_query = "SELECT COUNT(*) FROM UsersData WHERE Email = %s AND Password = %s"
                             
            cursor.execute(validate_query, (Email, Password))                 
            number_of_people = cursor.fetchone()
            
            if number_of_people[0] == 1:
                return True, "Login Success!"
            else:
                return False, "Invalid Credentials"
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        finally:
           if connection:
               cursor.close()
               connection.close()
               
class Login_API:
    
    def __init__(self):
        self.app = Flask(__name__)
        self.Login_blueprint = Blueprint('Login', __name__)
        self.Login_blueprint.add_url_rule(rule='/Login', endpoint='Login', view_func=self.LoginData, methods=['POST'])
        self.Login_ = Login()
        
    def LoginData(self):
        try:
            req = request.get_json()
            if req["user"] == os.getenv("AUTH_NAME") and req["password"] == os.getenv("AUTH_PASSWORD") and req["token"] == os.getenv("AUTH_TOKEN_LOGIN"):
                resp, message = self.Login_.UserTable(req["email"],  req["userpassword"])
            
                response = {
                    "success": resp,
                    "message": message
                }
                
                return jsonify(response), 200
            else:
                response = {
                    "success": False,
                    "message": "Request Authentication Error"
                }
                
                return jsonify(response), 200
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            response = {
                "success": False,
                "message": str(e)    
            }
            return jsonify(response), 400
        
    def run(self):
        try:
            self.app.register_blueprint(self.Login_blueprint)
            self.app.run(debug=True, host='0.0.0.0')
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e


if __name__=="__main__":
    
    login = Login_API()
    login.run()