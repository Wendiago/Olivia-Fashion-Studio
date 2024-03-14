import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@mui/material";
import theme from "./utils/MuiTheme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1039561132595-ss2t58rmq07enipco9vn8196dam5fph9.apps.googleusercontent.com">
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
