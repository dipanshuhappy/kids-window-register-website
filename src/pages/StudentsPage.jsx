import React, { useEffect } from "react";
import AddButton from "../components/buttons/AddButton";
import InfoModal from "../components/modals/InfoModal";
import ListView from "../components/attendance/ListView";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import Store from "../Store";
import ActionModal from "../components/modals/ActionModal";
import AddModal from "../components/modals/AddStudentModal";
import { getClassDoc, getStudentHistoryDoc } from "../Firebase";
import { useAlert } from "react-alert";
const StudentsPages = ({ history }) => {
  const [studentNames, changeStudentNames] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showActionModal, setShowActionModal] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const alert = useAlert();
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [selectedName, setSelectedName] = React.useState("");
  const classDocRef = getClassDoc(Store.classId);
  const getStudentNames = async () => {
    const snapShot = await getDoc(classDocRef);
    if (
      snapShot.exists() &&
      snapShot.data().names !== undefined &&
      snapShot.data().names?.length
    ) {
      const classNames = snapShot.data().names;
      console.log(classNames);
      console.log("this is running student name");
      changeStudentNames(classNames);
    } else {
      console.log("Does not exist students");
      redirectToAddStudents();
    }
  };
  useEffect(async () => {
    (async () => {
      await getStudentNames();
    })();
  }, []);
  useEffect(() => {
    if (!showActionModal) {
      setTitle("");
      setBody("");
    }
  }, [showActionModal]);
  const redirectToAddStudents = () => {
    console.log("lkdjfslj");
    history.push("/add_student");
  };
  const makeAlert = (text) => {
    alert.success(text)
  };
  const getStudentAttendanceHistory = async (name) => {
    const studentRef = getStudentHistoryDoc(Store.classId,name)
    return await getDoc(studentRef);
  };
  const makeTitle = (name) => {
    setTitle(`Student attendance history of ${name}`);
  };
  const makeBody = (numberOfDaysAbsent, numberOfDaysPresent) => {
    const bodyText = `Student attendance history for ${Store.term.replace(
      "_",
      " "
    )}

        Number of days present ${numberOfDaysPresent}

        Number of days absent ${numberOfDaysAbsent}

        Total number of days ${numberOfDaysPresent + numberOfDaysAbsent}`;
    setBody(bodyText);
  };
  const onItemClicked = ({ target }) => {
    console.log("on item clicked");
    const name = target.textContent;
    getStudentAttendanceHistory(name).then((snapshot) => {
      const numberOfDaysPresent = snapshot.data()[Store.term]["dates_present"]
        ? snapshot.data()[Store.term]["dates_present"].length
        : 0;
      const numberOfDaysAbsent = snapshot.data()[Store.term]["dates_absent"]
        ? snapshot.data()[Store.term]["dates_absent"].length
        : 0;
      makeTitle(name);
      makeBody(numberOfDaysAbsent, numberOfDaysPresent);
      setShowModal(true);
    });
  };
  const onLongPress = ({ target }) => {
    setTitle(`Delete ${target.textContent}`);
    setBody(
      `Are you sure you want to delete ${target.textContent} ,once deleted it can't be undo`
    );
    setSelectedName(target.textContent);
    console.log("selectedName :>> ", selectedName);
    setShowActionModal(true);
  };
  const deleteFromNamesArray = () => {
    return updateDoc(classDocRef, {
      names: arrayRemove(selectedName),
    });
  };
  const deletStudentSubCollection = async () => {
    console.log("selectedName :>> ", selectedName);
    const studentDoc = getStudentHistoryDoc(Store.classId,selectedName)
    await deleteDoc(studentDoc);
  };
  const onAddButtonClick = () => {
    setTitle("Enter new student name");
    setShowAddModal(true);
  };
  const addStudentToArray = async (name) => {
    return updateDoc(classDocRef, {
      names: arrayUnion(name),
    });
  };
  const addStudentToSubCollection = async (name) => {
    const dataToBeSent = {};
    dataToBeSent[Store.term] = {
      dates_present: [],
      dates_absent: [],
    };
    const newStudentDocRef = getStudentHistoryDoc(Store.classId,name)
    await setDoc(newStudentDocRef, dataToBeSent);
  };
  const addStudent = (name) => {
    const nameToBeSent = `${name}-${studentNames.length + 1}`;
    const newArray = [...studentNames];
    newArray.push(nameToBeSent);
    changeStudentNames(newArray);
    addStudentToArray(nameToBeSent).then(() => {
      addStudentToSubCollection(nameToBeSent);
      setShowAddModal(false);
      makeAlert("Student added");
    });
  };
  const removeNameFromArray = () => {
    const newStudentNames = [...studentNames].filter(
      (name) => name !== selectedName
    );
    changeStudentNames(newStudentNames);
  };
  const onDeleteButtonClick = () => {
    console.log("delete button");
    deleteFromNamesArray().then(
      deletStudentSubCollection().then(() => {
        removeNameFromArray();
        setShowActionModal(false);
        makeAlert("Student deleted");
      })
    );
  };

  return (
    <div className="studentsPage colorPrimary">
      {showModal && (
        <InfoModal
          title={title}
          body={body}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      {showActionModal && (
        <ActionModal
          title={title}
          body={body}
          showModal={showActionModal}
          setShowModal={setShowActionModal}
          onClickEnter={onDeleteButtonClick}
        />
      )}
      {showAddModal && (
        <AddModal
          title={title}
          showModal={showAddModal}
          setShowModal={setShowAddModal}
          addStudents={addStudent}
        />
      )}
      <span>
        <AddButton onClick={onAddButtonClick} />
      </span>
      <h3 className="text-center font-bold">
        Long press on a student name to delete it
      </h3>
      {studentNames && (
        <ListView
          values={studentNames}
          onItemClicked={onItemClicked}
          onLongPress={onLongPress}
        />
      )}{" "}
    </div>
  );
};

export default StudentsPages;
