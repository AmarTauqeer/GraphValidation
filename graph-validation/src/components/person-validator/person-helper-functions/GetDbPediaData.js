import GetDataFromDbPedia from "../customFunctions/GetDataFromDbPedia";
const GetDbPediaData = async (givenName, birthDate, placeOfBirth) => {
  // get data from dbpedia using sparql
  var Data = [];
  var endpointUrl = "https://dbpedia.org/sparql/";
  // var sparqlQuery = `PREFIX so: <http://schema.org/>
  // select ?person ?personName (substr(?birthDate,1,4) as ?year)
  // from named <http://dbpedia.org/>
  // where { 
  //     GRAPH ?g {
  //     ?person a so:Person;
  //          so:name ?personName;
  //         so:birthDate ?birthDate .
  //         filter(regex(?personName,"${givenName}"))
  //       filter(substr(?birthDate,1,4)="${birthDate}")
  //   }
  //   }
  // `;
  var sparqlQuery = `PREFIX dbpedia: <http://dbpedia.org/resource/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT ?person ?personName (year(?birthDate) as ?year)  WHERE { 
    ?person a dbo:Politician .
    ?person foaf:name ?personName .
    ?person dbo:birthDate ?birthDate.
    FILTER(regex(?personName,"${givenName}", "i" ))
    FILTER (year(?birthDate)=${birthDate})
  }
  `;
  const queryDispatcherWiki = new GetDataFromDbPedia(endpointUrl);
  await queryDispatcherWiki.query(sparqlQuery).then((res) => {
    if (res) {
      //console.log(res)
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
