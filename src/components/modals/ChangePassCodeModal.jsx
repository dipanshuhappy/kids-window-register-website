import React from "react";
import DropDown from "../inputs/DropDown";
import PassCodeInput from "../PassCodeInput";
import ShowPasswordIcon from "../ShowPassWordIcon";
import Modal from "./Modal";
import { deleteField, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { classCodesDoc, validateLogin } from "../../Firebase";
function ChangePassCodeModal({showModal,setShowModal,classList}) {
  const [className, setClassName] = React.useState("No Class Selected");
  const [oldPassword, setPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const onDropItemClick = (value) => setClassName(value);
  const onPassCodeValueChange = (value) => setPassword(value);
  const onPassNewCodeValueChange = (value)=> setNewPassword(value);
  const onSubmit =async ()=>{
    const classCodeDoc = await getDoc(classCodesDoc);
    if(validateLogin(classCodeDoc,oldPassword) && newPassword.length!=0 && classCodeDoc.data()[oldPassword]==className){
     await updateDoc(
        classCodesDoc,{
          [oldPassword]:deleteField()
        }
      );
      const newPasswordData={};
      newPasswordData[newPassword]=className;
      await setDoc(
        classCodesDoc,
        newPasswordData,{merge:true}
      )
      setShowModal(false)
    }
    else{
      alert("Wrong passcode")
    }
  }
  return (
    <>
      <Modal
        setShowModal={setShowModal}
        title={"Enter Class Code"}
        showModal={showModal}
        onEnter={onSubmit}
      >
        <div className="flex gap-5 flex-col">
          <div className="grid place-items-center">
            <p>Select Class Name</p>
            <kbd className="px-2 py-3 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              {className}
            </kbd>
            <DropDown
              list={classList}
              title="Select Class"
              onItemCLick={onDropItemClick}
            />
          </div>
          <p>Enter Current Password</p>
          <PassCodeInput
            value={oldPassword}
            maxLength={5}
            valueChangedHandler={onPassCodeValueChange}
            icon={ShowPasswordIcon}
            iconAsButton
          />
          <p>Enter New Password</p>
           <PassCodeInput
            value={newPassword}
            maxLength={5}
            valueChangedHandler={onPassNewCodeValueChange}
            icon={ShowPasswordIcon}
            iconAsButton
          />
        </div>
      </Modal>
    </>
  );
}

export default ChangePassCodeModal;
