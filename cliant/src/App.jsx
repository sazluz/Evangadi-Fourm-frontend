import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/UserProvide";
import { useNavigate } from "react-router-dom";
import isTokenExpired from "./utils/tokenUtils";
import ProtectedRoute from "./context/ProtectedRoute";
import LandingPage from "./pages/LandingPage/LandingPage";
import HowItWorks from "./pages/HowitWorks/HowItWorks";
import ContactUs from "./pages/ContactUs/ContactUs";
import EditQuestion from "./pages/EditQuestion/EditQuestion";
import AskQuestion from "./pages/Askquestion/AskQuestion";
import SingleQuestion from "./pages/SingleQuestion/SingleQuestion";
import SharedComponent from "./components/SharedComponent/SharedComponent";
import AskAi from "./pages/AskGpt/AskAi";

function App() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  //check if the user is here or not
  async function checkUser() {
    // Remove expired token
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      setUser(null);
      // Redirect to login
      navigate("/login");
      return;
    }

    try {
      const { data } = await axiosInstance.get("/user/checkUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(data.msg);
      setUser({ username: data.username, userid: data.userid });
    } catch (error) {
      setUser(null);
      setError("Failed to authenticate. Please log in again.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }
  //check the effect
  useEffect(() => {
    if (token) {
      checkUser();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<SharedComponent />}>
          <Route
            path="/"
            element={token ? <Navigate to="/home" /> : <LandingPage />}
          />
          <Route
            path="/login"
            element={token ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/home" /> : <Register />}
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<ContactUs />} />

          <Route
            path="/questions/question/:questionid"
            element={
              <ProtectedRoute>
                <EditQuestion />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ask"
            element={
              <ProtectedRoute>
                <AskQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions/:questionid"
            element={
              <ProtectedRoute>
                <SingleQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatgpt"
            element={
              <ProtectedRoute>
                <AskAi />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
