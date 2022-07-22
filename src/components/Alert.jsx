import React, { useEffect } from "react";
const Alert = ({ showAlert, setShowAlert, text, timed }) => {
  if (timed) {
    const [time, setTime] = React.useState(0);
    let interval = null;
    useEffect(() => {
      const interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
      console.log("time :>> ", time);
      return () => {
        setTime(0);
        clearInterval(interval);
      };
    }, []);
    useEffect(() => {
      if (time > 3) {
        setShowAlert(false);
      }
    }, [time]);
    useEffect(() => {
      if (showAlert === false) {
        setTime(0);
        if (interval === false) {
          clearInterval(false);
        }
      }
    }, [showAlert]);
  }
  return (
    <>
      {showAlert ? (
        <div
          className={
            "text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-500"
          }
        >
          <span className="text-xl inline-block mr-5 align-middle">
            <i className="fas fa-bell" />
          </span>
          <span className="inline-block align-middle mr-8">
            <b className="capitalize">{text}</b>
          </span>
          <button
            className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
            onClick={() => setShowAlert(false)}
          >
            <span>×</span>
          </button>
        </div>
      ) : null}
    </>
  );
};

export default Alert;
