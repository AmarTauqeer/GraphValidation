import GetDataFromWikidata from "../customFunctions/GetDataFromWikidata";
const GetWikiData = async (givenName, birthDate, placeOfBirth) => {
  // get data from wiki using sparql
  //console.log(givenName + " " + birthDate);
  var wikiData = [];
  var endpointUrl = "http://amar-sti:7200/repositories/Wikidata";
  var sparqlQuery = `PREFIX so: <http://schema.org/>
  select ?person ?personName (substr(?birthDate,0,5) as ?year)  where { 
    ?person a so:Person;
      so:name ?personName;
      so:birthDate ?birthDate .
      filter(regex(?personName,"${givenName}"))
      filter(substr(?birthDate,0,5)="${birthDate}")
  } `;
  //console.log(sparqlQuery);
  const queryDispatcherWiki = new GetDataFromWikidata(endpointUrl);

  await queryDispatcherWiki.query(sparqlQuery).then((res) => {
    if (res) {
      //console.log(res);
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
