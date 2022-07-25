import React, { useEffect } from "react";
import Attendance from "../components/attendance/Attendance";
import DatePicker from "../components/inputs/DatePicker";
import AccentButton from "../components/buttons/AccentButton";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import Store from "../Store";

import { format } from "date-fns";

import { getClassDoc, getDateDoc, getStudentHistoryDoc } from "../Firebase";
import Spinner from "../components/Spinner";
import { useAlert } from "react-alert";
import { async } from "@firebase/util";

const DatesPage = () => {
  const defaultDate = format(new Date(), "dd-MM-yyyy");
  const [dateShow, toggleDateShow] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState(defaultDate);
  const [showSpinner,setShowSpinner]=React.useState(false);
  const alert = useAlert()
  const [studentsAttendance, changeStudentsAttendance] = React.useState(
    new Map()
  );
  const classDocRef = getClassDoc(Store.classId)
  const makeOrderedStudentAttendance = (
    classNames,
    unOrderStudentAttendance
  ) => {
    const newStudentsAttendane = new Map();
    classNames.forEach((name) => {
      newStudentsAttendane.set(name, unOrderStudentAttendance[name]);
    });
    changeStudentsAttendance(newStudentsAttendane);
  };
  const makeAlert = (text,type="success") => {
    setShowSpinner(false);
    if(type==="success"){
      alert.success(text)
    }
    else if (type==="error"){
      alert.error(text)
    }
  };
  const makeNewStudentAttendace = (classNames) => {
    const newStudentsAttendane = new Map();
    classNames.forEach((name) => {
      newStudentsAttendane.set(name, false);
    });
    changeStudentsAttendance(newStudentsAttendane);
  };
  const getStudentsAttendance = async () => {
    const dateDocRef = getDateDoc(Store.term,selectedDate)
    return getDoc(dateDocRef);
  };
  const getStudentAttendance = async () => {
    const snapShot = await getDoc(classDocRef);
    const classNames = snapShot.data().names;
    console.log("classNames :>> ", classNames);
    const unOrderStudentAttendance = await getStudentsAttendance();
    if (unOrderStudentAttendance.exists()) {
      makeOrderedStudentAttendance(
        classNames,
        unOrderStudentAttendance.data()[Store.classId]
      );
    } else {
      makeNewStudentAttendace(classNames);
    }
  };
  useEffect(() => {
    getStudentAttendance();
  }, [selectedDate]);
  const onSaveChangesAttendance = async () => {
    console.log("save attendance");
    try {
      setShowSpinner(true)
      await sendSavedAttendance()
      await updateStudentSubCollection();
    makeAlert("Attendance changes saved")
    } catch (error) {
      makeAlert("Attendance changes not saved error occured ","error")
    }
  
  };
  const sendSavedAttendance = async () => {
    const docRef = getDateDoc(Store.term,selectedDate)
    const dataTobeSent = {};
    dataTobeSent[Store.classId] = Object.fromEntries(studentsAttendance);
    return await setDoc(docRef, dataTobeSent);
  };
  const updateStudentSubCollection = async () => {
    const strPresent = `${Store.term}.dates_present`;
    const strAbsent = `${Store.term}.dates_absent`;
    Array.from(studentsAttendance.keys()).forEach(async (name) => {
      const studentDocRef =getStudentHistoryDoc(Store.classId,name);
      if (studentsAttendance.get(name)) {
        await updateDoc(studentDocRef, {
          [strAbsent]: arrayRemove(selectedDate),
        });
        await updateDoc(studentDocRef, {
          [strPresent]: arrayUnion(selectedDate),
        });
      } else {
        await updateDoc(studentDocRef, {
          [strPresent]: arrayRemove(selectedDate),
        });
        await updateDoc(studentDocRef, {
          [strAbsent]: arrayUnion(selectedDate),
        });
      }
    });
  };
  return (
    <div className="h-screen w-full">
      <DatePicker
        dateShow={dateShow}
        toggleDateShow={toggleDateShow}
        setSeletedDate={setSelectedDate}
      />
      {!dateShow && (
        <React.Fragment>
          <h3 className="text-center font-bold">{`Attendance for ${Store.classId} term ${Store.term} date ${selectedDate}`}</h3>
          <Attendance
            studentsAttendance={studentsAttendance}
            changeStudentsAttendance={changeStudentsAttendance}
          />
          <Spinner enabled={showSpinner}/>
          <AccentButton
            name="Save changes to attendance"
            onClick={onSaveChangesAttendance}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default DatesPage;
