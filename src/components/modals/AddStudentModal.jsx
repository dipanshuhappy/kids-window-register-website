import React from "react";
import Modal from "./Modal";
import InputField from "../inputs/InputField";
const AddModal = ({ title, showModal, setShowModal, addStudents }) => {
  const [studentName, changeStudentName] = React.useState("");
  const onClickEnter = () => {
    addStudents(studentName);
    setShowModal(false)
  };
  return (
    <div>
      <Modal
      setShowModal={setShowModal}
      title={"Add A New Student"}
      showModal={showModal}
      onEnter={onClickEnter}
    >
      <div className="flex gap-5 flex-col" style={{ borderColor: "#b50921" }}>
        <InputField
          label="New Student Name"
          onChange={(event) =>changeStudentName(event.target.value)}
          htmlFor="text"
          placeholder="Student name"
          type="text"
          value={studentName}
        />
      </div>
    </Modal>
    </div>
  );
};

export default AddModal;
