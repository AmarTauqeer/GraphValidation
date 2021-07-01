import React, { useState } from "react";
import inputData from "../person-validator/uploads/input.ttl";

import {
  searchPredicates,
  getInstance,
  computeConfidence,
  getWiki,
  getData,
} from "./person-helper-functions/index";

import axios from "axios";

function PersonForm() {
  const [loaddata, setLoaddata] = useState("");
  const [predicate, setPredicate] = useState("");
  const [predicateList, setPredicateList] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [data, setData] = useState([]);
  const [weightWiki, setWeightWiki] = useState(0);
  const [weightDbPedia, setweightDbPedia] = useState(0);
  const [confidence, setConfidence] = useState([]);
  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(graphData);
    const result = getResult();
    result.then((res) => {
      const confidence = computeConfidence(res, weightWiki, weightDbPedia);
      if (confidence) {
        // console.log(confidence);
        setConfidence(confidence);
      }
    });
  };

  const getResult = async () => {
    const resp = await getData(graphData);
    setData(resp);
    return resp;
  };

  const getGraphData = async (data) => {
    const response = await axios.post(
      "http://127.0.0.1:5000/api/post-data/",
      data
    );
    const resp = await response.data["graph_data"];
    setGraphData(resp);
  };

  // load predicate list
  const onDataLoadHandler = (e) => {
    if (loaddata) {
      const data = { loadig_data: loaddata };
      getGraphData(data);
    }

    // const instanceData = getInstance(loaddata);
    // if (loaddata) {
    //   let predicates = searchPredicates(loaddata);
    //   setPredicateList(predicates);
    // }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="form-group row">
          <div className="col-sm-12">
            <textarea
              type="textarea"
              className="form-control"
              id="loaddata"
              value={loaddata}
              rows="15"
              placeholder="Load or paste data here"
              onChange={(e) => setLoaddata(e.target.value)}
            ></textarea>
            <br />
            <button
              type="button"
              className="btn btn-success"
              onClick={onDataLoadHandler}
            >
              Load data
            </button>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Properties</label>
          <div className="col-sm-2">
            <select
              className="form-control"
              name="predicate"
              value={predicate}
              onChange={(e) => setPredicate(e.target.value)}
            >
              {/* {predicateList.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))} */}
              <option defaultValue="name">Name</option>
              <option value="phone">Date of Birth</option>
              <option value="address">Place of Birth</option>
            </select>
          </div>
          <div className="form-group row">
            <div className="col-sm-2">
              <button type="submit" className="btn btn-primary">
                validate
              </button>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-sm-2" style={{ textAlign: "right" }}>
            <label>Wiki Weight</label>
          </div>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              id="weightWiki"
              value={weightWiki}
              placeholder="Weight for wiki"
              onChange={(e) => setWeightWiki(e.target.value)}
            />
          </div>
          <div className="col-sm-2" style={{ textAlign: "right" }}>
            <label>DbPedia Weight</label>
          </div>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              id="weightDbPedia"
              value={weightDbPedia}
              placeholder="Weight for dbpedia"
              onChange={(e) => setweightDbPedia(e.target.value)}
            />
          </div>
        </div>
      </form>
      <div>
        <div className="row">
          <div className="col-md-3">
            <b>Name</b>
          </div>
          <div className="col-md-2">
            <b>DOB</b>
          </div>
          <div className="col-md-3">
            <b>Place of birth</b>
          </div>
          <div className="col-md-1">
            <b>Wiki</b>
          </div>
          <div className="col-md-1">
            <b>DbPedia</b>
          </div>
          <div className="col-md-1">
            <b>Overall</b>
          </div>
        </div>
        {graphData
          ? graphData.map((item, index) => {
              let overallConfidence = 0;
              return (
                <div className="row" key={index}>
                  <div className="col-md-3" key={item.givenName}>
                    {item.givenName}
                  </div>
                  <div className="col-md-2">{item.birthDate}</div>
                  <div className="col-md-3">{item.placeOfBirth}</div>
                  <div className="col-md-1">
                    {confidence
                      .filter(
                        (c) =>
                          c.givenName === item.givenName &&
                          c.confidence !== 0 &&
                          c.wiki === "true"
                      )
                      .map((result) => {
                        overallConfidence += result.confidence;
                        return result.confidence;
                      })}
                  </div>
                  <div className="col-md-1">
                    {" "}
                    {confidence
                      .filter(
                        (c) =>
                          c.givenName === item.givenName &&
                          c.confidence !== 0 &&
                          c.wiki === "false"
                      )
                      .map((result) => {
                        overallConfidence += result.confidence;
                        return result.confidence;
                      })}
                  </div>
                  <div className="col-md-1">{overallConfidence}</div>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
}
export default PersonForm;
