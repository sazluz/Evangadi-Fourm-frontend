import { useForm } from "react-hook-form";
import { IoMdArrowRoundForward, IoIosArrowDropright } from "react-icons/io";
import { useContext, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import styles from "./AskQuestion.module.css";
import { UserContext } from "../../context/UserProvide";
import axiosInstance from "../../Axios/axiosConfig";

function AskQuestion() {
    
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();

  const sanitizeContent = (content) => DOMPurify.sanitize(content);

  const onSubmit = async (data) => {
    const description = editorRef.current?.innerHTML?.trim() || "";

    if (!description) {
      alert("Please write a question description!");
      return;
    }

    const sanitizedDescription = sanitizeContent(description);
    const questionid = uuidv4();

    setLoading(true);
    try {
      await axiosInstance.post(
        "/questions/ask-question",
        {
          title: data.title,
          description: sanitizedDescription,
          userid: user.userid,
          questionid,
          tag: data.tag,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessful(true);
      reset();
      if (editorRef.current) editorRef.current.innerHTML = "";
    } catch (error) {
      setError("server", {
        type: "manual",
        message:
          error.response?.data?.message || "Failed to post your question",
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    "Summarize your problem in a one-line title.",
    "Describe your problem in more detail.",
    "Describe what you tried and what you expected to happen.",
    "Review your question and post it to the site.",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        <h2 className={styles.heading}>Steps to write a good question</h2>
        <ul className={styles.stepList}>
          {steps.map((step, idx) => (
            <li key={idx} className={styles.stepItem}>
              <IoMdArrowRoundForward /> {step}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.askQuestion}>
        <h2 className={styles.heading}>Ask a public question</h2>

        {successful && (
          <Link to="/home">
            <div className={styles.successMessage}>
              <small className={styles.successText}>
                Question posted successfully! Click here to go home.
              </small>
              <IoIosArrowDropright color="green" size={25} />
            </div>
          </Link>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <input
            type="text"
            placeholder="Tag"
            className={`${styles.input} ${errors.tag ? styles.invalid : ""}`}
            {...register("tag")}
          />

          <input
            type="text"
            placeholder="Title"
            className={`${styles.input} ${errors.title ? styles.invalid : ""}`}
            {...register("title", { required: "Title is required" })}
          />

          <label>Question Description</label>
          <div className={styles.editorWrapper}>
            <div
              ref={editorRef}
              contentEditable
              className={styles.editor}
              dir="ltr"
              data-placeholder="Describe your question here..."
            />
          </div>

          <button
            type="submit"
            className={styles.postQuestion}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Your Question"}
          </button>
        </form>
        <Link to="/home">
                <div className={styles.successMessage}>
                  <span className={styles.successText}>Click here to go home.</span>
                  <IoIosArrowDropright color="green" size={25} />
                </div>
              </Link>
      </div>
    </div>
  );
}

export default AskQuestion;
