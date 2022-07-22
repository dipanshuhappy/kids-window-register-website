import React, { useState } from "react";
import AccentButton from "./../components/AccentButton";
const AdminPage = () => {
//   const [admin, setAdmin] = useState("");
  
  const onChangeTermClick = () => {
    console.log("term clicked");
  };
  const onChangeAcademicTermClick = () => {
    console.log("onChangeAcademicTermClick clicked");
  };
  const onChangeClassCodeClickClick = () => {
    console.log("onChangeClassCodeClickClick clicked");
  };
  return (
    <div className="h-screen w-full">
      <div className="w-full colorAccent">
        <AccentButton name="Goto Home" />
      </div>
      <div className="colorAccent  m-32 p-8 rounded-2xl drop-shadow-md">
        <div className="mb-4">
          <label
            className=" block text-grey-darker text-sm font-bold mb-2"
            for="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="username"
            type="text"
            placeholder="Email"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            for="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            type="password"
            placeholder="******************"
            required
          />
          <p className="text-red text-xs italic">Enter a password.</p>
        <div className="flex items-center justify-between">
          <button
            className="mt-5 bg-blue-800 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded"
            type="button"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
      {/* <AccentButton style={{marginTop:"16px"}} name="Change term" onClick={onChangeTermClick}/>
        <AccentButton style={{marginTop:"16px"}} name="start new academic year" onClick={onChangeAcademicTermClick}/>
        <AccentButton  style={{marginTop:"16px"}} name="Change class code" onClick={onChangeClassCodeClickClick}/> */}
    </div>
  );
};

export default AdminPage;
