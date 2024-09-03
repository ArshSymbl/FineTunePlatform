import { StyledEngineProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StyledEngineProvider injectFirst>
    <BrowserRouter>
      <SnackbarProvider anchorOrigin={{ horizontal: "right", vertical: "top" }}>
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </StyledEngineProvider>
);
