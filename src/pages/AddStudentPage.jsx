import React from "react";
import AccentButton from "../components/AccentButton";
import ActionModal from "../components/ActionModal";
import AddButton from "../components/AddButton";
import ListView from "../components/ListView";
import { getFirestore, setDoc, doc, collection } from "firebase/firestore";
import Constants from "../Constants";
import Store from "../Store";
const AddStudentPage = ({ history }) => {
  const [studentName, changeStudentName] = React.useState("");
  const [studentNames, changeStudentNames] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [selectedName, changeSelectedName] = React.useState("");
  const db = getFirestore();
  const attachLatestRoleNumber = () => {
    let rollNumber = 1;
    const newArr = studentNames.map((name) => {
      return `${name}-${rollNumber++}`;
    });
    return newArr;
  };
  const redirectToStudents = () => {
    history.push("/students");
  };
  const onAddButtonClicked = () => {
    const newStudentNames = [...studentNames];
    newStudentNames.push(studentName);
    changeStudentNames(newStudentNames);
    changeStudentName("");
  };
  const onItemClicked = ({ target }) => {
    console.log("onItemClicked");
    console.log(target);
    console.log("target.id :>> ", target.id);
    changeSelectedName(target.id);
    console.log(selectedName);
    setTitle(`Remove ${target.id} from List`);
    setBody(`The student name ${target.id} will be removed from this list`);
    setShowModal(true);
  };
  const onClickSaveStudentNames = async () => {
    addNamesToClass().then(() => {
      makeStudentsSubCollection().then(redirectToStudents());
    });
  };
  const addNamesToClass = async () => {
    const dataToSend = {
      names: attachLatestRoleNumber(),
    };

    const promise = await setDoc(
      doc(db, `${Constants.CLASSES_COLLECTION_PATH}/${Store.classId}`),
      dataToSend
    );
    return promise;
  };
  const makeStudentsSubCollection = async () => {
    const dataToBeSent = {};
    dataToBeSent[Store.term] = {
      dates_present: [],
      dates_absent: [],
    };
    const studentsCollectionRef = collection(
      db,
      `${Constants.CLASSES_COLLECTION_PATH}/${Store.classId}/${Constants.STUDENTS_COLLECTION_PATH}`
    );
    attachLatestRoleNumber().forEach(async (id) => {
      await setDoc(doc(db, studentsCollectionRef.path, id), dataToBeSent);
    });
  };

  const onRemoveStudentName = () => {
    changeStudentNames(
      [...studentNames].filter((name) => name !== selectedName)
    );
    console.log("studentNames :>> ", studentNames);
    setShowModal(false);
  };
  return (
    <div className="h-screen w-full">
      <div>
        <div className="mb-3 pt-0 flex justify-center">
          <input
            value={studentName}
            onChange={(event) => {
              event.preventDefault();
              changeStudentName(event.target.value);
            }}
            type="text"
            style={{ borderColor: "#b50921" }}
            placeholder="Enter Student Name"
            className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border  outline-none focus:outline-none focus:ring w-full"
          />
          <AddButton
            disabled={studentName.length === 0 ? true : false}
            onClick={onAddButtonClicked}
          />
        </div>
        <AccentButton
          name="Save Student name"
          onClick={onClickSaveStudentNames}
          disabled={studentNames.length === 0 ? true : false}
        />
        <ListView values={studentNames} onItemClicked={onItemClicked} />
        {showModal && (
          <ActionModal
            title={title}
            body={body}
            showModal={showModal}
            setShowModal={setShowModal}
            onClickEnter={onRemoveStudentName}
          />
        )}
      </div>
    </div>
  );
};

export default AddStudentPage;
