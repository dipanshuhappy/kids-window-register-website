import { arrayUnion, setDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import InputField from "../components/InputField";
import Constants from "../Constants";
import { classCodesDoc } from "../Firebase";
import Modal from "./Modal";
import PassCodeInput from "./PassCodeInput";
import ShowPasswordIcon from "./ShowPassWordIcon";

function AddClassModal({ showModal, setShowModal }) {
  const [newClassName, setNewClassName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const onPassNewCodeValueChange = (value) => setNewPassword(value);
  const onEnter = async () => {
    if (newClassName.length != 0 && newPassword.length != 0) {
      await setDoc(
        classCodesDoc,
        { [newPassword]: newClassName.replaceAll(" ", "_") },

        {
          merge: true,
        }
      );
      await updateDoc(classCodesDoc, {
        [Constants.CLASS_LIST_FIELD_NAME]: arrayUnion(newClassName),
      });
    } else {
      alert("Input field are empty");
    }
  };
  return (
    <Modal
      setShowModal={setShowModal}
      title={"Enter New Class Namd And Password"}
      showModal={showModal}
      onEnter={onEnter}
    >
      <div className="flex gap-5 flex-col">
        <InputField
          label="New Class Name "
          onChange={(event) => setNewClassName(event.target.value)}
          htmlFor="text"
          placeholder="Class Name"
          type="text"
          value={newClassName}
        />
        <p>Enter Password</p>
        <PassCodeInput
          value={newPassword}
          maxLength={5}
          valueChangedHandler={onPassNewCodeValueChange}
          icon={ShowPasswordIcon}
          iconAsButton
        />
      </div>
    </Modal>
  );
}

export default AddClassModal;
