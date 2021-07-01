import React, { useState } from "react";
import { computeConfidence, getData } from "./person-helper-functions/index";

import axios from "axios";

function PersonForm() {
  const [graphData, setGraphData] = useState([]);
  const [weightWiki, setWeightWiki] = useState(0);
  const [weightDbPedia, setweightDbPedia] = useState(0);
  const [confidence, setConfidence] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState(false);
  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    // check for required fields
    if (!selectedFile || !weightWiki || !weightDbPedia) {
      alert("Please look required fields.");
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

        if (confidence) {
          setConfidence(confidence);
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
          <div className="col-sm-10 form-control-sm">
            <input
              type="file"
              name="file"
              onChange={(event) => setSelectedFile(event.target.files[0])}
            />
          </div>
        </div>
        {/* <div className="form-group row">
          <label className="col-sm-2 col-form-label">Properties</label>
          <div className="col-sm-2">
            <select
              className="form-control"
              name="predicate"
              value={predicate}
              onChange={(e) => setPredicate(e.target.value)}
            > */}
        {/* {predicateList.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))} */}
        {/* <option defaultValue="name">Name</option>
              <option value="phone">Date of Birth</option>
              <option value="address">Place of Birth</option>
            </select>
          </div> */}
        <div className="form-group row">
          <div
            className="col-sm-2 col-form-label col-form-label-sm "
            style={{ textAlign: "right" }}
          >
            <label>Wiki Weight *</label>
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control form-control-sm"
              id="weightWiki"
              value={weightWiki}
              onChange={(e) => setWeightWiki(e.target.value)}
            />
          </div>
          <div
            className="col-sm-2 col-form-label col-form-label-sm"
            style={{ textAlign: "right" }}
          >
            <label>DbPedia Weight *</label>
          </div>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control form-control-sm"
              id="weightDbPedia"
              value={weightDbPedia}
              onChange={(e) => setweightDbPedia(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-success btn-sm form-control-sm"
          >
            Validate
          </button>
        </div>
      </form>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="col-md-3">
            <b>Name</b>
          </div>
          <div className="col-md-2">
            <b>DOB</b>
          </div>
          {/* <div className="col-md-3">
            <b>Place of birth</b>
          </div> */}
          <div className="col-md-1">
            <b>Wiki</b>
          </div>
          <div className="col-md-1">
            <b>DbPedia</b>
          </div>
          <div className="col-md-1">
            <b>Overall</b>
          </div>
        </nav>
        {graphData
          ? graphData.map((item, index) => {
              let overallConfidence = 0;
              return (
                <div className="row" key={index}>
                  <div
                    className="col-sm-3 col-form-label col-form-label-sm"
                    key={item.givenName}
                  >
                    {item.givenName}
                  </div>
                  <div className="col-sm-2 col-form-label col-form-label-sm">
                    {item.birthDate}
                  </div>
                  {/* <div className="col-sm-3 col-form-label col-form-label-sm">
                    {item.placeOfBirth}
                  </div> */}
                  <div
                    className="col-sm-1 col-form-label col-form-label-sm"
                    style={{ textAlign: "center" }}
                  >
                    {loading ? (
                      <div>loading...</div>
                    ) : (
                      confidence
                        .filter(
                          (c) =>
                            c.givenName === item.givenName &&
                            c.confidence !== 0 &&
                            c.wiki === "true"
                        )
                        .map((result) => {
                          if (result.confidence > 0) {
                            overallConfidence += parseInt(
                              result.confidence,
                              10
                            );
                          }

                          return parseInt(result.confidence, 10);
                        })
                    )}
                  </div>
                  <div
                    className="col-sm-1 col-form-label col-form-label-sm"
                    style={{ textAlign: "center" }}
                  >
                    {loading ? (
                      <div>loading...</div>
                    ) : (
                      confidence
                        .filter(
                          (c) =>
                            c.givenName === item.givenName &&
                            c.confidence !== 0 &&
                            c.wiki === "false"
                        )
                        .map((result) => {
                          if (result.confidence > 0) {
                            overallConfidence += parseInt(
                              result.confidence,
                              10
                            );
                          }

                          return parseInt(result.confidence, 10);
                        })
                    )}
                  </div>
                  <div
                    className="col-sm-1 col-form-label col-form-label-sm"
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {loading ? <div>loading...</div> : overallConfidence}
                  </div>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
}
export default PersonForm;
