import React from "react";
import ShowPasswordIcon from "../icons/ShowPassWordIcon";
const PassCodeInput = ({ value,maxLength, valueChangedHandler, className, hint }) => {
  const [visibility, toggleVisibility] = React.useState(false);
  return (
    <div className={className}>
      <div className="relative flex w-full flex-wrap items-stretch mb-3">
        <input
          value={value}
          onChange={(event) => {
            event.preventDefault();
            valueChangedHandler(event.target.value);
          }}
          type={visibility ? "text" : "password"}
          placeholder={hint}
          maxLength={maxLength}
          className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white  rounded text-sm border border-blueGray-300 outline-none borderAccent focus:outline-none focus:ring  w-full pr-10"
        />
        <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">
          <ShowPasswordIcon
            visibility={visibility}
            toggleVisibility={toggleVisibility}
          />
        </span>
      </div>
    </div>
  );
};

export default PassCodeInput;
