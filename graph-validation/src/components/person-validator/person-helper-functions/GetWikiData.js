import GetDataFromWikidata from "../customFunctions/GetDataFromWikidata";
const GetWikiData = async (givenName, birthDate, placeOfBirth) => {
  // get data from wiki using sparql
  var wikiData = [];
  var endpointUrl = "https://query.wikidata.org/sparql";
  var sparqlQuery = `SELECT ?birthName ?dobLabel  WHERE {
    ?person wdt:P31 wd:Q5;
      rdfs:label ?birthName;
      wdt:P569 ?dob .
    FILTER(REGEX(?birthName, "${givenName}"))
    FILTER((LANG(?birthName)) = "en")
    FILTER(?dob = "${birthDate}"^^xsd:dateTime)
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }`;

  const queryDispatcherWiki = new GetDataFromWikidata(endpointUrl);

  await queryDispatcherWiki.query(sparqlQuery).then((res) => {
    if (res) {
      wikiData = res.results.bindings;
    }
  });

  if (wikiData) {
    return wikiData;
  } else {
    return null;
  }
};

export default GetWikiData;
