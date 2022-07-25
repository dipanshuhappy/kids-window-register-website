import React, { useEffect, useState } from "react";
import AccentButton from "../components/buttons/AccentButton";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  updateDoc,
  setDoc,
  runTransaction,
  getDocs,
  writeBatch,
  deleteField,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import Constants from "../Constants";
import Store from "../Store";
import {
  auth,
  adminDoc,
  classesCollection,
  getTermCollection,
  getStudentsSubCollection,
  db,
  classCodesDoc,
} from "../Firebase";
import InputField from "../components/inputs/InputField";
import ChangePassCodeModal from "../components/modals/ChangePassCodeModal";
import AddClassModal from "../components/modals/AddClassModal";
import { useAlert } from "react-alert";
import Spinner from "../components/Spinner";
const AdminPage = ({history}) => {
  const [admin, setAdmin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nextTermToBe, setNextTermToBe] = useState("");
  const [classList, setClassList] = useState([]);
  const [showChangePassCodeModal, setChangePassCodeShowModal] = useState(false);
  const [showAddClassModal, setAddClassShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const currentDateTimeStamp = Timestamp.fromDate(new Date());
  const alert = useAlert();

  const getNextTerm = () => {
    console.log("Store +>", Store.term);
    const index_of_current_term = Constants.TERMS.indexOf(Store.term);
    if (index_of_current_term === Constants.TERMS.length - 1) {
      return Constants.TERMS[0];
    }
    return Constants.TERMS[index_of_current_term + 1];
  };
  const gotoHome=()=>{history.push("/")}
  const onSignInClick = async () => {
    let user;
    try {
      const userCreds = await signInWithEmailAndPassword(auth, email, password);
      user = userCreds.user;
    } catch (error) {
      alert.error("Wrong Credentials");
    }
    setShowSpinner(true);
    try {
      await setTerm();
      await setClassListFromDatabase();
      setNextTermToBe(getNextTerm());
      setAdmin(user.uid);
      alert.success("Logged In");
    } catch (error) {
      alert.error("Could Not Sign In , try again later");
    }
    setShowSpinner(false);
  };
  async function setTerm() {
    const adminSnapShot = await getDoc(adminDoc);
    Store.term = adminSnapShot.data().term;
  }
  const setClassListFromDatabase = async () => {
    const newClassList = await (await getDoc(classCodesDoc)).data()[
      Constants.CLASS_LIST_FIELD_NAME
    ];
    setClassList(newClassList);
  };
  const onChangeTermClick = async () => {
    if (nextTermToBe === Constants.TERMS[0]) {
      alert.error("Start a new academic session to set term to first term ");
    } else {
      setShowSpinner(true);
      const data = { term: nextTermToBe };
      try {
        await setDoc(adminDoc, data, { merge: true });
        await setTerm()
        setNextTermToBe(getNextTerm())
        alert.success(`Term Changed to ${nextTermToBe}`);
      } catch (error) {
        alert.error("Could Not Change Term ,try again later");
      }
      setShowSpinner(false);
    }
  };
  const onChangeAcademicTermClick = async () => {
    if (!Store.term.startsWith(Constants.TERMS[Constants.TERMS.length - 1])) {
      alert.error("You need to be in Thrid term to start");
    } else {
      setShowSpinner(true);
      try {
        await changeAcademicYear();
        alert.success("New Academic Year has Started at ");
      } catch (error) {
        alert.error("Could Not Change Academic  Year  ,try again later");
      }
      setShowSpinner(false);
    }
  };
  const changeAcademicYear = async () => {
    await updateDoc(adminDoc, {
      term: "first_term",
      [Constants.ACADEMIC_YEAR_START_DATE_FIELD]: currentDateTimeStamp,
    });
    Constants.TERMS.forEach(async (term) => {
      await deleteTerm(getTermCollection(term));
    });
    await deleteStudentSubCollection();
  };
  const deleteTerm = async (termCollection) => {
    const termBatch = writeBatch(db);
    const termDateSnapshots = await getDocs(termCollection);
    termDateSnapshots.forEach((termDateDoc) => {
      if (termDateDoc.exists()) {
        termBatch.delete(termDateDoc.ref);
      }
    });
    await termBatch.commit();
  };
  const deleteStudentSubCollection = async () => {
    const classesDocSnapshots = await getDocs(classesCollection);
    classesDocSnapshots.forEach(async (classDoc) => {
      const emptyStudentArray = {};
      emptyStudentArray[Constants.STUDENT_NAMES_ARRAY_FIELD_NAME] =
        deleteField();
      await updateDoc(classDoc.ref, emptyStudentArray);
      const studentSubCollectionSnapshots = await getDocs(
        getStudentsSubCollection(classDoc.id)
      );
      studentSubCollectionSnapshots.forEach(async (studentDoc) => {
        await deleteDoc(studentDoc.ref);
      });
    });
  };
  const onChangeClassCodeClick = () => {
    setChangePassCodeShowModal(true);
  };
  const onAddClassClick = () => {
    setAddClassShowModal(true);
  };
  return (
    <div className="h-screen w-full">
      <div className="w-full colorAccent">
        <AccentButton onClick={gotoHome} name="Goto Home" />
      </div>
      {!admin ? (
        <div className="colorAccent  m-32 p-8 rounded-2xl drop-shadow-md">
          <div className="mb-4">
            <InputField
              label="Email"
              onChange={(event) => setEmail(event.target.value)}
              htmlFor="email"
              placeholder="Email"
              type="text"
            />
          </div>
          <div className="mb-6">
            <InputField
              label="Password"
              htmlFor="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="*********************"
              type="password"
              value={password}
            />
            <p className="text-red text-xs italic">Enter a password.</p>
            <Spinner enabled={showSpinner} />
            <div className="flex items-center justify-between">
              <button
                className="mt-5 bg-gray-200 text-black hover:bg-blue-dark font-bold py-2 px-4 rounded"
                type="button"
                onClick={onSignInClick}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <AccentButton
            style={{ marginTop: "16px" }}
            name={`Change to ${nextTermToBe.replace("_", " ")} `}
            onClick={onChangeTermClick}
          />
          <AccentButton
            style={{ marginTop: "16px" }}
            name="start new academic year"
            onClick={onChangeAcademicTermClick}
          />
          <AccentButton
            style={{ marginTop: "16px" }}
            name="Change class code"
            onClick={onChangeClassCodeClick}
          />
          <AccentButton
            style={{ marginTop: "16px" }}
            name="Add Class"
            onClick={onAddClassClick}
          />
          <Spinner enabled={showSpinner} />
          <ChangePassCodeModal
            classList={classList}
            setShowModal={setChangePassCodeShowModal}
            showModal={showChangePassCodeModal}
          />
          <AddClassModal
            setShowModal={setAddClassShowModal}
            showModal={showAddClassModal}
          />
        </>
      )}
    </div>
  );
};

export default AdminPage;
