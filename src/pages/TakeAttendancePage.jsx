import React, { useEffect } from "react";
import AccentButton from "../components/buttons/AccentButton";
import Attendance from "../components/Attendance";
import Store from "../Store";
import {
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { format } from "date-fns";
import { getClassDoc, getDateDoc, getStudentHistoryDoc } from "../Firebase";
import { useAlert } from "react-alert";
import Spinner from "../components/Spinner";

const TakeAttendancePage = () => {
  const todayDate = format(new Date(), "dd-MM-yyyy");
  const [studentsAttendance, changeStudentsAttendance] = React.useState(
    new Map()
  );
  const [showSpinner,setShowSpinner]=React.useState(false);
  const alert= useAlert();
  const classDocRef = getClassDoc(Store.classId);
  const getStudentAttendance = async () => {
    const snapShot = await getDoc(classDocRef);
    const classNames = snapShot.data().names;
    console.log("classNames :>> ", classNames);
    const newStudentsAttendane = new Map();
    classNames.forEach((name) => {
      newStudentsAttendane.set(name, false);
    });
    changeStudentsAttendance(newStudentsAttendane);
  };
  useEffect(() => {
    getStudentAttendance();
  }, []);
  const makeAlert = (text,type="success") => {
    setShowSpinner(false);
    if(type==="success"){
      alert.success(text)
    }
    else if (type==="error"){
      alert.error(text)
    }
    
  };
  const onSaveAttendanceClick = async () => {
    console.log("save attendance");
    setShowSpinner(true);
    try{
      await sendSavedAttendance();
      await updateStudentSubCollection();
    }
    catch(err){
      makeAlert("Attendance no saved",type="error")
    }
    makeAlert("Attendance Saved");
  };
  const sendSavedAttendance = async () => {
    const docRef = getDateDoc(Store.term, todayDate);
    const dataTobeSent = {};
    dataTobeSent[Store.classId] = Object.fromEntries(studentsAttendance);
    return await setDoc(docRef, dataTobeSent);
  };
  const updateStudentSubCollection = async () => {
    Array.from(studentsAttendance.keys()).forEach(async (name) => {
      const studentDocRef = getStudentHistoryDoc(Store.classId, name);
      if (studentsAttendance.get(name)) {
        const str = `${Store.term}.dates_present`;
        await updateDoc(studentDocRef, {
          [str]: arrayUnion(todayDate),
        });
      } else {
        const str = `${Store.term}.dates_absent`;
        await updateDoc(studentDocRef, {
          [str]: arrayUnion(todayDate),
        });
      }
    });
  };
  return (
    <div className="h-screen w-full">
      <h3 className="text-center font-bold">{`Attendance for ${Store.classId} term ${Store.term} date ${todayDate}`}</h3>
      <Attendance
        studentsAttendance={studentsAttendance}
        changeStudentsAttendance={changeStudentsAttendance}
      />
      <Spinner enabled={showSpinner}/>
      <AccentButton name="Save attendance" onClick={onSaveAttendanceClick} />
    </div>
  );
};

export default TakeAttendancePage;
