import React, { useEffect } from "react";
import Attendance from "../components/Attendance";
import DatePicker from "./../components/DatePicker";
import AccentButton from "./../components/AccentButton";
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
import Constants from "../Constants";
import { format } from "date-fns";
import Alert from "../components/Alert";

const DatesPage = () => {
  const defaultDate = format(new Date(), "dd-MM-yyyy");
  const [dateShow, toggleDateShow] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState(defaultDate);
  const [studentsAttendance, changeStudentsAttendance] = React.useState(
    new Map()
  );
  const [showAlert, setShowAlert] = React.useState("");
  const [alertText, setAlertText] = React.useState("");
  const db = getFirestore();
  const classDocRef = doc(db, Constants.CLASSES_COLLECTION_PATH, Store.classId);
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
  const makeAlert = (text) => {
    setAlertText(text);
    setShowAlert(true);
  };
  const makeNewStudentAttendace = (classNames) => {
    const newStudentsAttendane = new Map();
    classNames.forEach((name) => {
      newStudentsAttendane.set(name, false);
    });
    changeStudentsAttendance(newStudentsAttendane);
  };
  const getStudentsAttendance = async () => {
    const dateDocRef = doc(db, Store.term, selectedDate);
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
  const onSaveChangesAttendance = () => {
    console.log("save attendance");
    sendSavedAttendance().then(
      updateStudentSubCollection().then(makeAlert("Attendance changes saved"))
    );
  };
  const sendSavedAttendance = async () => {
    const docRef = doc(db, `${Store.term}/${selectedDate}`);
    const dataTobeSent = {};
    dataTobeSent[Store.classId] = Object.fromEntries(studentsAttendance);
    return await setDoc(docRef, dataTobeSent);
  };
  const updateStudentSubCollection = async () => {
    const strPresent = `${Store.term}.dates_present`;
    const strAbsent = `${Store.term}.dates_absent`;
    Array.from(studentsAttendance.keys()).forEach(async (name) => {
      const studentDocRef = doc(
        db,
        `${classDocRef.path}/${Constants.STUDENTS_COLLECTION_PATH}/${name}`
      );
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
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        text={alertText}
      />
      {!dateShow && (
        <React.Fragment>
          <h3 className="text-center font-bold">{`Attendance for ${Store.classId} term ${Store.term} date ${selectedDate}`}</h3>
          <Attendance
            studentsAttendance={studentsAttendance}
            changeStudentsAttendance={changeStudentsAttendance}
          />
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
