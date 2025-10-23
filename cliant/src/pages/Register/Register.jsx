import axiosInstance from "../../Axios/axiosConfig";
import styles from "./Register.module.css";
import { ClipLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputData, setinputData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setinputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };
  //handle on submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(username);
    setError("");
    setSuccessMessage("");
    setLoading(true);

    // main validation
    
    if (
      !inputData.username ||
      !inputData.firstname ||
      !inputData.lastname ||
      !inputData.email ||
      !inputData.password
    ) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    // Email validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    try {
      const response = await axiosInstance.post("/user/register", inputData);
      setSuccessMessage(response.data.msg);
      // Reset form after successful registration
      setinputData({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      });
      navigate("/login");
    } catch (error) {
      setError(
        error.response ? error.response.data.msg : "Something went wrong!"
      );
    }

    setLoading(false);
  };

  return (
    <>
      <section className={styles.registerContainer}>
        <div className={styles.leftwrapper}>
          <div className={styles.formContainer}>
            <h1>Join The Network</h1>
            <h3 style={{ textAlign: "center" }}>
              Already have an account? <Link to={"/login"}>Sign in</Link>
            </h3>
            <form onSubmit={handleSubmit} className={styles.formcontainer}>
              <div className={styles.inputGroup}>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={inputData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "2rem" }}>
                <div className={styles.inputGroup}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={inputData.firstname}
                    onChange={handleChange}
                    required
                  />
                 
                </div>
                <div className={styles.inputGroup}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={inputData.lastname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={inputData.email}
                  onChange={handleChange}
                  required
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
                  required
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}
              {successMessage && (
                <div className={styles.success}>{successMessage}</div>
              )}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ClipLoader size={20} color="#36d7b7" /> Registering...
                  </>
                ) : (
                  "Agree and Join"
                )}
              </button>
            </form>
            <div className={styles.formFooter}>
              <h3 className={styles.terms}>
                I agree to the{" "}
                <Link
                  to="https://www.evangadi.com/legal/privacy/"
                  target="_blank"
                  className={styles.link}
                >
                  privacy policy
                </Link>{" "}
                and{" "}
                <Link
                  to="https://www.evangadi.com/legal/terms/"
                  target="_blank"
                  className={styles.link}
                >
                  terms of service.
                </Link>
              </h3>
              <h3 className={styles.loginLink}>
                <Link to="/login" className={styles.link}>
                  Already have an account?
                </Link>
              </h3>
            </div>
          </div>
        </div>
        {/* about and image  */}

        <div className={styles.rightWrapper}>
          {/* <Link to="#" style={{ marginLeft: "-400px" }}>
            about
          </Link> */}
          <div className={styles.textContainer}>
            <h1>Evangadi Networks Q&A</h1>
          </div>
          <h4>
            If you’d like to join the Evangadi network and submit questions,
            please create an account and sign in to begin building your network.
          </h4>
        </div>
      </section>
    </>
  );
};

export default Register;
