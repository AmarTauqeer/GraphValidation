import GetWikiData from "../person-helper-functions/GetWikiData";
import GetDbPediaData from "../person-helper-functions/GetDbPediaData";

const computeConfidence = (data, weightWiki, weightDbPedia) => {
  let confidence = [];
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    // wiki data
    if (element.wiki_status === "found") {
      let data = {
        givenName: element.givenName,
        dob: element.dob,
        placeOfBirth: element.placeOfBirth,
        confidence: weightWiki,
        wiki: "true",
        dbpedia: "false",
      };
      confidence.push(data);
    }
    // dbpedia data
    if (element.dbpedia_status === "found") {
      let data = {
        givenName: element.givenName,
        dob: element.dob,
        placeOfBirth: element.placeOfBirth,
        confidence: weightDbPedia,
        wiki: "false",
        dbpedia: "true",
      };
      confidence.push(data);
    }
  }
  return confidence;
};
const getData = async (graphData) => {
  let resp = graphData;
  let arr = [];
  if (resp) {
    // validation from wiki and dbpedia
    for (let i = 0; i < resp.length; i++) {
      let givenName = resp[i].givenName;
      let birthDate = resp[i].birthDate;
      let placeOfBirth = resp[i].placeOfBirth;
      // get wiki data using sparql
      const wikiData = await GetWikiData(givenName, birthDate, placeOfBirth);
      if (wikiData.length > 0) {
        arr = [
          ...arr,
          {
            givenName: wikiData[0].birthName["value"],
            dob: wikiData[0].dobLabel["value"],
            // placeOfBirth: wikiData[0].placeOfBirth["value"],
            wiki_status: "found",
            dbpedia_status: "",
          },
        ];
      }
      // get dbpedia data using sparql
      const dbpediaData = await GetDbPediaData(
        givenName,
        birthDate,
        placeOfBirth
      );
      if (dbpediaData.length > 0) {
        arr = [
          ...arr,
          {
            givenName: dbpediaData[0].name["value"],
            dob: dbpediaData[0].birthDate["value"],
            // placeOfBirth: dbpediaData[0].birthPlace["value"],
            wiki_status: "",
            dbpedia_status: "found",
          },
        ];
      }
    }
  }
  return arr;
};

export { computeConfidence, getData };
