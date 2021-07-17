from flask import Flask
from flask_restful import Api
from apispec import APISpec
from flask_apispec.extension import FlaskApiSpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask_cors import CORS
from dotenv import load_dotenv
# contract resources
from resources.post_data import PostData

# flask app
app = Flask(__name__)
load_dotenv()
# cors enable for swagger-editor
CORS(app)
cors = CORS(app, resources={
    r"/api/*": {
        "origins": "*"
    }
})
api = Api(app)
# swagger configuration
app.config.update({
    'APISPEC_SPEC': APISpec(
        title='Graph validation API Specification',
        version='v01',
        plugins=[MarshmallowPlugin()],
        openapi_version='2.0.0'
    ),
    'APISPEC_SWAGGER_UI_URL': '/swagger',
})

# contract api end points with swagger documentation
docs = FlaskApiSpec(app)
api.add_resource(PostData, '/api/post-data/')
docs.register(PostData)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
