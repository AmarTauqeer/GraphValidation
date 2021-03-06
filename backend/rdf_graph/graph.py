import os
import requests
from rdflib import URIRef, BNode, Literal, Namespace, Graph
# from rdflib.namespace import FOAF, DCTERMS, XSD, RDF, RDFS, SDO
from flask_restful import Resource
from flask_apispec.views import MethodResource
from flask import jsonify


class RdfGraph(MethodResource, Resource):
    def get_data(self, f):
        inputFile = f
        param_array = []
        # my_data = "{}".format(data)
        g = Graph()
        ex = Namespace("http://example.org/ns#")
        g.bind("ex", ex)
        # g.parse(data=my_data, format="n3")
        g.parse(file=inputFile, format="ttl")
        # print(g.serialize(format="turtle").decode("utf-8"))
        qres = g.query(
            """
            prefix ex: <http://example.org/ns#>
            prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            prefix schema: <http://schema.org/>
            prefix xsd: <http://www.w3.org/2001/XMLSchema#>
            SELECT ?person ?givenName ?birthDate ?placeOfBirth
                        WHERE {
                        ?person a schema:Person;
                            schema:name ?givenName;
                            schema:birthDate ?birthDate .
                            
        }""")
        # schema:birthPlace ?pob.
        #                     ?pob rdf:type schema:Place;
        #                             schema:name ?placeOfBirth .
        for row in qres:
            #print("{}{}{}".format(row.givenName, row.birthDate, row.person))
            gname = "{}".format(row.givenName)
            bdate = "{}".format(row.birthDate)
            uriId = "{}".format(row.person)
            #obirth = "{}".format(row.placeOfBirth)
            data = {
                'givenName': gname, 'birthDate': bdate, 'uriId':uriId
            }
            # print(data)
            param_array.append(data)
        # print(param_array)
        return jsonify({'graph_data': param_array})
