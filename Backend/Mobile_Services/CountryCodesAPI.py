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

class CountryCodes:
    def __init__(self):
        self.USER = os.getenv("USER")
        self.PASSWORD = os.getenv("PASSWORD")
        self.HOST = os.getenv("HOST")
        self.PORT = int(os.getenv("PORT"))
        self.DATABASE = os.getenv("DATABASE")
    
    def CountryCodeDataTable(self):
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
            query = "SELECT CountryName, CountryCode FROM CountryCodes"
            
            cursor.execute(query); result = cursor.fetchall()
            countries = [{"CountryName": row[0], "CountryCode": row[1]} for row in result]
            
            return countries
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        finally:
           if connection:
               cursor.close()
               connection.close()
               
class CountryCodes_API:
    
    def __init__(self):
        self.app = Flask(__name__)
        self.CountryCodes_blueprint = Blueprint('CountryCodes', __name__)
        self.CountryCodes_blueprint.add_url_rule(rule='/CountryCodes', endpoint='CountryCodes', view_func=self.CountryCodesData, methods=['POST'])
        self.CountryCodes_ = CountryCodes()
        
    def CountryCodesData(self):
        try:
            req = request.get_json()
            if req["user"] == "Admin" and req["password"] == "GenAI@7070" and req["token"] == "GenAI-CountryCodes":
                data = self.CountryCodes_.CountryCodeDataTable()
            
                response = {
                    "success": True,
                    "data": data,
                    "message": "Country Codes Successfully fetched."
                }
                
                return jsonify(response), 200
            else:
                response = {
                    "success": False,
                    "data": {},
                    "message": "unknown Request"
                }
                
                return jsonify(response), 200
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            response = {
                "success": False,
                "data": {},
                "message": str(e)    
            }
            return jsonify(response), 400
        
    def run(self):
        try:
            self.app.register_blueprint(self.CountryCodes_blueprint)
            self.app.run(debug=True, host='0.0.0.0')
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e


if __name__=="__main__":
    
    countrycodes = CountryCodes_API()
    countrycodes.run()