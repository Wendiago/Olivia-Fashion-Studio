import { useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const LoginSuccess = () => {
  const { userId } = useParams();
  const { login } = useAuth();
  console.log(userId);
  const navigate = useNavigate();

  useEffect(() => {
    const user = {
      userId: userId,
    };
    const fetchToken = async () => {
      let response = await axios.post(
        "https://localhost:8000/api/auth/login-success",
        user,
        { withCredentials: true }
      );
      console.log(response);

      if (response.data.success) {
        console.log(response.data.user.isAdmin);
        if (response.data.user.isAdmin === true) {
          login(response.data.user, response.data.jwt);
          navigate("/admin");
        } else {
          login(response.data.user, response.data.jwt);
          navigate("/");
        }
      }
    };
    fetchToken();
  }, [userId]);
};

export default LoginSuccess;
