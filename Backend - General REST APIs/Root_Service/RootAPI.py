import os
import logging
from flask import Blueprint, Flask, Response

# Set Up Logging
logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO,
    handlers=[logging.StreamHandler()]
)

# Initialize SERVER PORT
port = int(os.getenv('PORT', 5000))

class Root:
    def __init__(self) -> None:
        pass
    
    def root_template(self) -> str:
        """Generate the HTML content for the Root Page."""
        try:
            html_content = f"""
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
                        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                    <style>
                        @import url("https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Poetsen+One&display=swap");
                        
                        body {{
                            background-color: #212529;
                            margin: 0;
                            height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }}
                        
                        .root-container {{
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                        }}
                        
                        .root-container h1 {{
                            display: block;
                            font-family: "Cinzel Decorative", serif;
                            font-size: 40px;
                            font-weight: 900;
                            color: white;
                            margin-bottom: 4%;
                        }}
                        
                        .logo-container {{
                            margin-bottom: 2%;
                        }}
                    </style>
                    <title>Alive AI - Root API</title>
                </head>
                <body>
                    <div class="root-container">
                        <div class="logo-container">
                            <img src="static/AliveAI Logo.png" alt="Logo" width="200px" />
                        </div>
                        <h1>Welcome to Alive AI Backend</h1>
                        <button onclick="window.location.href='#'" type="button" class="btn btn-outline-info btn-lg">Getting Started</button>
                    </div>
                    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
                        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
                        crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
                        integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
                        crossorigin="anonymous"></script>
                </body>
            </html>
            """
            return html_content
        except Exception as e:
            logging.error("An Error Occurred while Generating the Root Template", exc_info=e)
            raise

class RootAPI:    
    def __init__(self) -> None:
        self.app = Flask(__name__)
        self.root = Root()
        self.blueprint = Blueprint('Root', __name__)
        self.blueprint.add_url_rule(
            rule='/',
            endpoint='Root',
            view_func=self.root_temp,
            methods=['GET']
        )
        self.app.register_blueprint(self.blueprint)

    def root_temp(self) -> Response:
        """Handle the Root request and return the HTML Response."""
        try:
            html_content = self.root.root_template()
            return Response(html_content, mimetype='text/html')
        except Exception as e:
            logging.error("An Error Occurred in root_temp", exc_info=e)
            return Response("An Error Occurred while processing your request.", status=500)

    def run(self) -> None:
        """Run the Flask application."""
        try:
            self.app.run(debug=True, host='0.0.0.0', port=port)
        except Exception as e:
            logging.error("An Error Occurred while running the App", exc_info=e)

if __name__ == "__main__":
    
    root_api = RootAPI()
    root_api.run()
