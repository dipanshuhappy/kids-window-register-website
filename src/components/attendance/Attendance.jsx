import React from "react";
import NameAndCheckBox from "./NameAndCheckBox";
const Attendance = ({ studentsAttendance, changeStudentsAttendance }) => {
  const onCheckBoxClicked = (event) => {
    console.log("event :>> ", event);
    const name = event.target.parentElement.textContent;
    const oldAttendance = studentsAttendance.get(name);
    const newStudentsAttendance = new Map(studentsAttendance);
    newStudentsAttendance.set(name, !oldAttendance);
    changeStudentsAttendance(newStudentsAttendance);
    console.log("newStudentsAttendance :>> ", newStudentsAttendance);
  };
  return (
    <div className="centerHorizontal">
      {Array.from(studentsAttendance.keys()).map((name) => {
        console.log(name, studentsAttendance.get(name));
        return (
          <NameAndCheckBox
            key={name}
            name={name}
            isChecked={studentsAttendance.get(name)}
            onCheckBoxClicked={onCheckBoxClicked}
          />
        );
      })}
    </div>
  );
};

export default Attendance;
