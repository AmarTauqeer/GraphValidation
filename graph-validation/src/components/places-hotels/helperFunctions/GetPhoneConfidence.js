const GetPhoneConfidence = async (data, phone, state) => {
  let confidence = 0.0;
  let confidenceGoogle = 0.0;
  let confidenceOpen = 0.0;
  let confidenceYendax = 0.0;
  {
    data.map((d) => {
      // confidence google
      if (d.dataSource === "Google" && phone === d.phone) {
        confidenceGoogle = Number(state.googleWeight);
      }

      // confidence open
      if (d.dataSource === "Open" && phone === d.phone) {
        confidenceOpen = Number(state.openWeight);
      }

      // confidence yendax
      if (d.dataSource === "Yendax" && phone === d.phone) {
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
export default GetPhoneConfidence;
