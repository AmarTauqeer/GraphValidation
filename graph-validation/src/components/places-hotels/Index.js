import React, { Fragment, useState } from "react";

import {
  fetchGooglePlace,
  fetchOpenPlaceDetail,
  fetchYendaxPlaceDetail,
  fetchHotelPlaceDetail,
  fetchNameConfidence,
  fetchPhoneConfidence,
  fetchAddressConfidence,
} from "./customFunctions/Index";
import GetTempData from "./helperFunctions/GetTempData";
import { v4 as uuidv4 } from "uuid";
import SearchImage from "../../images/search.png";
import AddImage from "../../images/add.png";

const Index = () => {
  // array to store the detail part
  const [data, setData] = useState([]);
  const [counter, setCounter] = useState(1);
  // array for dynamically add/remove and handling input fields
  const [inputFields, setInputFields] = useState([
    {
      id: uuidv4(),
      subject: "",
      predicate: "name",
      object: "",
      disabled: true,
    },
  ]);
  // hook for instance confidence
  const [instanceConfidence, setInstanceConfidence] = useState(0.0);
  // hooks for manual confidence selection by user
  const [state, setState] = React.useState({
    googleWeight: 0.4,
    openWeight: 0.3,
    yandexWeight: 0.3,
  });

  // handle change input of manual assigning weights
  const handleChange = (event) => {
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value,
    });
  };

  // handle change input fields
  const handleChangeInput = (id, event) => {
    const newInputFields = inputFields.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });
    setInputFields(newInputFields);
  };
  // add dynamically input fields
  const handleAddFields = () => {
    let name = inputFields[0].subject;
    if (name !== "") {
      let tempCounter = counter + 1;
      setCounter(tempCounter);
      if (counter <= 2) {
        setInputFields([
          ...inputFields,
          {
            id: uuidv4(),
            subject: inputFields[0].subject,
            predicate: "phone",
            object: "",
            disabled: false,
          },
        ]);
      } else {
        alert("Only three properties allowed!");
      }
    } else {
      alert("Please select subject first");
    }
  };
  // remove dynamically input fields
  const handleRemoveFields = (id, subject) => {
    if (inputFields.length > 1) {
      const values = [...inputFields];
      values.splice(
        values.findIndex((value) => value.id === id),
        1
      );
      setInputFields(values);
      setCounter(1);
      // call search button
      if (data.length > 1) {
        const values = [...data];
        values.splice(
          values.findIndex((value) => value.id === id),
          1
        );
        setData(values);
      }
    }
  };
  // search
  const handleButtonClick = async (place, event) => {
    event.preventDefault();
    var tempPlaceData = [];

    // get the value of current subject/place name
    const subject = inputFields[0].subject;
    if (subject === "" || subject === undefined) {
      alert("Subject field is required.");
      return false;
    }
    // check total weights
    let totalWeight =
      Number(state.googleWeight) +
      Number(state.openWeight) +
      Number(state.yandexWeight);
    totalWeight = Math.ceil(totalWeight);
    if (totalWeight !== 1) {
      alert("Sum of assigning weights should be 1!");
      return false;
    }

    // place name with confidence
    if (place) {
      // hotel
      // let hotelPlaceData = await fetchHotelPlaceDetail(place, inputFields);
      // tempPlaceData = [
      //   ...tempPlaceData,
      //   {
      //     dataSource: "Hotel",
      //     name: hotelPlaceData[0].name,
      //     phone: hotelPlaceData[0].phone,
      //     phone_from_db: hotelPlaceData[0].phone_from_db,
      //     address: hotelPlaceData[0].address,
      //     address_from_db: hotelPlaceData[0].address_from_db,
      //     latitude:hotelPlaceData[0].latitude,
      //     longitude:hotelPlaceData[0].longitude
      //   },
      // ];
      // let lat_param=tempPlaceData[0].latitude;
      // let log_param=tempPlaceData[0].longitude;
      // let address_param=tempPlaceData[0].address_from_db;
      // let phone_param=tempPlaceData[0].phone_from_db;
      // // google
      // let googlePlaceData = await fetchGooglePlace(place, inputFields,lat_param,log_param,address_param);
      //   tempPlaceData = [
      //     ...tempPlaceData,
      //     {
      //       dataSource: "Google",
      //       name: googlePlaceData[0].name,
      //       phone: googlePlaceData[0].phone,
      //       address: googlePlaceData[0].address,
      //       latitude:hotelPlaceData[0].latitude,
      //       longitude:hotelPlaceData[0].longitude
      //     },
      //   ];
      // // open
      // let openPlaceData = await fetchOpenPlaceDetail(place, inputFields);
      //   tempPlaceData = [
      //     ...tempPlaceData,
      //     {
      //       dataSource: "Open",
      //       name: openPlaceData[0].name,
      //       phone: openPlaceData[0].phone,
      //       address: openPlaceData[0].address,
      //       latitude:hotelPlaceData[0].latitude,
      //       longitude:hotelPlaceData[0].longitude
      //     },
      //   ];
      // // yendax
      // let yendaxPlaceData = await fetchYendaxPlaceDetail(place, inputFields,lat_param,log_param,phone_param);
      //   tempPlaceData = [
      //     ...tempPlaceData,
      //     {
      //       dataSource: "Yendax",
      //       name: yendaxPlaceData[0].name,
      //       phone: yendaxPlaceData[0].phone,
      //       address: yendaxPlaceData[0].address,
      //       latitude:hotelPlaceData[0].latitude,
      //       longitude:hotelPlaceData[0].longitude
      //     },
      //   ];
      // // get phone value
      // let phoneValue = "";
      // if (inputFields.length === 2 && inputFields[1].predicate === "phone") {
      //   phoneValue = inputFields[1].object;
      // } else if (
      //   inputFields.length === 3 &&
      //   inputFields[1].predicate === "phone"
      // ) {
      //   phoneValue = inputFields[1].object;
      // } else if (
      //   inputFields.length === 3 &&
      //   inputFields[2].predicate === "phone"
      // ) {
      //   phoneValue = inputFields[2].object;
      // }
      // // get address value
      // let addressValue = "";
      // if (inputFields.length === 2 && inputFields[1].predicate === "address") {
      //   addressValue = inputFields[1].object;
      // } else if (
      //   inputFields.length === 3 &&
      //   inputFields[1].predicate === "address"
      // ) {
      //   addressValue = inputFields[1].object;
      // } else if (
      //   inputFields.length === 3 &&
      //   inputFields[2].predicate === "address"
      // ) {
      //   addressValue = inputFields[2].object;
      // }
      // // compute confidence for name
      // let nameConfidence = 0.0;
      // let phoneConfidence = 0.0;
      // let addressConfidence = 0.0;
      // nameConfidence = await fetchNameConfidence(tempPlaceData, place, state);
      // phoneConfidence = await fetchPhoneConfidence(
      //   tempPlaceData,
      //   phoneValue,
      //   state
      // );
      // addressConfidence = await fetchAddressConfidence(
      //   tempPlaceData,
      //   addressValue,
      //   state
      // );
      // let tempData = GetTempData();
      // console.log(tempData);
      // place
      // let instanceScore=0.0;
      // // instance confidence score
      // if (tempData.length==2 && tempData[1].validationProperty==="Phone") {
      //   instanceScore=(nameConfidence+phoneConfidence)/2;
      // }
      // if(tempData.length==2 && tempData[1].validationProperty==="Address")
      // {
      //   instanceScore=(nameConfidence+addressConfidence)/2;
      // }
      // if(tempData.length===3)
      // {
      //   instanceScore=(nameConfidence+phoneConfidence+addressConfidence)/3;
      // }
      // if(tempData.length===1){
      //   instanceScore=nameConfidence;
      // }
      // //console.log(instanceScore);
      // setInstanceConfidence(instanceScore);
    }
  };
  return (
    <div className="container">
      <h2
        style={{ textAlign: "center", marginTop: "50px", marginBottom: "50px" }}
      >
        Knowledge Graph Validator
      </h2>
      <h4>Places</h4>
      <hr />
      <div className="row">
        <div>
          <button
            className="btn btn-seconday"
            type="button"
            onClick={handleAddFields}
          >
            <p>
              <img src={AddImage} width="40px" height="40px" alt="add more" />
              <br />
              add more
            </p>
          </button>
        </div>
        <div>
          {inputFields.map((inputField, index) => {
            return (
              <div className="row" key={index}>
                <div className="col-md-4">
                  {inputFields.length === 1 ? (
                    <div className="form-group form-group-lg">
                      <input
                        name="subject"
                        type="text"
                        className="form-control"
                        value={inputField.subject}
                        style={{ height: "40px" }}
                        onChange={(event) =>
                          handleChangeInput(inputField.id, event)
                        }
                        placeholder="KG-ID"
                      />
                    </div>
                  ) : (
                    <div className="form-group form-group-lg">
                      <input
                        name="subject"
                        type="text"
                        className="form-control"
                        value={inputField.subject}
                        style={{ height: "40px" }}
                        onChange={(event) =>
                          handleChangeInput(inputField.id, event)
                        }
                        disabled
                      />
                    </div>
                  )}
                </div>
                <div className="col-md-3">
                  <div className="form-group form-group-lg">
                    <select
                      className="form-control"
                      name="predicate"
                      value={inputField.predicate}
                      onChange={(event) =>
                        handleChangeInput(inputField.id, event)
                      }
                      style={{ height: "40px" }}
                      disabled={inputField.disabled}
                    >
                      <option defaultValue="name">Name</option>
                      <option value="phone">Phone</option>
                      <option value="address">Address</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  {inputFields.length !== 1 &&
                  inputField.predicate !== "name" ? (
                    <div className="form-group form-group-lg">
                      <input
                        name="object"
                        type="text"
                        className="form-control"
                        value={inputField.object}
                        disabled={inputField.disabled}
                        onChange={(event) =>
                          handleChangeInput(inputField.id, event)
                        }
                        placeholder="Phone/Address"
                        style={{ height: "40px" }}
                      />
                    </div>
                  ) : (
                    <div className="form-group form-group-lg">
                      <input
                        name="object"
                        type="text"
                        className="form-control"
                        value={inputField.object}
                        disabled={inputField.disabled}
                        onChange={(event) =>
                          handleChangeInput(inputField.id, event)
                        }
                        placeholder={inputField.subject}
                        style={{ height: "40px" }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    style={{ verticalAlign: "center", height: "40px" }}
                    onClick={() => handleRemoveFields(inputField.id)}
                  >
                    X
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-md">
          <button
            className="btn btn-seconday"
            type="submit"
            onClick={(event) =>
              handleButtonClick(inputFields[0].subject, event)
            }
          >
            <p>
              <img src={SearchImage} width="50px" height="40px" alt="search" />
              <br />
              search
            </p>
          </button>
        </div>

        <div className="col-md">
          <span>
            <b>Weights</b>
          </span>
          <div
            className="row"
            style={{ width: "150px", border: "solid 1px", color: "green" }}
          >
            <div className="col-md-5">
              <label>
                <b>Google</b>
              </label>
            </div>
            <div className="col-md-2">
              <input
                type="text"
                name="googleWeight"
                value={state.googleWeight}
                onChange={handleChange}
                style={{
                  width: "50px",
                  textAlign: "center",
                }}
              />
            </div>
            <div className="col-md-5">
              <label>
                <b>OSM</b>
              </label>
            </div>

            <div className="col-md-2">
              <input
                type="text"
                name="openWeight"
                value={state.openWeight}
                onChange={handleChange}
                style={{
                  width: "50px",
                  textAlign: "center",
                }}
              />
            </div>
            <div className="col-md-5">
              <label>
                <b>Yandex</b>
              </label>
            </div>
            <div className="col-md-2">
              <input
                type="text"
                name="yandexWeight"
                value={state.yandexWeight}
                onChange={handleChange}
                style={{
                  width: "50px",
                  textAlign: "center",
                }}
              />
            </div>
          </div>
          <br />
        </div>
      </div>

      <div
        className="row"
        style={{
          backgroundColor: "#ff8000",
          color: "white",
          height: "50px",
          textAlign: "center",
          alignContent: "center",
          fontSize: "18px",
        }}
      >
        <div className="col-md-2">Property Name</div>
        <div className="col-md-2">KG</div>
        <div className="col-md-2">Google Places</div>
        <div className="col-md-2">Open Street Map</div>
        <div className="col-md-2">Yandex Places</div>
        <div className="col-md-2">Confidence</div>
      </div>
      {data.map((a, index) => {
        return (
          <Fragment>
            <div className="row" key={index} style={{ border: "solid 1px" }}>
              <div className="col-md-2">
                <b>{a.validationProperty}</b>
              </div>
              <div className="col-md-2">
                {a.nameHotel
                  ? a.nameHotel
                  : a.phoneHotel
                  ? a.phoneHotel
                  : a.addressHotel
                  ? a.addressHotel
                  : ""}
              </div>
              <div className="col-md-2">
                {a.nameGoogle
                  ? a.nameGoogle
                  : a.phoneGoogle
                  ? a.phoneGoogle
                  : a.addressGoogle
                  ? a.addressGoogle
                  : ""}
              </div>
              <div className="col-md-2">
                {a.nameOpen
                  ? a.nameOpen
                  : a.phoneOpen
                  ? a.phoneOpen
                  : a.addressOpen
                  ? a.addressOpen
                  : ""}
              </div>
              <div className="col-md-2">
                {a.nameYendax
                  ? a.nameYendax
                  : a.phoneYendax
                  ? a.phoneYendax
                  : a.addressYendax
                  ? a.addressYendax
                  : ""}
              </div>
              <div
                className="col-md-2"
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "green",
                }}
              >
                <p>
                  {a.confidenceName
                    ? a.confidenceName
                    : a.confidencePhone
                    ? a.confidencePhone
                    : a.confidenceAddress
                    ? a.confidenceAddress
                    : 0}{" "}
                </p>
              </div>
            </div>
          </Fragment>
        );
      })}
      <div className="row" style={{ border: "solid 1px" }}>
        <div className="col-md-2"></div>
        <div className="col-md-2"></div>
        <div className="col-md-2"></div>
        <div className="col-md-2"></div>
        <div className="col-md-2"></div>
        <div
          className="col-md-2"
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "blue",
          }}
        >
          <p>{instanceConfidence === 0 ? "" : instanceConfidence.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
};
export default Index;
