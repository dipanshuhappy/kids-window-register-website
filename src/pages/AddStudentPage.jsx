import React from "react";
import AccentButton from "../components/AccentButton";
import ActionModal from "../components/ActionModal";
import AddButton from "../components/AddButton";
import ListView from "../components/ListView";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import Store from "../Store";
import { useAlert } from "react-alert";
import { getClassDoc, getStudentsSubCollection } from "../Firebase";
import Spinner from "../components/Spinner";
const AddStudentPage = ({ history }) => {
  const [studentName, changeStudentName] = React.useState("");
  const [studentNames, changeStudentNames] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [selectedName, changeSelectedName] = React.useState("");
  const [showSpinner,setShowSpinner]=React.useState(false);
  const db = getFirestore();
  const alert = useAlert();
  const attachLatestRoleNumber = () => {
    let rollNumber = 1;
    const newArr = studentNames.map((name) => {
      return `${name}-${rollNumber++}`;
    });
    return newArr;
  };
  const redirectToStudents = () => {
    setShowSpinner(false)
    history.push("/students");
  };
  const onAddButtonClicked = () => {
      if(studentName.trim().length===0){
        alert.error("Student name is empty")  
    }
    else{
    const newStudentNames = [...studentNames];
    newStudentNames.push(studentName);
    changeStudentNames(newStudentNames);
    changeStudentName("");
    }
  };
  const onItemClicked = ({ target }) => {
    changeSelectedName(target.id);
    console.log(selectedName);
    setTitle(`Remove ${target.id} from List`);
    setBody(`The student name ${target.id} will be removed from this list`);
    setShowModal(true);
  };
  const onClickSaveStudentNames = async () => {
    setShowSpinner(true);
    await addNamesToClass();
    await  makeStudentsSubCollection();
    redirectToStudents()
  };
  const addNamesToClass = async () => {
    const dataToSend = {
      names: attachLatestRoleNumber(),
    };
    await setDoc(
      getClassDoc(Store.classId),
      dataToSend
    );
  };
  const makeStudentsSubCollection = async () => {
    const dataToBeSent = {};
    dataToBeSent[Store.term] = {
      dates_present: [],
      dates_absent: [],
    };
    attachLatestRoleNumber().forEach(async (name) => {
      await setDoc(doc(db, getStudentsSubCollection(Store.classId).path, name), dataToBeSent);
    });
  };

  const onRemoveStudentName = () => {
    changeStudentNames(
      [...studentNames].filter((name) => name !== selectedName)
    );
    console.log("studentNames :>> ", studentNames);
    setShowModal(false);
    alert.success(`Removed ${selectedName} From List`)
  };
  return (
    <div className="h-full w-full">
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
        <Spinner enabled={showSpinner}/>
        <AccentButton
          name="Save Student name"
          onClick={onClickSaveStudentNames}
          disabled={studentNames.length === 0 ? true : false}
        />
        <p className="text-center font-bold text-lg m-4">Click on the Student to remove it from the list </p>
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
