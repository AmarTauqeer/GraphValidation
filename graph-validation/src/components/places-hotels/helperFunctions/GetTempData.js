const GetTempData = (
  inputFields,
  tempPlaceData,
  nameConfidence,
  phoneConfidence,
  addressConfidence
) => {
  let tempData = getTempData(
    inputFields,
    tempPlaceData,
    nameConfidence,
    phoneConfidence,
    addressConfidence
  );
  return tempData;
};

const getTempData = (
  inputFields,
  tempPlaceData,
  nameConfidence,
  phoneConfidence,
  addressConfidence
) => {
  let tempData = [];
  if (inputFields.length === 2 && inputFields[1].predicate === "phone") {
    tempData = [
      ...tempData,
      {
        validationProperty: "Name",
        nameHotel: tempPlaceData[0].name,
        nameGoogle: tempPlaceData[1].name,
        nameOpen: tempPlaceData[2].name,
        nameYendax: tempPlaceData[3].name,
        confidenceName: nameConfidence, //* 100,
      },
      {
        validationProperty: "Phone",
        phoneHotel: tempPlaceData[0].phone,
        phoneGoogle: tempPlaceData[1].phone,
        phoneOpen: tempPlaceData[2].phone,
        phoneYendax: tempPlaceData[3].phone,
        confidencePhone: phoneConfidence, // * 100,
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[1].predicate === "address"
  ) {
    tempData = [
      ...tempData,
      {
        validationProperty: "Name",
        nameHotel: tempPlaceData[0].name,
        nameGoogle: tempPlaceData[1].name,
        nameOpen: tempPlaceData[2].name,
        nameYendax: tempPlaceData[3].name,
        confidenceName: nameConfidence, // * 100,
      },
      {
        validationProperty: "Address",
        addressHotel: tempPlaceData[0].address,
        addressGoogle: tempPlaceData[1].address,
        addressOpen: tempPlaceData[2].address,
        addressYendax: tempPlaceData[3].address,

        confidenceAddress: addressConfidence, // * 100,
      },
    ];
  } else if (inputFields.length === 3 && inputFields[1].predicate === "phone") {
    tempData = [
      ...tempData,
      {
        validationProperty: "Name",
        nameHotel: tempPlaceData[0].name,
        nameGoogle: tempPlaceData[1].name,
        nameOpen: tempPlaceData[2].name,
        nameYendax: tempPlaceData[3].name,
        confidenceName: nameConfidence, // * 100,
      },
      {
        validationProperty: "Phone",
        phoneHotel: tempPlaceData[0].phone,
        phoneGoogle: tempPlaceData[1].phone,
        phoneOpen: tempPlaceData[2].phone,
        phoneYendax: tempPlaceData[3].phone,
        confidencePhone: phoneConfidence, // * 100,
      },
      {
        validationProperty: "Address",
        addressHotel: tempPlaceData[0].address,
        addressGoogle: tempPlaceData[1].address,
        addressOpen: tempPlaceData[2].address,
        addressYendax: tempPlaceData[3].address,

        confidenceAddress: addressConfidence, // * 100,
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[1].predicate === "address"
  ) {
    tempData = [
      ...tempData,
      {
        validationProperty: "Name",
        nameHotel: tempPlaceData[0].name,
        nameGoogle: tempPlaceData[1].name,
        nameOpen: tempPlaceData[2].name,
        nameYendax: tempPlaceData[3].name,
        confidenceName: nameConfidence, // * 100,
      },
      {
        validationProperty: "Address",
        addressHotel: tempPlaceData[0].address,
        addressGoogle: tempPlaceData[1].address,
        addressOpen: tempPlaceData[2].address,
        addressYendax: tempPlaceData[3].address,

        confidenceAddress: addressConfidence, // * 100,
      },
      {
        validationProperty: "Phone",
        phoneHotel: tempPlaceData[0].phone,
        phoneGoogle: tempPlaceData[1].phone,
        phoneOpen: tempPlaceData[2].phone,
        phoneYendax: tempPlaceData[3].phone,
        confidencePhone: phoneConfidence, // * 100,
      },
    ];
  } else {
    //console.log(tempPlaceData);
    tempData = [
      ...tempData,
      {
        validationProperty: "Name",
        nameHotel: tempPlaceData[0].name,
        nameGoogle: tempPlaceData[1].name,
        nameOpen: tempPlaceData[2].name,
        nameYendax: tempPlaceData[3].name,
        confidenceName: nameConfidence, // * 100,
      },
    ];
  }
  return tempData;
};

export default GetTempData;
