import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDropright } from "react-icons/io";
import DOMPurify from "dompurify";
import axiosInstance from "../../Axios/axiosConfig";
import { QuestionContext } from "../../context/QuestionProvide";
import { UserContext } from "../../context/UserProvide";
import styles from "./Home.module.css";
import { ClipLoader } from "react-spinners";

const Home = () => {
  const token = localStorage.getItem("token");
  const { questions, setQuestions } = useContext(QuestionContext);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState("/ask");

  const questionsPerPage = 7;
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("Logged in user:", user);
    // console.log("First question:", questions?.[0]);
  }, [user, questions]);


  // Fetch all questions with frontend-created createdAt fallback
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/questions/all-questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const questionsWithCreatedAt = response.data.questions.map((q) => ({
          ...q,
          createdAt: q.createdAt || new Date().toISOString(),  
        }));

        setQuestions(questionsWithCreatedAt);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "No questions available now. Please try again."
        );
        setLoading(false);
      }
    })();
  }, [token, setQuestions]);

  //edit question
  const handleEdit = (questionid, e) => {
    e.stopPropagation();
    navigate(`/questions/question/${questionid}`);
  };
  
  //delete question
  const handleDelete = async (questionid, e) => {
    e.stopPropagation();
    try {
      const userid = user?.userid;
      if (!userid) return;

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this question?"
      );
      if (!confirmDelete) return;

      await axiosInstance.delete(`/questions/question/${questionid}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userid, questionid },
      });

      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.questionid !== questionid)
      );
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  const filteredQuestions = (questions || []).filter(
    (q) =>
      q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  return (
    <div className={styles.homeContainer}>
      <header className={styles.homeHeader}>
        <div className={styles.askQuestionBtnGroup}>
          {/* Dropdown for selection */}
          <select
            className={styles.askQuestionBtn}
            style={{ cursor: "pointer" }}
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="/ask">Ask a Question</option>
            <option value="/chatgpt">Ask AI</option>
          </select>

          {/* One single button */}
          <button
            className={styles.askQuestionBtn}
            onClick={() => navigate(selectedOption)}
          >
            Go
          </button>
        </div>

        <div className={styles.welcomeUser}>
          <h1>Welcome: {user ? user.username : "Loading..."}!</h1>
          <p>Learn, Share, and Inspire Others!</p>
        </div>
      </header>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <ClipLoader className={styles.loadingIcon} />
          <p className={styles.loadingMessage}>Loading questions...</p>
        </div>
      )}

      {error && <p className={styles.errorMessage}>{error}</p>}

      {!loading && !error && filteredQuestions.length === 0 && (
        <p className={styles.noQuestionsMessage}>No questions available.</p>
      )}

      {!loading && !error && filteredQuestions.length > 0 && (
        <div className={styles.questionsList}>
          {currentQuestions.map((question, i) => (
            <div
              key={question.questionid}
              className={styles.cardWrapper}
              onClick={() => navigate(`/questions/${question.questionid}`)}
            >
              <div className={styles.questionCard}>
                <div className={styles.profileSection}>
                  <FaUserCircle className={styles.profileIcon} />
                  <span className={styles.username}>{question?.username}</span>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.contentTitle}>
                    <Link
                      to={`/questions/${question.questionid}`}
                      className={styles.link}
                    >
                      {question.title}
                    </Link>
                  </h3>
                  <div
                    className={styles.descriptionDiv}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(question?.description),
                    }}
                  />

                  <div className={styles.meta}>
                    <div className={styles.metaTags}>
                      <ul className={styles.tagList}>
                        {question?.tags?.map((tag) => (
                          <li key={tag} className={styles.tagItem}>
                            <Link
                              to={`/questions/tagged/${tag}`}
                              className={styles.tag}
                            >
                              {tag}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.userCard} aria-live="polite">
                      <time className={styles.time}>
                        Asked at{" "}
                        <span title={question.createdAt}>
                          {new Date(question.createdAt).toLocaleString()}
                        </span>
                      </time>
                    </div>
                    <div className={styles.btnContainer}>
                      {user?.userid === question.userid && (
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.editBtn}
                            onClick={(e) => handleEdit(question.questionid, e)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={(e) =>
                              handleDelete(question.questionid, e)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Link
                to={`/questions/${question.questionid}`}
                className={styles.arrow}
              >
                <div className={styles.arrowDiv}>
                  <IoIosArrowDropright className={styles.arrowIcon} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of{" "}
          {Math.ceil(filteredQuestions.length / questionsPerPage)}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              indexOfLastQuestion < filteredQuestions.length ? prev + 1 : prev
            )
          }
          disabled={indexOfLastQuestion >= filteredQuestions.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
