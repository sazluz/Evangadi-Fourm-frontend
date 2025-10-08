import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserProvide.jsx";
import { QuestionProvider } from "./context/QuestionProvide.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <QuestionProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QuestionProvider>
    </UserProvider>
  </StrictMode>
);
