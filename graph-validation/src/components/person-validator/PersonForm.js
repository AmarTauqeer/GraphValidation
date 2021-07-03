import React, { useState } from "react";
import { computeConfidence, getData } from "./person-helper-functions/index";

import axios from "axios";

function PersonForm() {
  const [graphData, setGraphData] = useState([]);
  const [weightWiki, setWeightWiki] = useState(0.3);
  const [weightDbPedia, setweightDbPedia] = useState(0.7);
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
            className="col-sm-2 col-form-label col-form-label-sm"
            style={{ textAlign: "right" }}
          >
            <label>Wiki Weight *</label>
          </div>
          <div className="col-sm-3 form-control-sm">
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
          <div className="col-sm-3 form-control-sm">
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
          <div className="col-sm-2 form-control-sm">
            <button
              type="submit"
              className="btn btn-success btn-sm form-control-sm"
            >
              Validate
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
        <div className="col-sm-3 col-form-label col-form-label-sm my-auto">
          <b>KG</b>
        </div>
        <div className="col-sm-2 col-form-label col-form-label-sm my-auto">
          <b>Wiki</b>
        </div>
        <div className="col-sm-2 col-form-label col-form-label-sm my-auto">
          <b>DbPedia</b>
        </div>
        <div className="col-sm-2 col-form-label col-form-label-sm my-auto">
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
              <div className="col-sm-3 col-form-label col-form-label-sm">
                {item.givenName}
              </div>
              <div className="col-sm-2 col-form-label col-form-label-sm">
                <div className="row">
                  {loading ? (
                    <div>loading...</div>
                  ) : (
                    confidence
                      .filter(
                        (c) =>
                          c.givenName === item.givenName && c.wiki === "true"
                      )
                      .map((result) => {
                        if (result.confidence > 0) {
                          nameConfidencePerRow += parseFloat(result.confidence);
                        }
                        return result.givenName;
                      })
                  )}
                </div>

                <div className="row">
                  {loading ? (
                    <div>loading...</div>
                  ) : (
                    confidence
                      .filter(
                        (c) => c.dob === item.birthDate && c.wiki === "true"
                      )
                      .map((result) => {
                        if (result.confidence > 0) {
                          dobConfidencePerRow += parseFloat(result.confidence);
                        }
                        return result.dob;
                      })
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-form-label col-form-label-sm">
                <div className="row">
                  {loading ? (
                    <div>loading...</div>
                  ) : (
                    confidence
                      .filter(
                        (c) =>
                          c.givenName === item.givenName && c.dbpedia === "true"
                      )
                      .map((result) => {
                        if (result.confidence > 0) {
                          nameConfidencePerRow += parseFloat(result.confidence);
                        }
                        return result.givenName;
                      })
                  )}
                </div>
                <div className="row">
                  {loading ? (
                    <div>loading...</div>
                  ) : (
                    confidence
                      .filter(
                        (c) => c.dob === item.birthDate && c.dbpedia === "true"
                      )
                      .map((result) => {
                        if (result.confidence > 0) {
                          dobConfidencePerRow += parseFloat(result.confidence);
                        }
                        return result.dob;
                      })
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-form-label col-form-label-sm">
                <div className="row">
                  <div
                    className="col-sm-10"
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "blue",
                    }}
                  >
                    {loading ? <div>loading...</div> : nameConfidencePerRow}
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
                    {loading ? <div>loading...</div> : dobConfidencePerRow}
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
                {(parseFloat(nameConfidencePerRow) +
                  parseFloat(dobConfidencePerRow)) /
                  2}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
export default PersonForm;
