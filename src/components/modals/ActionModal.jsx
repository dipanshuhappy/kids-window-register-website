import React from "react";
const ActionModal = ({
  title,
  body,
  showModal,
  setShowModal,
  onClickEnter,
}) => {
  return (
    <div>
       <Modal onEnter={onClickEnter} setShowModal={setShowModal} title={title}  showModal={showModal}>
        <p>{body}</p>
        </Modal>
    </div>
  );
};

export default ActionModal;
