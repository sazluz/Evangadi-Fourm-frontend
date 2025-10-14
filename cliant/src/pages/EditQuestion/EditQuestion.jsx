import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axiosInstance from "../../Axios/axiosConfig";
import { QuestionContext } from "../../Context/QuestionProvide";
import { UserContext } from "../../Context/UserProvide";
import styles from "./EditQuestion.module.css";

const EditQuestion = () => {
  const { questionid } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { questions, setQuestions } = useContext(QuestionContext);
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch question
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const question = questions.find((q) => q.questionid === questionid);
        if (question) {
          reset({ title: question.title, tag: question.tag?.join(",") || "" });
          setDescription(question.description);
        } else {
          const response = await axiosInstance.get(
            `/questions/question/${questionid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const q = response.data.question;
          setQuestions((prev) => [...prev, q]);
          reset({ title: q.title, tag: q.tag?.join(",") || "" });
          setDescription(q.description);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionid, questions, reset, setQuestions, token]);

  const onSubmit = async (data) => {
    try {
      const updatedQuestion = {
        title: data.title,
        description: description,
        userid: user.userid,
        questionid,
      };
      if (data.tag?.trim()) {
        updatedQuestion.tag = data.tag.split(",").map((tag) => tag.trim());
      }

      await axiosInstance.put(
        `/questions/question/${questionid}`,
        updatedQuestion,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestions((prev) =>
        prev.map((q) =>
          q.questionid === questionid ? { ...q, ...updatedQuestion } : q
        )
      );

      navigate(`/home`);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2>Edit Question</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label>Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className={styles.error}>{errors.title.message}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Tags</label>
          <input
            type="text"
            {...register("tag")}
            placeholder="Comma-separated tags - optional"
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
          <button
            type="button"
            className={styles.discardButton}
            onClick={() => navigate(-1)} // Go back
          >
            Discard Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuestion;
