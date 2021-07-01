import React from "react";
class GetDataFromDbPedia extends React.Component {
  constructor(endpoint) {
    super(endpoint);
    this.endpoint = endpoint;
  }
  async query(sparqlQueryDbpedia) {
    const fullUrl =
      (await this.endpoint) +
      "?query=" +
      encodeURIComponent(sparqlQueryDbpedia);
    const headers = { Accept: "application/sparql-results+json" };

    return await fetch(fullUrl, { headers }).then((body) => body.json());
  }
}

export default GetDataFromDbPedia;
