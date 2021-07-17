const GetNameConfidence = (data, place, state) => {
  let confidence = 0.0;
  let confidenceGoogle = 0.0;
  let confidenceOpen = 0.0;
  let confidenceYendax = 0.0;

  {
    data.map((d) => {
      // confidence google
      if (d.dataSource === "Google" && d.name.includes(place) === true) {
        confidenceGoogle = Number(state.googleWeight);
      }

      // confidence open
      if (d.dataSource === "Open" && d.name.includes(place) === true) {
        confidenceOpen = Number(state.openWeight);
      }

      // confidence yendax
      if (d.dataSource === "Yendax" && d.name.includes(place) === true) {
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
    return confidence;
  }
};
export default GetNameConfidence;
