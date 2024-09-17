import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import { resetCart } from "../store/CartSlice/CartSlice";
import { useDispatch } from "react-redux";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authApi.getInfo();
          //console.log("fetch user auth context: ", response);
          const user = response.data.data;
          setUser(user);
          navigate(user.isAdmin ? "/admin" : "/");
        } catch (error) {
          console.error("Failed to fetch user info", error);
          localStorage.removeItem("token");
          setUser(null);
          navigate("/login");
        }
      } else {
        navigate("/");
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const login = async ({ username, password }) => {
    try {
      const response = await authApi.login({ username, password });
      //console.log(response);
      const token = response.data.data.accessToken;
      localStorage.setItem("token", token);
      const userInfo = response.data.data;
      setUser(userInfo);
      navigate(userInfo.isAdmin ? "/admin" : "/");
      return response;
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem("token");
      setUser(null);
      dispatch(resetCart());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const update = async (updatedData) => {
    try {
      const response = await authApi.updateUser(updatedData);
      setUser(response.data.data);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const register = async ({ username, email, password, fullname }) => {
    try {
      const response = await authApi.register({
        username,
        email,
        password,
        fullname,
      });
      return response.data;
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        update,
        register,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
