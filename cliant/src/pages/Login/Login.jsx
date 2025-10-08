import React, { useState, useContext } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvide"; // Import UserContext
import axiosInstance from "../../Axios/axiosConfig";
import { ClipLoader } from "react-spinners";

function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  //input form data
  const [inputData, setinputData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setinputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };

 // handle on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!inputData.email || !inputData.password) {
      setError("Both fields are required!");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post("/user/login", inputData);

      setSuccessMessage(data.msg);

      // ✅ Assume backend sends:
      // data = { msg, token, user: { userid, username, email } }

      const userData = {
        userid: data.user.userid,
        username: data.user.username,
        token: data.token,
      };

      // ✅ Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);

      // ✅ Update context properly
      setUser(userData);

      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.msg || "Something went wrong! Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setSuccessMessage("");
  //   setLoading(true);

  //   if (!inputData.email || !inputData.password) {
  //     setError("Both fields are required!");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const { data } = await axiosInstance.post("/user/login", inputData);
  //     // console.log(response.data.msg);
  //     setSuccessMessage(data.msg);
  //     //put the value of the token to local storage
  //     localStorage.setItem("token", data.token);
  //     setUser({ token: data?.token, user: data?.user.username }); // Update the UserContext
  //     // console.log(data);

  //     navigate("/home");
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     setError(error.data?.msg || "Something went wrong! Please try again.");
  //   }
  //   setLoading(false);
  // };
  // console.log(user);

  return (
    <section className={styles.loginContainer}>
      <div className={styles.leftWrapper}>
        <div className={styles.formContainer}>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={inputData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={inputData.password}
                onChange={handleChange}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {successMessage && (
              <div className={styles.success}>{successMessage}</div>
            )}

            {/* <h3 className={styles.forgot__password}>
              <Link to="/forget-password">Forgot your password?</Link>
            </h3> */}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ClipLoader size={20} color="#36d7b7" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <h3 className={styles.registerLink}>
            Don't have an account?{" "}
            <Link
              className={styles["text-pr"]}
              style={{ color: "orange" }}
              to="/register"
            >
              Sign up
            </Link>
          </h3>
        </div>
      </div>
      <div className={styles.rightWrapperLogin}>
        <div className={styles.overridephoto}>
          <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 40C25.4247 40 40 25.4247 40 0C40 25.4247 54.5753 40 80 40C54.5753 40 40 54.5753 40 80C40 54.5753 25.4247 40 0 40Z"
              fill="#F39228"
            ></path>
          </svg>
          <div className={styles.textContainer}>
            <h1>
              <span>5 Stage</span> Unique Learning Method
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
