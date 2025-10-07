
import React from "react";
import Logo from "../../assets/images/EvangadiLogo.png";
import style from "./Footer.module.css";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <section className={style.footer}>
      <div className={style.internalWrapper}>
        <div className={style.logoSection}>
          {/* Logo */}
          <img src={Logo} alt="Logo" className={style.logo} />
          {/* Social links */}
          <div className={style.socialLinks}>
            <Link
              to="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={30} />
            </Link>
            <Link
              to="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={30} />
            </Link>
            <Link
              to="https://www.youtube.com/@EvangadiTech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube size={30} />
            </Link>
          </div>
        </div>

        <div className={style.linksSection}>
          {/* Useful links */}
          <ul className={style.linksList}>
            <h3>Useful Links</h3>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/how-it-works">How It Works</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
         {/* Contact Info */}
          <div className={style.contactInfo}>
            <h3>Contact Info</h3>
            <ul className={style.contactList}>
              <li>Evangadi Networks </li>
              <li> support@evangadi.com </li>
              <li> +1-202-386-2702 </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
