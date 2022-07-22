import React from "react";
const NameAndCheckBox = ({ name, isChecked, onCheckBoxClicked }) => {
  return (
    <span className="flex justify-center" style={{ marginTop: "16px" }}>
      <p className="text-center mr-8">{name}</p>
      <input
        className="cursor-pointer innerColorAccent"
        style={{
          borderRadius: "8px",
        }}
        type="checkbox"
        checked={isChecked}
        onChange={(event) => onCheckBoxClicked(event)}
      />
    </span>
  );
};
export default NameAndCheckBox;
