import { arrayUnion, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import InputField from "../inputs/InputField";
import Constants from "../../Constants";
import { classCodesDoc, validateNewClass } from "../../Firebase";
import Modal from "./Modal";
import PassCodeInput from "../inputs/PassCodeInput";
import ShowPasswordIcon from "../icons/ShowPassWordIcon";
import { useAlert } from "react-alert";
import Spinner from "../Spinner";
function AddClassModal({ showModal, setShowModal,classList }) {
  const [newClassName, setNewClassName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showSpinner, setShowSpinner] = React.useState(false);
  const alert = useAlert();
  const onPassNewCodeValueChange = (value) => setNewPassword(value);
  const onEnter = async () => {
    const classCodesSnapshot=await getDoc(classCodesDoc);
    if (newClassName.length != 0 && newPassword.length != 0) {
      setShowSpinner(true)
      if(validateNewClass(classCodesSnapshot,newPassword,newClassName)){
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
        alert.success(`${newClassName} has been added to the classes`)
      }
      else{
        alert.error("Either Class Name or Pass Code already exists");
      }
      setShowSpinner(false)
      setShowModal(false)
      
    } else {
      alert.error("Input field are empty");
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
        <Spinner enabled={showSpinner}/>
      </div>
    </Modal>
  );
}

export default AddClassModal;
