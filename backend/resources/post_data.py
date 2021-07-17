from flask import json, jsonify, request
from flask.wrappers import Request
from flask_restful import Resource
from flask_apispec.views import MethodResource
from flask_apispec import doc
from rdf_graph.graph import RdfGraph
from rdf_graph.converter import Converter


class PostData(MethodResource, Resource):

    @doc(description='Get all contract ID.', tags=['All ContractId'])
    def post(self):
        if request.method == 'POST':
            f = request.files['file']
            # converted = Converter().csv_to_ttl()

            # request_data = request.data
            # json_data = request_data.decode('utf8').replace("'", '"')
            # data = json.loads(json_data)
            # loaded_data = data["loadig_data"]

            result = RdfGraph().get_data(f)
        return result
