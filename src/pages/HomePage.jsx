import React from "react";
import LoginModal from "../components/LoginModal";
import { getDoc } from "firebase/firestore";
import Store from "../Store";
import { adminDoc, classCodesDoc, validateLogin } from "../Firebase";
import { useAlert } from "react-alert";
const HomePage = ({ toggleLoggedInBar, history }) => {
  const [passCode, changePassCode] = React.useState("");
  const alert = useAlert();
  const handleOnSubmitPassCode = async () => {
    const classCodeDoc = await getDoc(classCodesDoc);
    if (validateLogin(classCodeDoc, passCode)) {
      const newClassId = classCodeDoc.data()[passCode];
      toggleLoggedInBar(true, newClassId);
      Store.classId = newClassId;
      await setTerm();
      history.push("/students");
    } else {
      alert.error("Wrong Class Code");
    }
  };
  async function setTerm() {
    const adminSnapShot = await getDoc(adminDoc);
    Store.term = adminSnapShot.data().term;
  }
  return (
    <div className="homePage colorPrimary">
      <img
        src="./dist/assets/ic_logo.png"
        width="auto"
        height="auto"
        className="centerHorizontal mb-12"
      />
      <LoginModal
        className="centerHorizontal  mt-2"
        value={passCode}
        valueChangedHandler={changePassCode}
        onSubmit={handleOnSubmitPassCode}
      />
      <h2 className="font-semibold font-serif textColorAccent centerHorizontal">
        Attendance Website.
      </h2>
      <h2 className=" font-semibold textColorAccent centerHorizontal">
        Trainging a new Generation
      </h2>
    </div>
  );
};

export default HomePage;
