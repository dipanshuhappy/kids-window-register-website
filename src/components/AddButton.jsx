import React from "react";
const AddButton = ({ onClick, disabled }) => {
  return (
    <button
      className="colorAccent  text-white active:bg-red-900 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      + Add Student
    </button>
  );
};
AddButton.defaultProps = {
  disabled: false,
};

export default AddButton;
