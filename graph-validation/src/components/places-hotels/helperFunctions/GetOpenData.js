const GetOpenData = (place, inputFields, name, data) => {
  let openData = [];
  if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone" &&
    inputFields[2].predicate === "address"
  ) {
    let phoneData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["phone"] !== undefined ||
          i.tags["phone"] !== null ||
          i.tags["phone"] !== ""
            ? i.tags["phone"] === inputFields[1].object
              ? (phoneData = i.tags["phone"])
              : ""
            : i.tags["contact:phone"] !== undefined ||
              i.tags["contact:phone"] !== null ||
              i.tags["contact:phone"] !== ""
            ? i.tags["contact:phone"] === inputFields[1].object
              ? (phoneData = i.tags["contact:phone"])
              : ""
            : ""}
        </li>
      );
    });
    if (phoneData === "" || phoneData === null) {
      phoneData = "Record Not Found.";
    }

    // address
    let addressData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["addr:street"] !== undefined ||
          i.tags["addr:street"] !== null ||
          i.tags["addr:street"] !== ""
            ? i.tags["addr:street"] === inputFields[2].object
              ? (addressData = i.tags["addr:street"])
              : ""
            : ""}
        </li>
      );
    });
    if (addressData === "" || addressData === null) {
      addressData = "Record Not Found.";
    }

    openData = [
      {
        name,
        phone: phoneData,
        address: addressData,
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "address" &&
    inputFields[2].predicate === "phone"
  ) {
    let phoneData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["phone"] !== undefined ||
          i.tags["phone"] !== null ||
          i.tags["phone"] !== ""
            ? i.tags["phone"] === inputFields[2].object
              ? (phoneData = i.tags["phone"])
              : ""
            : i.tags["contact:phone"] !== undefined ||
              i.tags["contact:phone"] !== null ||
              i.tags["contact:phone"] !== ""
            ? i.tags["contact:phone"] === inputFields[2].object
              ? (phoneData = i.tags["contact:phone"])
              : ""
            : ""}
        </li>
      );
    });
    if (phoneData === "" || phoneData === null) {
      phoneData = "Record Not Found.";
    }
    // address
    let addressData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["addr:street"] !== undefined ||
          i.tags["addr:street"] !== null ||
          i.tags["addr:street"] !== ""
            ? i.tags["addr:street"] === inputFields[1].object
              ? (addressData = i.tags["addr:street"])
              : ""
            : ""}
        </li>
      );
    });
    if (addressData === "" || addressData === null) {
      addressData = "Record Not Found.";
    }

    openData = [
      {
        name,
        phone: phoneData,
        address: addressData,
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone"
  ) {
    let phoneData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["phone"] !== undefined ||
          i.tags["phone"] !== null ||
          i.tags["phone"] !== ""
            ? i.tags["phone"] === inputFields[1].object
              ? (phoneData = i.tags["phone"])
              : ""
            : i.tags["contact:phone"] !== undefined ||
              i.tags["contact:phone"] !== null ||
              i.tags["contact:phone"] !== ""
            ? i.tags["contact:phone"] === inputFields[1].object
              ? (phoneData = i.tags["contact:phone"])
              : ""
            : ""}
        </li>
      );
    });
    if (phoneData === "" || phoneData === null) {
      phoneData = "Record Not Found.";
    }
    openData = [
      {
        name,
        phone: phoneData,
        address: "",
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "address"
  ) {
    // address
    let addressData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["addr:street"] !== undefined ||
          i.tags["addr:street"] !== null ||
          i.tags["addr:street"] !== ""
            ? i.tags["addr:street"] === inputFields[1].object
              ? (addressData = i.tags["addr:street"])
              : ""
            : ""}
        </li>
      );
    });
    if (addressData === "" || addressData === null) {
      addressData = "Record Not Found.";
    }

    openData = [
      {
        name,
        phone: "",
        address: addressData,
      },
    ];
  } else if (inputFields.length === 1 && inputFields[0].predicate === "name") {
    openData = [
      {
        name,
        phone: "",
        address: "",
      },
    ];
  } else if (inputFields.length === 2 && inputFields[1].predicate === "phone") {
    let phoneData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["phone"] !== undefined ||
          i.tags["phone"] !== null ||
          i.tags["phone"] !== ""
            ? i.tags["phone"] === inputFields[1].object
              ? (phoneData = i.tags["phone"])
              : ""
            : i.tags["contact:phone"] !== undefined ||
              i.tags["contact:phone"] !== null ||
              i.tags["contact:phone"] !== ""
            ? i.tags["contact:phone"] === inputFields[1].object
              ? (phoneData = i.tags["contact:phone"])
              : ""
            : ""}
        </li>
      );
    });
    if (phoneData === "" || phoneData === null) {
      phoneData = "Record Not Found.";
    }
    openData = [
      {
        name,
        phone: phoneData,
        address: "",
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[2].predicate === "address"
  ) {
    // address
    let addressData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["addr:street"] !== undefined ||
          i.tags["addr:street"] !== null ||
          i.tags["addr:street"] !== ""
            ? i.tags["addr:street"] === inputFields[1].object
              ? (addressData = i.tags["addr:street"])
              : ""
            : ""}
        </li>
      );
    });
    if (addressData === "" || addressData === null) {
      addressData = "Record Not Found.";
    }

    openData = [
      {
        name,
        phone: "",
        address: addressData,
      },
    ];
  }
  return openData;
};

export default GetOpenData;
