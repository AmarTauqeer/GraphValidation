import axios from "axios";
const FetchGooglePlaceDetail = async (
  placeId,
  inputFields,
  address,
  googleCredentials
) => {
  let googleData = [];
  const result = await axios(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,international_phone_number&key=${googleCredentials}`
  );
  //console.log(result);
  let name = result.data.result.name;
  let phoneStr = result.data.result.international_phone_number;
  let phone = phoneStr.replace(/\s/g, "");

  if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone" &&
    inputFields[2].predicate === "address"
  ) {
    googleData = [
      {
        name,
        phone,
        address,
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "address" &&
    inputFields[2].predicate === "phone"
  ) {
    googleData = [
      {
        name,
        phone,
        address,
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone"
  ) {
    googleData = [
      {
        name,
        phone,
        address: "",
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "address"
  ) {
    googleData = [
      {
        name,
        phone: "",
        address: address,
      },
    ];
  } else if (inputFields.length === 1 && inputFields[0].predicate === "name") {
    googleData = [
      {
        name,
        phone: "",
        address: "",
      },
    ];
  } else if (inputFields.length === 2 && inputFields[1].predicate === "phone") {
    googleData = [
      {
        name,
        phone,
        address: "",
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[2].predicate === "address"
  ) {
    googleData = [
      {
        name,
        phone: "",
        address: address,
      },
    ];
  }
  //console.log(googleData);
  return await googleData;
};

export default FetchGooglePlaceDetail;
