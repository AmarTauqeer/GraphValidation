import GetWikiData from "../person-helper-functions/GetWikiData";
import GetDbPediaData from "../person-helper-functions/GetDbPediaData";

const computeConfidence = (data, weightWiki, weightDbPedia) => {
  let confidence = [];
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    // // wiki data
    if (element.wiki_status === "found") {
      let data = {
        givenName: element.givenName,
        dob: element.dob,
        uriId:element.uriId,
        //placeOfBirth: element.placeOfBirth,
        confidence: weightWiki,
        wiki: "true",
        dbpedia: "false",
        person: element.person,
      };
      confidence.push(data);
    }
    // dbpedia data
    if (element.dbpedia_status === "found") {
      let data = {
        givenName: element.givenName,
        dob: element.dob,
        uriId:element.uriId,
        //placeOfBirth: element.placeOfBirth,
        confidence: weightDbPedia,
        wiki: "false",
        dbpedia: "true",
        person: element.person,
      };
      confidence.push(data);
    }
  }
  //console.log(confidence);
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
      let uriId=resp[i].uriId;

      // get wiki data using sparql
      const wikiData = await GetWikiData(givenName, birthDate, placeOfBirth,uriId);
      if (wikiData.length > 0) {
        let dateOfbirth = wikiData[0].year["value"];
        arr = [
          ...arr,
          {
            
            givenName: wikiData[0].personName["value"],
            dob: dateOfbirth,
            uriId,
            //dob: dateOfbirth.substring(0, 10),
            //placeOfBirth: wikiData[0].placeOfBirth["value"],
            wiki_status: "found",
            dbpedia_status: "",
            person: wikiData[0].person["value"],
          },
        ];
      }
      // get dbpedia data using sparql
      const dbpediaData = await GetDbPediaData(
        givenName,
        birthDate,
        placeOfBirth,
        uriId
      );
      if (dbpediaData.length > 0) {
        //console.log(dbpediaData)
        arr = [
          ...arr,
          {
            givenName: dbpediaData[0].personName["value"],
            dob: dbpediaData[0].year["value"],
            uriId,
            //placeOfBirth: dbpediaData[0].birthPlace["value"],
            wiki_status: "",
            dbpedia_status: "found",
            person: dbpediaData[0].person["value"],
          },
        ];
      }
    }
  }
  return arr;
};

export { computeConfidence, getData };
