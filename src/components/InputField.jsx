import React from "react";

function InputField({label,htmlFor,placeholder,type,value,onChange}) {
  return (
    <>
      <label
        className="block text-grey-darker text-sm font-bold mb-2"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      <input
        className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
        type={type}
        placeholder={placeholder}
        required
        id={htmlFor}
        value={value}
        onChange={(event) => onChange(event)}
      />
    </>
  );
}

export default InputField;
