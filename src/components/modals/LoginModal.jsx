import React from "react";
import PassCodeInput from "../PassCodeInput";
import ShowPasswordIcon from "../ShowPassWordIcon";
import Modal from "./Modal";
const LoginModal = ({ className, value, valueChangedHandler, onSubmit }) => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className={className}>
      <>
        <button
          className="colorAccent mt-8 ml-auto mr-auto textColorPrimary font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Enter Class Code
        </button>
        <Modal onEnter={onSubmit} setShowModal={setShowModal} title={"Enter Class Code"} showModal={showModal} className={className}>
          <PassCodeInput
            value={value}
            maxLength={5}
            valueChangedHandler={valueChangedHandler}
            icon={ShowPasswordIcon}
            iconAsButton
          />
        </Modal>
      </>
    </div>
  );
};

export default LoginModal;
