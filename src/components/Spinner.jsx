import React from "react";
import { SpinnerCircular } from "spinners-react";

function Spinner({ enabled }) {
  return (
    <>
      {enabled && (
        <SpinnerCircular
          enabled={enabled}
          className="centerHorizontal"
          color="#b50921"
        />
      )}
    </>
  );
}

export default Spinner;
