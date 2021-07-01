import GetDataFromDbPedia from "../customFunctions/GetDataFromDbPedia";
const GetDbPediaData = async (givenName, birthDate, placeOfBirth) => {
  // get data from dbpedia using sparql
  var Data = [];
  var endpointUrl = "https://dbpedia.org/sparql/";
  var sparqlQuery = `PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbpedia: <http://dbpedia.org/resource/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT  ?name ?birthDate ?birthPlace WHERE { 
    ?person a dbo:Person .
    ?person rdfs:label ?name .
    ?person dbo:birthDate ?birthDate.
    ?person dbo:birthPlace ?pob.
    ?pob rdfs:label ?birthPlace .
    FILTER(regex(?name,'${givenName}'))
    FILTER (langMatches( lang(?name), "en" ))
    FILTER (langMatches( lang(?birthPlace), "en" ))
    FILTER regex(?birthDate,"${birthDate}")
  }
  `;
  const queryDispatcherWiki = new GetDataFromDbPedia(endpointUrl);
  await queryDispatcherWiki.query(sparqlQuery).then((res) => {
    if (res) {
      Data = res.results.bindings;
    }
  });
  if (Data) {
    return Data;
  } else {
    return null;
  }
};

export default GetDbPediaData;
