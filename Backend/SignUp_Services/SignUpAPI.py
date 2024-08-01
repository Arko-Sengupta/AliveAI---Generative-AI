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

class SignUp:
    def __init__(self):
        self.USER = os.getenv("USER")
        self.PASSWORD = os.getenv("PASSWORD")
        self.HOST = os.getenv("HOST")
        self.PORT = int(os.getenv("PORT"))
        self.DATABASE = os.getenv("DATABASE")
    
    def UserTable(self, FullName, UserName, Email, Password, Country, CountryCode, PhoneNumber, Address):
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
            validate_query = """
                             SELECT * FROM UsersData
                             WHERE Email = %s OR Username = %s OR MobileNumber = %s;
                             """
                             
            cursor.execute(validate_query, (Email, UserName, PhoneNumber))                 
            number_of_people = cursor.fetchone()
            
            if number_of_people:
                return False, "Email, Username or Mobile Number Already Registered."
            else:
                insert_query = """INSERT INTO UsersData (
                        FullName,
                        Username,
                        Email,
                        `Password`,
                        Country,
                        CountryCode,
                        MobileNumber,
                        Address
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"""
            
                cursor.execute(insert_query, (FullName, UserName, Email, Password, Country, CountryCode, PhoneNumber, Address)); connection.commit()
                return True, "User Registered Successfully"
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        finally:
           if connection:
               cursor.close()
               connection.close()
               
class SignUp_API:
    
    def __init__(self):
        self.app = Flask(__name__)
        self.SignUp_blueprint = Blueprint('SignUp', __name__)
        self.SignUp_blueprint.add_url_rule(rule='/SignUp', endpoint='SignUp', view_func=self.SignUpData, methods=['POST'])
        self.SignUp_ = SignUp()
        
    def SignUpData(self):
        try:
            req = request.get_json()
            if req["user"] == os.getenv("AUTH_NAME") and req["password"] == os.getenv("AUTH_PASSWORD") and req["token"] == os.getenv("AUTH_TOKEN_SIGNUP"):
                resp, message = self.SignUp_.UserTable(req["fullname"], req["username"], 
                                              req["email"],  req["userpassword"], 
                                              req["country"], req["countrycode"], 
                                              req["phone"], req["address"])
            
                response = {
                    "success": resp,
                    "message": message
                }
                
                return jsonify(response), 200
            else:
                response = {
                    "message": "Request Authentication Error",
                    "success": False
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
            self.app.register_blueprint(self.SignUp_blueprint)
            self.app.run(debug=True, host='0.0.0.0')
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e


if __name__=="__main__":
    
    signup = SignUp_API()
    signup.run()