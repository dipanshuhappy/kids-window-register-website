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
import AddClassModal  from "../components/modals/AddClassModal";
const AdminPage = () => {
  const [admin, setAdmin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nextTermToBe, setNextTermToBe] = useState("");
  const [classList,setClassList]=useState([]);
  const [showChangePassCodeModal,setChangePassCodeShowModal]=useState(false);
  const [showAddClassModal,setAddClassShowModal]=useState(false);
  const getNextTerm = () => {
    console.log("Store +>", Store.term);
    const index_of_current_term = Constants.TERMS.indexOf(Store.term);
    if (index_of_current_term === Constants.TERMS.length - 1) {
      return Constants.TERMS[0];
    }
    return Constants.TERMS[index_of_current_term + 1];
  };
  const onSignInClick = async () => {
    let user;
    try {
      const userCreds = await signInWithEmailAndPassword(auth, email, password);
      user = userCreds.user;
    } catch (error) {
      const errorCode = error.code;
      alert("Can't sign in , errorCode ", errorCode);
    }
    await setTerm();
    await setClassListFromDatabase();
    setNextTermToBe(getNextTerm());
    setAdmin(user.uid);
  };
  async function setTerm() {
    const adminSnapShot = await getDoc(adminDoc);
    Store.term = adminSnapShot.data().term;
  }
  const setClassListFromDatabase=async ()=>{
    const newClassList= await (await getDoc(classCodesDoc)).data()[Constants.CLASS_LIST_FIELD_NAME]
    setClassList(
     newClassList
    )
  }
  const onChangeTermClick = async () => {
    const data = { term: nextTermToBe };
    console.log("user::>", admin);
    await setDoc(adminDoc, data, { merge: true });
  };
  const onChangeAcademicTermClick = async () => {
    if (!Store.term.startsWith(Constants.TERMS[Constants.TERMS.length - 1])) {
      alert("You need to be in Thrid term to start");
    } else {
      await changeAcademicYear();
    }
  };
  const changeAcademicYear = async () => {
    await updateDoc(adminDoc, { term: "first_term" });
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
    setChangePassCodeShowModal(true)
  };
  const onAddClassClick = ()=>{
    setAddClassShowModal(true);
  }
  return (
    <div className="h-screen w-full">
      <div className="w-full colorAccent">
        <AccentButton name="Goto Home" />
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
          <ChangePassCodeModal classList={classList} setShowModal={setChangePassCodeShowModal} showModal={showChangePassCodeModal} />
          <AddClassModal setShowModal={setAddClassShowModal} showModal={showAddClassModal} />
        </>
      )}
    </div>
  );
};

export default AdminPage;
