import React from "react";
class GetDataFromWikidata extends React.Component {
  constructor(endpoint) {
    super(endpoint);
    this.endpoint = endpoint;
  }
  async query(sparqlQueryWiki) {
    const fullUrl =
      (await this.endpoint) + "?query=" + encodeURIComponent(sparqlQueryWiki);
    const headers = { Accept: "application/sparql-results+json" };

    return await fetch(fullUrl, { headers }).then((body) => body.json());
  }
}

export default GetDataFromWikidata;
