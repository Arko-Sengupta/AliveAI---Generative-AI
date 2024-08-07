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

class UserQuery:
    def __init__(self):
        self.USER = os.getenv("USER")
        self.PASSWORD = os.getenv("PASSWORD")
        self.HOST = os.getenv("HOST")
        self.PORT = int(os.getenv("PORT"))
        self.DATABASE = os.getenv("DATABASE")
    
    def QueryTable(self, Name, Email, Query):
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
            insert_query = """ INSERT INTO UsersQueries (Name, Email, Query) VALUES (%s, %s, %s)"""
                             
            cursor.execute(insert_query, (Name, Email, Query))                 
            connection.commit()
            
            return True, "Query Saved Successfully"
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        finally:
           if connection:
               cursor.close()
               connection.close()
               
class UserQuery_API:
    
    def __init__(self):
        self.app = Flask(__name__)
        self.UserQuery_blueprint = Blueprint('UserQuery', __name__)
        self.UserQuery_blueprint.add_url_rule(rule='/UserQuery', endpoint='UserQuery', view_func=self.User_Query, methods=['POST'])
        self.UserQuery_ = UserQuery()
        
    def User_Query(self):
        try:
            req = request.get_json()
            if req["user"] == os.getenv("AUTH_NAME") and req["password"] == os.getenv("AUTH_PASSWORD") and req["token"] == os.getenv("AUTH_TOKEN"):
                resp, message = self.UserQuery_.QueryTable(req["name"], req["email"], req["query"])
            
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
            self.app.register_blueprint(self.UserQuery_blueprint)
            self.app.run(debug=True, host='0.0.0.0')
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e


if __name__=="__main__":
    
    userquery = UserQuery_API()
    userquery.run()