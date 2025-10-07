import { Route, Routes,Navigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/UserProvide";
import { useNavigate } from "react-router-dom";
import isTokenExpired from "./utils/tokenUtils";
import Header from "./components/Header/Header"
import ProtectedRoute from "./context/ProtectedRoute"
import LandingPage from "./pages/LandingPage/LandingPage"
import Footer from "./components/Footer/Footer"
import HowItWorks from "./pages/HowItWorks/HowItWorks"

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
    <Header/>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
         <Route path="/home" element={
          <ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="how-it-works" element={<HowItWorks/>}/>
        <Route path="/login" element={ <Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
