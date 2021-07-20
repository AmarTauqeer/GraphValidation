import GetDataFromWikidata from "../customFunctions/GetDataFromWikidata";
const GetWikiData = async (givenName, birthDate, placeOfBirth) => {
  // get data from wiki using sparql
  console.log(givenName + " " + birthDate);
  var wikiData = [];
  var endpointUrl = "https://query.wikidata.org/sparql";
  var sparqlQuery = `SELECT ?itemLabel WHERE {
    ?item wdt:P31 wd:Q5;
      rdfs:label ?name;
      wdt:P569 ?dateOfBirth.
    FILTER((YEAR(?dateOfBirth)) = ${birthDate} )
    FILTER((LANG(?name)) = "[AUTO_LANGUAGE]")
    FILTER(REGEX(?name, "${givenName}"))
  }`;
  console.log(sparqlQuery);
  const queryDispatcherWiki = new GetDataFromWikidata(endpointUrl);

  await queryDispatcherWiki.query(sparqlQuery).then((res) => {
    if (res) {
      console.log(res);
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
