import { createTheme } from "@mui/material/styles";

// Create a custom theme
const theme = createTheme({
  palette: {
    success: {
      main: "#00B517",
      dark: "#00a315",
    },
    primary: {
      main: "#0D6EFD",
      dark: "#1565C0",
    },
    error: {
      main: "#FF1654",
      dark: "#E64A19",
    },

    orderStatus: {
      PENDING: "#E5F1FF",
      PROCESSING: "#fffee8",
      COMPLETED: "#C3FFCB",
      CANCELLED: "#ffe8ee",
      SHIPPING: "#FFE5BF",
    },
  },
});

export default theme;
