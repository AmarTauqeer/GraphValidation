import GetDataFromWikidata from "../customFunctions/GetDataFromWikidata";
const GetWikiData = async (givenName, birthDate, placeOfBirth) => {
  // get data from wiki using sparql
  var wikiData = [];
  var endpointUrl = "https://query.wikidata.org/sparql";
  var sparqlQuery = `SELECT ?birthName (YEAR(?dob) AS ?year) WHERE {
    ?person wdt:P31 wd:Q5;
      rdfs:label ?birthName;

      wdt:P569 ?dob;
      wdt:P19 ?pob.
    ?pob rdfs:label ?placeOfBirth.
    FILTER(REGEX(?birthName, "${givenName}"))
    FILTER(REGEX(?placeOfBirth, "${placeOfBirth}"))
    FILTER((LANG(?birthName)) = "en")
    FILTER((LANG(?placeOfBirth)) = "en")
    FILTER((YEAR(?dob)) = ${birthDate} )
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
