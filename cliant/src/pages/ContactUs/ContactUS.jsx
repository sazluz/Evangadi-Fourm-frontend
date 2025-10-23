import { useState } from "react";
import styles from "./Contact.module.css";
import { FaEnvelope, FaPhone, FaGlobe } from "react-icons/fa";
import emailjs from "emailjs-com";
// Use your EmailJS IDs
const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const USER_ID = import.meta.env.VITE_USER_ID;


const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  }); //stores input values
  const [status, setStatus] = useState(""); // Feedback message
  const [loading, setLoading] = useState(false); // For loader

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("Sending...");

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, formData, USER_ID)
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setStatus("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" }); // Reset form
        },
        (error) => {
          console.error("FAILED...", error);
          setStatus("Failed to send message. Try again later.");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.contactContainer}>
      <h1 className={styles.title}>Contact Us</h1>
      <p className={styles.subtitle}>
        We’re here to help! Reach out to Evangadi Networks anytime.
      </p>

      <div className={styles.contactCards}>
        <div className={styles.card}>
          <FaGlobe className={styles.icon} />
          <h3>Evangadi Networks</h3>
          <p>123 Main Street, Addis Ababa, Ethiopia</p>
        </div>
        <div className={styles.card}>
          <FaEnvelope className={styles.icon} />
          <h3>Email</h3>
          <p>support@evangadi.com</p>
        </div>
        <div className={styles.card}>
          <FaPhone className={styles.icon} />
          <h3>Phone</h3>
          <p>+1-202-386-2702</p>
        </div>
      </div>

      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <h2>Send Us a Feedback</h2>
        <input
          type="text"
          placeholder="Your Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          placeholder="Your Message"
          name="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
        {status && <p className={styles.status}>{status}</p>}
      </form>
    </div>
  );
};

export default Contact;
