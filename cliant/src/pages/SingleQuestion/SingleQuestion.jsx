import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../Axios/axiosConfig";
import { UserContext } from "../../context/UserProvide";
import DOMPurify from "dompurify";
import { FaUserCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import styles from "./SingleQuestion.module.css";
import { IoIosArrowDropright } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const SingleQuestion = () => {
  const { questionid } = useParams();
  const { user } = useContext(UserContext);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerInput, setAnswerInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState({});
  const [isListening, setIsListening] = useState(false);

  // -------------------********
  // Fetch single question
  // -------------------********
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const token = user?.token || localStorage.getItem("token");
        const res = await axiosInstance.get(
          `/questions/question?questionid=${questionid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuestion(res.data.questions[0] || null);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionid, user?.token]);

  // -------------------***********
  // Fetch answers
  // -------------------***********
  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const token = user?.token || localStorage.getItem("token");
      const res = await axiosInstance.get(
        `/answer/getanswer?questionid=${questionid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswers(res.data.answers || []);
      setLoading(false);
    } catch (err) {
      console.error(
        "Error fetching answers:",
        err.response?.data || err.message
      );
      setAnswers([]);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnswers();
  }, [questionid, user?.token]);

  //static like handler with localStorage
  const handleLike = (answerid) => {
    setLikes((prev) => {
      const alreadyLiked = prev[answerid] === 1; // check if already liked
      const updatedLikes = {
        ...prev,
        [answerid]: alreadyLiked ? 0 : 1, // toggle like
      };
      localStorage.setItem("likes", JSON.stringify(updatedLikes));
      return updatedLikes;
    });
  };

  // Load likes on component mount
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likes")) || {};
    setLikes(savedLikes);
  }, []);

  // -------------------**********
  // Post new answer
  // -------------------**********
  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!user?.userid) {
      alert("You must be logged in to post an answer.");
      return;
    }
    if (!answerInput.trim()) {
      alert("Answer cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const sanitizedAnswer = DOMPurify.sanitize(answerInput);
      const token = user?.token || localStorage.getItem("token");

      await axiosInstance.post(
        `/answer/${questionid}`,
        {
          answer: sanitizedAnswer,
          userid: user.userid,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnswerInput("");
      await fetchAnswers();
      setLoading(false);
    } catch (err) {
      console.error("Error posting answer:", err.response?.data || err.message);
      setLoading(false);
    }
  };

  // *******speech*********/
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;

      // append spoken text to the textarea
      setAnswerInput((prev) => (prev ? `${prev} ${spokenText}` : spokenText));
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  // -------------------******
  // Render
  // -------------------****
  return (
    <div className={styles.outerDiv}>
      {loading && (
        <div className={styles.loaderContainer}>
          <ClipLoader size={50} color="#36d7b7" />
        </div>
      )}

      {question && (
        <div className={styles.questionCard}>
          <div className={styles.questionHeader}>
            {/* Replace image with SVG icon */}
            <FaUserCircle className={styles.userIcon} />

            <div className={styles.userInfo}>
              <strong className={styles.username}>{question.username}</strong>
              {question.createdAt && (
                <span className={styles.postedTime}>
                  {new Date(question.createdAt).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <h2 className={styles.questionTitle}>{question.title}</h2>

          <div
            className={styles.questionDescription}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(question.description || ""),
            }}
          />
        </div>
      )}

      <div className={styles.answersCard}>
        <h3>Answers From The Community</h3>
        {answers.length === 0 && <p>No answers yet. Be the first to answer!</p>}
        {answers.map((ans) => (
          <div key={ans.answerid} className={styles.answerCard}>
            <div className={styles.answerContent}>
              <div className={styles.answerText}>
                <FaUserCircle size={30} className={styles.userIcon} />
                <div>a
                  <strong>{ans.username}</strong>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(ans.answer),
                    }}
                  />
                </div>
              </div>

              {/*  Heart at the end */}
              <div className={styles.answerLike}>
                <span
                  id={`heart-${ans.answerid}`}
                  className={`${styles.tiktokHeart} ${
                    likes[ans.answerid] ? styles.liked : ""
                  }`}
                  onClick={() => handleLike(ans.answerid)}
                >
                  <FaHeart />
                </span>
                <span className={styles.tiktokLikeCount}>
                  {likes[ans.answerid] || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handlePostAnswer} className={styles.answerFormCard}>
        <div style={{ position: "relative", width: "100%" }}>
          <textarea
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            placeholder="Write or speak your answer here..."
            rows={6}
            required
            style={{
              width: "100%",
              paddingRight: "50px", // space for the mic
              resize: "vertical",
            }}
          />

          {/* Mic inside the textarea box */}
          <button
            type="button"
            onClick={startListening}
            className={`${styles.micButton} ${
              isListening ? styles.listening : ""
            }`}
          >
            {isListening ? <FaMicrophoneSlash /> : <FaMicrophone size={20}/>}
          </button>
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: "10px" }}>
          {loading ? "Posting..." : "Post Your Answer"}
        </button>
      </form>

      <Link to="/home">
        <div className={styles.successMessage}>
          <span className={styles.successText}>Click here to go home.</span>
          <IoIosArrowDropright color="green" size={25} />
        </div>
      </Link>
    </div>
  );
};

export default SingleQuestion;
