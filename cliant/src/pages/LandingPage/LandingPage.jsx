import React from "react";
import classes from "./LandingPage.module.css";
import { Link } from "react-router-dom";
import LandingImage from "../../assets/images/Landingpage1.jpg"; // adjust path if needed

function LandingPage() {
  return (
    <div
      className={classes.background}
      style={{
        backgroundImage: `url(${LandingImage})`,
      }}
    >
      <div className={classes.textDiv}>
        <h2>
          Bypass the <br /> Industrial, <br /> Dive into the Digital!
        </h2>
        <p>
          Before us is a golden opportunity, demanding us to take a bold step
          forward and join the new digital era.
        </p>
        <div className={classes.linkDiv}>
          <Link className={classes.createAccount} to="/register">
            Create Account
          </Link>
          <Link className={classes.signIn} to="/login">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
