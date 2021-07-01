const GetYandexData = (
  place,
  inputFields,
  lat_param,
  log_param,
  phone_param,
  name,
  address,
  phone,
  data
) => {
  let yandexData = [];
  if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone" &&
    inputFields[2].predicate === "address"
  ) {
    yandexData = [
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
    yandexData = [
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
    yandexData = [
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
    yandexData = [
      {
        name,
        phone: "",
        address: address,
      },
    ];
  } else if (inputFields.length === 1 && inputFields[0].predicate === "name") {
    yandexData = [
      {
        name,
        phone: "",
        address: "",
      },
    ];
  } else if (inputFields.length === 2 && inputFields[1].predicate === "phone") {
    yandexData = [
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
    yandexData = [
      {
        name,
        phone: "",
        address: address,
      },
    ];
  }

  return yandexData;
};

export default GetYandexData;
