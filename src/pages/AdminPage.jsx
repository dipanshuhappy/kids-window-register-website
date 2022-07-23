import React, { useEffect, useState } from "react";
import AccentButton from "./../components/AccentButton";
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
import { auth ,adminDoc,classesCollection} from "../Firebase";

const AdminPage = () => {
  const [admin, setAdmin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nextTermToBe, setNextTermToBe] = useState("");
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
    try{
     const userCreds  = await signInWithEmailAndPassword(auth,email,password);
     user=userCreds.user;
    }
    catch (error) {
      const errorCode = error.code;
      alert("Can't sign in , errorCode ", errorCode);
    }
    await setTerm()
    setNextTermToBe(getNextTerm())
    setAdmin(user.uid)
  
  };
  async function setTerm() {
    const adminSnapShot = await getDoc(adminDoc);
    Store.term = adminSnapShot.data().term;
  }
  const onChangeTermClick = async () => {
    const newAdminDoc = doc(
      db,
      Constants.ADMIN_COLLECTION_PATH,
      Constants.TERM_INFO_DOCUMENT_NAME
    );
    const data = { term: nextTermToBe };
    console.log("user::>", admin);
    setDoc(adminDoc, data, { merge: true });
  };
  const onChangeAcademicTermClick = async () => {
    if (Store.term.startsWith("first") || Store.term.startsWith("second")) {
      alert("You need to be in Thrid term to start");
    } else {
      const batch1 = writeBatch(db);
      const datesDoc = collection(db, Store.term);
      await runTransaction(db, async (transaction) => {
        transaction.update(adminDoc, { term: "first_term" });
        const datesSnapshots = await getDocs(datesDoc);
        datesSnapshots.forEach((dateDoc) => {
          console.log("INside deleteing date doc", dateDoc.id);
          batch1.delete(dateDoc.ref);
        });
      })
        .then(() => {
          batch1.commit();
          deleteOtherTerms();
        })
        .then(() => {
          deleteStudentSubCollection();
        });
    }
  };
  const deleteStudentSubCollection = () => {
    getDocs(classesCollection).then((documents) => {
      documents.forEach(async (studentDoc) => {
        const emptyStudentArray = {};
        emptyStudentArray[Constants.STUDENT_NAMES_ARRAY_FIELD_NAME] =
          deleteField();
        await updateDoc(studentDoc.ref, emptyStudentArray);
        getDocs(
          collection(
            db,
            Constants.CLASSES_COLLECTION_PATH,
            studentDoc.id,
            Constants.STUDENTS_COLLECTION_PATH
          )
        ).then((snapshots) => {
          snapshots.forEach((snapshot) => {
            deleteDoc(snapshot.ref);
          });
        });
      });
    });
  };
  const deleteOtherTerms = () => {
    const batch2 = writeBatch(db);
    const batch3 = writeBatch(db);
    const firstTermDates = collection(db, Constants.TERMS[0]);
    const secondTermDates = collection(db, Constants.TERMS[1]);
    getDocs(firstTermDates)
      .then((dateDocuments) => {
        dateDocuments.forEach((dateDocument) => {
          if (dateDocument.exists()) {
            batch2.delete(dateDocument.ref);
          }
        });
      })
      .then(async () => {
        await batch2.commit();
        getDocs(secondTermDates)
          .then((dateDocuments) => {
            dateDocuments.forEach((dateDocument) => {
              if (dateDocument.exists()) {
                batch3.delete(dateDocument.ref);
              }
            });
          })
          .then(async () => {
            await batch3.commit();
          });
      });
  };
  const onChangeClassCodeClickClick = () => {
    console.log("onChangeClassCodeClickClick clicked");
  };
  return (
    <div className="h-screen w-full">
      <div className="w-full colorAccent">
        <AccentButton name="Goto Home" />
      </div>
      {!admin ? (
        <div className="colorAccent  m-32 p-8 rounded-2xl drop-shadow-md">
          <div className="mb-4">
            <label
              className=" block text-grey-darker text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              id="username"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-grey-darker text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
              id="password"
              type="password"
              placeholder="******************"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <p className="text-red text-xs italic">Enter a password.</p>
            <div className="flex items-center justify-between">
              <button
                className="mt-5 bg-blue-800 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded"
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
            onClick={onChangeClassCodeClickClick}
          />
        </>
      )}
    </div>
  );
};

export default AdminPage;
