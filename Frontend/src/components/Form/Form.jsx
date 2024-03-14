import { useNavigate } from "react-router-dom";
import { Loading, Login, Register, Footer } from "../../components";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import { useState } from "react";
import { Logo } from "../../assets/icons";
const typeForm = {
  login: Login,
  register: Register,
};

const Form = ({ type = "login" }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const Element = typeForm[type];
  const navigate = useNavigate();

  const closeModal = () => setOpen(false);

  return (
    <main className="w-full min-h-[100vh] flex flex-col items-center">
      <div className="Header flex items-center max-w-[1200px] w-[1200px] max-h-[84px] py-[12px] gap-x-[24px]">
        <Logo
          className="h-[84px] w-auto cursor-pointer"
          onClick={() => {
            navigate(`/`);
          }}
        />
        <p className="font-body text-2xl">
          {type === "login" ? "Log In" : "Register"}
        </p>
      </div>
      <div className="Form-section flex-1 bg-grey-100 w-full flex items-center justify-center">
        <div className="w-[70%] grid grid-cols-2 self-center justify-items-center">
          <div className="intro flex flex-col">
            <Logo />
          </div>
          <div className="form flex items-center">
            <Element />
          </div>
        </div>
      </div>
      <Footer />
      <Popup
        open={open}
        closeOnDocumentClick
        onClose={closeModal}
        contentStyle={{
          backgroundColor: "#050214",
          width: "30%",
        }}
      >
        <div className="bg-form flex py-2">
          <h1 className="text-white m-auto text-sm">{content}</h1>
        </div>
      </Popup>
      {loading && <Loading />}
    </main>
  );
};

Form.propTypes = {
  type: PropTypes.string,
};

export default Form;
