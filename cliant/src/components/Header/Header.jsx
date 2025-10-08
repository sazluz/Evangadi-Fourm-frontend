import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserProvide";
import styles from "./Header.module.css";
import Logo from "../../assets/images/EvangadiLogo.png";
// Menu icon
import { FiMenu } from "react-icons/fi"; 

function Header() {
  const navigate = useNavigate();
  const location = useLocation()
  const {user, setUser} = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  // Retrieve token from localStorage
  const token = localStorage.getItem("token"); 

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleClick = () => {
    if (token) {
      navigate("/home");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <div className="scrolled"></div>
      <header className={styles.header}>
        <div onClick={handleClick}>
          <div className={styles.logo}>
            <img src={Logo} alt="Logo" className={styles.logoImage} />
          </div>
        </div>

        <div
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FiMenu size={35} />
        </div>

        <nav className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          <ul className={styles.navList}>
            <li>
              <Link
                to={token ? "/home" : "/"}
                className={styles.link}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/how-it-works"
                className={styles.link}
                onClick={() => setMenuOpen(false)}
              >
                How It Works
              </Link>
            </li>
            {token ? (
              <li>
                <button onClick={handleLogOut} className={styles.logoutButton}>
                  Logout
                </button>
              </li>
            ) : (
              location.pathname !== "/login" &&
              location.pathname !== "/register" && (
                <li>
                  <Link
                    to="/login"
                    className={`${styles.link} ${styles["sign-in--btn"]}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
