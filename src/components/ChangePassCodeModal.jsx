import React from "react";
import DropDown from "./DropDown";
import PassCodeInput from "./PassCodeInput";
import ShowPasswordIcon from "./ShowPassWordIcon";
import Modal from "./Modal";
function ChangePassCodeModal({showModal,setShowModal}) {
  const [className, setClassName] = React.useState("No Class Selected");
  const [password, setPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const onDropItemClick = (value) => setClassName(value);
  const onPassCodeValueChange = (value) => setPassword(value);
  const onPassNewCodeValueChange = (value)=> setNewPassword(value);

  return (
    <>
      <Modal
        setShowModal={setShowModal}
        title={"Enter Class Code"}
        showModal={showModal}
      >
        <div className="flex gap-5 flex-col">
          <div className="grid place-items-center">
            <p>Select Class Name</p>
            <kbd className="px-2 py-3 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              {className}
            </kbd>
            <DropDown
              list={["JSS1A", "JDLsf", "JSS1A", "JSS1A", "JSS1A"]}
              title="Select Class"
              onItemCLick={onDropItemClick}
            />
          </div>
          <p>Enter Current Password</p>
          <PassCodeInput
            value={password}
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
        <show></show>
      </Modal>
    </>
  );
}

export default ChangePassCodeModal;
