import React from "react";
import styles from "./HowItWorks.module.css";
import {
  FaUserPlus,
  FaSignInAlt,
  FaQuestion,
  FaReply,
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <FaUserPlus />,
    title: "1. Register",
    desc: "Create your account quickly with a unique username and email.",
  },
  {
    icon: <FaSignInAlt />,
    title: "2. Sign In",
    desc: "Log in to access your account and start asking or answering questions.",
  },
  {
    icon: <FaQuestion />,
    title: "3. Ask a Question",
    desc: "Post your programming questions with clear titles and details.",
  },
  {
    icon: <FaReply />,
    title: "4. Share Answers",
    desc: "Help others by sharing your knowledge and experience.",
  },
  {
    icon: <FaEdit />,
    title: "5. Edit Posts",
    desc: "Update your posts anytime to improve clarity or correctness.",
  },
  {
    icon: <FaTrash />,
    title: "6. Delete Posts",
    desc: "Remove questions or answers you no longer want on the platform.",
  },
  {
    icon: <FaEye />,
    title: "7. Explore & Learn",
    desc: "Browse answers and grow your skills by learning from the community.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" },
  }),
};

function HowItWorks() {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>How It Works</h2>
      <p className={styles.subtitle}>
        Ask, answer, and learn together in a simple and interactive way.
      </p>

      <div className={styles.steps}>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={styles.card}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
          >
            <div className={styles.icon}>{step.icon}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDesc}>{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
