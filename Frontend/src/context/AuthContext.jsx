import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authApi from "../api/authApi";
import { resetCart } from "../store/CartSlice/CartSlice";
import { useDispatch } from "react-redux";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  // const [user, setUser] = useState(null);

  // // Load user from token on app startup
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       try {
  //         // Validate token or fetch user info using token
  //         const response = await authApi.getInfo();
  //         setUser(response.data);
  //       } catch (error) {
  //         console.error("Failed to fetch user info", error);
  //         localStorage.removeItem("token"); // Clear invalid token
  //         setUser(null);
  //       }
  //     }
  //   };

  //   fetchUser();
  // }, []);

  // Fetch the authenticated user's information
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const token = localStorage.getItem("token"); // Check for token
      if (!token) {
        return null; // If no token, return null
      }
      try {
        const response = await authApi.getInfo();
        //console.log(response.data);
        return response.data.data;
      } catch (error) {
        console.error("Failed to fetch user info", error);
        localStorage.removeItem("token"); // Clear invalid token
        return null;
      }
    },
    enabled: !!localStorage.getItem("token"), // Enable query only if token exists
    retry: false,
    staleTime: Infinity,
    onError: () => {
      queryClient.setQueryData(["authUser"], null); // Reset user data on error
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: async ({ username, email, password, fullname }) => {
      const response = await authApi.register({
        username,
        password,
        email,
        fullname,
      });
      return response.data;
    },
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await authApi.login({ username, password });
      return response.data;
    },
    onSuccess: (response) => {
      const user = response.data;
      const token = user.accessToken;
      console.log(user);
      queryClient.setQueryData(["authUser"], user);
      localStorage.setItem("token", token);
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null); // Clear user data on logout
      localStorage.removeItem("token");
      dispatch(resetCart());
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const response = await authApi.updateUser(updatedData);
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["authUser"], updatedUser);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        update: updateMutation.mutate,
        register: registerMutation.mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
