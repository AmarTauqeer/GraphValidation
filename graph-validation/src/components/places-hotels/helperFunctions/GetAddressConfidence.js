const GetAddressConfidence = async (data, address, state) => {
    let confidence = 0.0;
    let confidenceGoogle = 0.0;
    let confidenceOpen = 0.0;
    let confidenceYendax = 0.0;
    {
      data.map((d) => {
        // confidence google
        //console.log(address.includes(d.address));
        if (d.dataSource === "Google" && d.address.includes(address) === true) {
          confidenceGoogle = Number(state.googleWeight);
        }
  
        // confidence open
        if (d.dataSource === "Open" && d.address.includes(address) === true) {
          confidenceOpen = Number(state.openWeight);
        }
  
        // confidence yendax
        if (d.dataSource === "Yendax" && d.address.includes(address) === true) {
          confidenceYendax = Number(state.yandexWeight);
        }
        return <div>&nbsp;</div>;
      });
  
      if (
        confidenceGoogle !== 0.0 &&
        confidenceOpen !== 0.0 &&
        confidenceYendax !== 0.0
      ) {
        confidence = confidenceGoogle + confidenceOpen + confidenceYendax;
      } else if (confidenceGoogle !== 0.0 && confidenceOpen !== 0.0) {
        confidence = confidenceGoogle + confidenceOpen;
      } else if (confidenceGoogle !== 0.0 && confidenceYendax !== 0.0) {
        confidence = confidenceGoogle + confidenceYendax;
      } else if (confidenceOpen !== 0.0 && confidenceYendax !== 0.0) {
        confidence = confidenceOpen + confidenceYendax;
      } else if (confidenceGoogle !== 0.0) {
        confidence = confidenceGoogle;
      } else if (confidenceOpen !== 0.0) {
        confidence = confidenceOpen;
      } else {
        confidence = confidenceYendax;
      }
  
      return await confidence;
    }
  };
  export default GetAddressConfidence