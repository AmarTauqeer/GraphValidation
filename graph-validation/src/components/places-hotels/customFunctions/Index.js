import axios from "axios";
import data from "../../../data/data";
import { googleKey, yandexKey } from "../../core/Credentials";
// graphdb related functions
import GetDataFromHotel from "./GetDataFromHotel";
import FetchGooglePlaceDetail from "../helperFunctions/FetchGooglePlaceDetail";
// helper functions
import GetOpenData from "../helperFunctions/GetOpenData";
import GetYandexData from "../helperFunctions/GetYandexData";
import GetNameConfidence from "../helperFunctions/GetNameConfidence";
import GetPhoneConfidence from "../helperFunctions/GetPhoneConfidence";
import GetAddressConfidence from "../helperFunctions/GetAddressConfidence";
import HotelData from "../helperFunctions/HotelData";

// google place
const fetchGooglePlace = async (
  place,
  inputFields,
  lat_param,
  log_param,
  address_param
) => {
  console.log(lat_param + log_param + address_param + place);
  let googleCredentials = googleKey();
  var googlePlace = [];
  if (place) {
    const result = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=%${place} ${address_param}%&inputtype=textquery&fields=name,business_status,formatted_address,place_id,geometry&locationbias=circle:2000@${lat_param},${log_param}&key=${googleCredentials}`
    );
    //console.log(result);
    if (result.data.status !== "ZERO_RESULTS") {
      const fetchData = result.data.candidates[0];
      const placeId = fetchData.place_id;
      const address = fetchData.formatted_address;
      if (!placeId) {
        console.log("place id is not exist");
      } else {
        googlePlace = await FetchGooglePlaceDetail(
          placeId,
          inputFields,
          address,
          googleCredentials
        );
      }
    }
  }
  return await googlePlace;
};

// openstreetmap
const fetchOpenPlaceDetail = async (place, inputFields) => {
  //let openCredentails=OpenKey();
  let openData = [];
  var name = "Record not found.";
  if (data) {
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags.name !== undefined
            ? i.tags.name === place
              ? (name = i.tags.name)
              : ""
            : ""}
        </li>
      );
    });
  }
  openData = GetOpenData(place, inputFields, name, data);
  return openData;
};

// yendax
const fetchYendaxPlaceDetail = async (
  place,
  inputFields,
  lat_param,
  log_param,
  phone_param
) => {
  let yandexCredentails = yandexKey();
  //console.log(phone_param);
  const result = await axios(
    `https://search-maps.yandex.ru/v1/?text=${phone_param}&ll=${lat_param},${log_param}&type=biz&lang=en_US&apikey=${yandexCredentails}`
  );
  //console.log(result.data);

  let name = result.data.features[0].properties.name;
  let phone = "Record not found";
  let address = "Record not found";
  if (result.data.features[0].properties.CompanyMetaData.Phones) {
    let phoneStr =
      result.data.features[0].properties.CompanyMetaData.Phones[0].formatted;
    phone = phoneStr.replace(/\s/g, "");
  }
  if (result.data.features[0].properties.CompanyMetaData.address) {
    address = result.data.features[0].properties.CompanyMetaData.address;
  }

  let yandexData = [];
  yandexData = GetYandexData(
    place,
    inputFields,
    lat_param,
    log_param,
    phone_param,
    name,
    address,
    phone
  );
  return yandexData;
};

// hotel
const fetchHotelPlaceDetail = async (place, inputFields) => {
  // endpoint url and query for hotel dataset
  const endpointUrlHotel =
    "http://172.16.44.133:7200/repositories/TirolGraph-Alpha";
  const sparqlQueryHotel = `PREFIX rdfs:<http://schema.org/>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX dc:<http://purl.org/dc/terms/>select distinct ?name ?latitude ?longitude ?email ?url ?addressCountry ?addressRegion ?addressLocality ?streetAddress ?postalCode ?phone ?loc ?add ?contact
  where{
      ?s a rdfs:Hotel .
      ?s rdfs:name ?name .
      ?s rdfs:url ?url .
      ?s rdfs:email ?email .
      ?s rdfs:location ?loc .
      ?loc rdfs:geo ?geo .
      ?geo rdfs:longitude ?longitude .
      ?geo rdfs:latitude ?latitude .
      ?loc rdfs:address ?add .
      ?add rdfs:addressCountry ?addressCountry .
      ?add rdfs:addressRegion ?addressRegion .
      ?add rdfs:addressLocality ?addressLocality .
      ?add rdfs:streetAddress ?streetAddress .
      ?add rdfs:postalCode ?postalCode .
      ?s rdfs:contactPoint ?contact .
      ?contact rdfs:telephone ?phone .

      FILTER(lang(?name) = 'en')
      FILTER regex(?name ,"${place}") .
  }
  `;
  const queryDispatcherHotel = new GetDataFromHotel(endpointUrlHotel);

  let hotelData = [];
  let name = "Record not found.";
  let phone = "Record not found.";
  let address = "Record not found.";
  let address_from_db = "Record not found.";
  let latitude = "Record not found.";
  let longitude = "Record not found.";
  let phone_from_db = "Record not found.";

  await queryDispatcherHotel.query(sparqlQueryHotel).then((res) => {
    //console.log(res.results.bindings);
    if (res.results.bindings.length >= 1) {
      name = res.results.bindings[0].name.value;
      latitude = res.results.bindings[0].latitude.value;
      longitude = res.results.bindings[0].longitude.value;
      phone = res.results.bindings[0].phone.value;
      phone_from_db = res.results.bindings[0].phone.value;
      address = res.results.bindings[0].streetAddress.value;
      address_from_db = res.results.bindings[0].streetAddress.value;
      //url = res.results.bindings[0].url.value;
    }
  });
  hotelData = HotelData(inputFields);
  console.log(hotelData);
};

// compute confidence name
const fetchNameConfidence = (data, place, state) => {
  let nameConfidence = GetNameConfidence(data, place, state);
  return nameConfidence;
};
const fetchPhoneConfidence = (data, phone, state) => {
  let phoneConfidence = GetPhoneConfidence(data, phone, state);
  return phoneConfidence;
};

const fetchAddressConfidence = (data, address, state) => {
  let addressConfidence = GetAddressConfidence(data, address, state);
  return addressConfidence;
};
export {
  fetchGooglePlace,
  fetchOpenPlaceDetail,
  fetchYendaxPlaceDetail,
  fetchHotelPlaceDetail,
  fetchNameConfidence,
  fetchPhoneConfidence,
  fetchAddressConfidence,
};
