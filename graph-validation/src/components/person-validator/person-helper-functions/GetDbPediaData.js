import GetDataFromDbPedia from "../customFunctions/GetDataFromDbPedia";
const GetDbPediaData = async (givenName, birthDate, placeOfBirth) => {
  // get data from dbpedia using sparql
  var Data = [];
  var endpointUrl = "https://dbpedia.org/sparql/";
  var sparqlQuery = `PREFIX dbpedia: <http://dbpedia.org/resource/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT ?person  ?name (year(?birthDate) as ?birthDate)  WHERE { 
    ?person a dbo:Person .
    ?person rdfs:label ?name .
    ?person dbo:birthDate ?birthDate.
    FILTER(regex(?name,"${givenName}", "i" ))
    FILTER (langMatches( lang(?name), "en" ))
    FILTER (year(?birthDate)=${birthDate})
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
