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
        uriId: element.uriId,
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
        uriId: element.uriId,
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
// get confidence wiki name,dob plus dbpedia name,dob
let wikiNameConfidenceTotal = 0;
let wikiDobConfidenceTotal = 0;
let dbPediaNameConfidenceTotal = 0;
let dbPediaDobConfidenceTotal = 0;
const getConfidenceTotals = () => {
  let arr = [];
  let data = {
    wikiName: wikiNameConfidenceTotal,
    wikiDob: wikiDobConfidenceTotal,
    dbpediaName: dbPediaNameConfidenceTotal,
    dbpediaDob: dbPediaDobConfidenceTotal,
  };
  arr.push(data);
//  console.log(arr);
  return arr;
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
      let uriId = resp[i].uriId;

      // get wiki data using sparql
      const wikiData = await GetWikiData(
        givenName,
        birthDate,
        placeOfBirth,
        uriId
      );
      if (wikiData.length > 0) {
        // count name and birth date confidence
        let wikiName = wikiData[0].personName["value"];
        let wikiDob = wikiData[0].year["value"];

        if (wikiName === givenName) {
          wikiNameConfidenceTotal += 1;
        }
        if (wikiDob === birthDate) {
          wikiDobConfidenceTotal += 1;
        }
        arr = [
          ...arr,
          {
            givenName: wikiName,
            dob: wikiDob,
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
        // count name and birth date confidence
        let dbpediaName = dbpediaData[0].personName["value"];
        let dbpediaDob = dbpediaData[0].year["value"];
        let dbpediaPerson = dbpediaData[0].person["value"];
        if (dbpediaName === givenName) {
          dbPediaNameConfidenceTotal += 1;
        }
        if (dbpediaDob === birthDate) {
          dbPediaDobConfidenceTotal += 1;
        }
        //console.log(dbpediaData)
        arr = [
          ...arr,
          {
            givenName: dbpediaName,
            dob: dbpediaDob,
            uriId,
            //placeOfBirth: dbpediaData[0].birthPlace["value"],
            wiki_status: "",
            dbpedia_status: "found",
            person: dbpediaPerson,
          },
        ];
      }
    }
  }
  getConfidenceTotals();
  // console.log(dbPediaNameConfidenceTotal)
  // console.log(dbPediaDobConfidenceTotal)
  return arr;
};

export { computeConfidence, getData, getConfidenceTotals };
