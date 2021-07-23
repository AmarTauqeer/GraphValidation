import React, { useState } from "react";
import { computeConfidence, getConfidenceTotals, getData } from "./person-helper-functions/index";

import axios from "axios";

function PersonForm() {
  const [graphData, setGraphData] = useState([]);
  const [weightWiki, setWeightWiki] = useState(0.3);
  const [weightDbPedia, setweightDbPedia] = useState(0.7);
  const [confidence, setConfidence] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState(false);
  const [predicate, setPredicate] = useState("all");

  const [confidenceTotal, setConfidenceTotal] = useState([]);

  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();

    // check for required fields
    if (!selectedFile || !weightWiki || !weightDbPedia) {
      alert("Please look required fields.");
      return false;
    }
    // check for weights total
    let totalWeight = parseFloat(weightWiki) + parseFloat(weightDbPedia);
    if (totalWeight !== 1.0) {
      alert("Sum of weights should be 1");
      return false;
    }
    // prepare file data
    let file = selectedFile;
    const formData = new FormData();
    formData.append("file", file);

    // get data from graph
    const resp = getGraphData(formData);
    setLoading(true);
    resp.then((res) => {
      const result = getResult(res);
      result.then((response) => {
        const confidence = computeConfidence(
          response,
          weightWiki,
          weightDbPedia
        );
        // create txt file with result
        const textFile = (result) => {
          //console.log(result)
          const element = document.createElement("a");
          function textToSave() {
            let results =
              "@prefix so:  <http://schema.org/> .\n" +
              "@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n" +
              "@prefix dbpedia: <http://dbpedia.org/resource/> .\n\n";

            for (let i = 0; i < result.length; i++) {
              const element = result[i];
              //console.log(element);

              let data =
                element["person"].concat(
                  "    " + "so:name" + "  " + `"${element["givenName"]}"\n`
                ) +
                element["person"].concat(
                  "    " + "so:birthDate" + "  " + `"${element["dob"]}"\n`
                ) +
                element["person"].concat(
                  "    " + "confidence" + "  " + element["confidence"] + "\n\n"
                );
              //console.log(data);

              results += data;
            }
            return results;
          }

          file = new Blob([textToSave()], { type: "text/plain" });

          element.href = URL.createObjectURL(file);

          element.download = "dataset-results.ttl";
          document.body.appendChild(element); // Required for this to work in FireFox
          element.click();
        };

        if (confidence) {
          // create text file
          //textFile(confidence);
          setConfidence(confidence);
          let arr=getConfidenceTotals
          setConfidenceTotal(arr)
          setLoading(false);
        }
      });
    });
  };
  // get result from wiki and dbpedia
  const getResult = async (graphdata) => {
    const resp = await getData(graphdata);
    return resp;
  };

  //  make post request send data to local graph
  const getGraphData = async (formData) => {
    const response = await axios.post(
      "http://127.0.0.1:5000/api/post-data/",
      formData
    );
    const resp = await response.data["graph_data"];
    setGraphData(resp);
    return resp;
  };

   // get result based on predicates
  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="form-group row">
          <div
            className="col-sm-2 col-form-label col-form-label-sm"
            style={{ textAlign: "right" }}
          >
            <label>Input File *</label>
          </div>
          <div className="col-sm-10">
            <input
              type="file"
              name="file"
              onChange={(event) => setSelectedFile(event.target.files[0])}
            />
          </div>
        </div>
        <div className="form-group row">
          <div
            className="col-sm-2 col-form-label col-form-label-sm"
            style={{ textAlign: "right" }}
          >
            <label>Properties *</label>
          </div>
          <div className="col-sm-2">
            <select
              className="col-sm-10 form-control form-control-sm"
              name="predicate"
              value={predicate}
              onChange={(e) => setPredicate(e.target.value)}
            >
              <option value="all" selected>
                All
              </option>
              <option value="name">Name</option>
              <option value="dob">Date of Birth</option>
            </select>
          </div>
        </div>
        <div className="form-group row">
          <div
            className="col-sm-2 col-form-label col-form-label-sm"
            style={{ textAlign: "right" }}
          >
            <label>Wiki Weight *</label>
          </div>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control form-control-sm"
              id="weightWiki"
              value={weightWiki}
              onChange={(e) => setWeightWiki(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group row">
          <div
            className="col-sm-2 col-form-label col-form-label-sm"
            style={{ textAlign: "right" }}
          >
            <label>DbPedia Weight *</label>
          </div>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control form-control-sm"
              id="weightDbPedia"
              value={weightDbPedia}
              onChange={(e) => setweightDbPedia(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group row">
          <div
            className="col-sm-2 col-form-label col-form-label-sm"
            style={{ textAlign: "right" }}
          >
            <label></label>
          </div>
          <div className="col-sm-2">
            <button
              type="submit"
              className="btn btn-success btn-sm form-control-sm"
            >
              Validate & download
            </button>
          </div>
        </div>
      </form>
      <div
        className="row h-100"
        style={{
          backgroundColor: "#ff8000",
          height: "50px",
          fontSize: "16px",
        }}
      >
        <div className="col-sm-2 col-form-label col-form-label-sm my-auto">
          <b>KG</b>
        </div>
        <div className="col-sm-4 col-form-label col-form-label-sm my-auto">
          <b>Wiki</b>
        </div>
        <div className="col-sm-4 col-form-label col-form-label-sm my-auto">
          <b>DbPedia</b>
        </div>
        <div className="col-sm-1 col-form-label col-form-label-sm my-auto">
          <b>Confidence</b>
        </div>
        <div className="col-sm-1 col-form-label col-form-label-sm my-auto">
          <b>Instance Confidence</b>
        </div>
      </div>

      {loading ? (
        <div>loading...</div>
      ) : (
        graphData.map((item, index) => {
          let nameConfidencePerRow = 0.0;
          let dobConfidencePerRow = 0.0;

          return (
            <div className="row" key={index}>
              <div className="col-sm-2 col-form-label col-form-label-sm">
                {item.givenName}
              </div>
              <div className="col-sm-4 col-form-label col-form-label-sm">
                {predicate === "all" ? (
                  <div>
                    <div className="row">
                      {confidence
                        .filter(
                          (c) =>
                            c.givenName === item.givenName &&
                            c.wiki === "true" &&
                            c.uriId === item.uriId
                        )
                        .map((result) => {
                          if (result.confidence > 0) {
                            nameConfidencePerRow += parseFloat(
                              result.confidence
                            );
                          }
                          return result.person;
                        })}
                    </div>
                    <div className="row">
                      {confidence
                        .filter(
                          (c) =>
                            c.dob === item.birthDate &&
                            c.wiki === "true" &&
                            c.uriId === item.uriId
                        )
                        .map((result) => {
                          if (result.confidence > 0) {
                            dobConfidencePerRow += parseFloat(
                              result.confidence
                            );
                          }
                          return result.dob;
                        })}
                    </div>
                  </div>
                ) : predicate === "name" ? (
                  <div className="row">
                    {confidence
                      .filter(
                        (c) =>
                          c.givenName === item.givenName &&
                          c.wiki === "true" &&
                          c.uriId === item.uriId
                      )
                      .map((result) => {
                        if (result.confidence > 0) {
                          nameConfidencePerRow += parseFloat(result.confidence);
                        }
                        return result.person;
                      })}
                  </div>
                ) : (
                  <div className="row">
                    {confidence
                      .filter(
                        (c) =>
                          c.dob === item.birthDate &&
                          c.wiki === "true" &&
                          c.uriId === item.uriId
                      )
                      .map((result) => {
                        if (result.confidence > 0) {
                          dobConfidencePerRow += parseFloat(result.confidence);
                        }
                        return result.dob;
                      })}
                  </div>
                )}
              </div>
              <div className="col-sm-4 col-form-label col-form-label-sm">
                {predicate === "all" ? (
                  <div>
                    <div className="row">
                      {confidence
                        .filter(
                          (c) =>
                            c.givenName === item.givenName &&
                            c.dbpedia === "true" &&
                            c.uriId === item.uriId
                        )
                        .map((result) => {
                          if (result.confidence > 0) {
                            nameConfidencePerRow += parseFloat(
                              result.confidence
                            );
                          }
                          return result.person;
                        })}
                    </div>

                    <div className="row">
                      {confidence
                        .filter(
                          (c) =>
                            c.dob === item.birthDate &&
                            c.dbpedia === "true" &&
                            c.uriId === item.uriId
                        )
                        .map((result) => {
                          if (result.confidence > 0) {
                            dobConfidencePerRow += parseFloat(
                              result.confidence
                            );
                          }
                          return result.dob;
                        })}
                    </div>
                  </div>
                ) : predicate === "name" ? (
                  <div className="row">
                    {confidence
                      .filter(
                        (c) =>
                          c.givenName === item.givenName &&
                          c.dbpedia === "true" &&
                          c.uriId === item.uriId
                      )
                      .map((result) => {
                        if (result.confidence > 0) {
                          nameConfidencePerRow += parseFloat(result.confidence);
                        }
                        return result.person;
                      })}
                  </div>
                ) : (
                  <div className="row">
                    {confidence
                      .filter(
                        (c) =>
                          c.dob === item.birthDate &&
                          c.dbpedia === "true" &&
                          c.uriId === item.uriId
                      )
                      .map((result) => {
                        if (result.confidence > 0) {
                          dobConfidencePerRow += parseFloat(result.confidence);
                        }
                        return result.dob;
                      })}
                  </div>
                )}
              </div>
              <div className="col-sm-1 col-form-label col-form-label-sm">
                <div className="row">
                  <div
                    className="col-sm-10"
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "blue",
                    }}
                  >
                    {predicate === "all" || predicate === "name"
                      ? nameConfidencePerRow
                      : ""}
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-sm-10"
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {predicate === "all" || predicate === "dob"
                      ? dobConfidencePerRow
                      : ""}
                  </div>
                </div>
              </div>
              <div
                className="col-sm-1 col-form-label col-form-label-sm"
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "green",
                }}
              >
                {predicate === "all"
                  ? (parseFloat(nameConfidencePerRow) +
                      parseFloat(dobConfidencePerRow)) /
                    2
                  : predicate === "name"
                  ? parseFloat(nameConfidencePerRow)
                  : parseFloat(dobConfidencePerRow)}
              </div>
            </div>
          );
        })
      )}
      <div>
        <hr />
        <div className="row">
        <div className="col-md-3"><b>Wiki Name Confidence Total</b></div>
        <div className="col-md-3"><b>Wiki Dob Confidence Total</b></div>
        <div className="col-md-3"><b>Dbpedia Name Confidence Total</b></div>
        <div className="col-md-3"><b>Dbpedia Dob Confidence Total</b></div>
        </div>
        {confidenceTotal.map((item,index)=>{
          return(
            <div className="row" key={index}>
              <div className="col-md-3" style={{textAlign:'center'}}><b>{item.wikiName}</b></div>
              <div className="col-md-3" style={{textAlign:'center'}}><b>{item.wikiDob}</b></div>
              <div className="col-md-3" style={{textAlign:'center'}}><b>{item.dbpediaName}</b></div>
              <div className="col-md-3" style={{textAlign:'center'}}><b>{item.dbpediaDob}</b></div>
            </div>
          )
        })}
        <hr />
      </div>
    </div>
  );
}
export default PersonForm;
