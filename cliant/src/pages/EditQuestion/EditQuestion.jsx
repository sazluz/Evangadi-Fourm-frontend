import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axiosInstance from "../../Axios/axiosConfig";
import styles from "./EditQuestion.module.css";
import { QuestionContext } from "../../Context/QuestionProvide";
import { UserContext } from "../../Context/UserProvide";
import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
// import "react-quill/dist/quill.snow.css";

import Quill from "quill";

const EditQuestion = () => {
    const { question_id } = useParams();
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
  const { questions, setQuestions } = useContext(QuestionContext);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [editorContent, setEditorContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const question = questions.find((q) => q.question_id === question_id);

  useEffect(() => {
    if (!question) {
      (async () => {
        try {
          const response = await axiosInstance.get(
            `/questions/question/${question_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const sanitizedContent = DOMPurify.sanitize(
            response.data.question.question_description
          );
          setQuestions((prev) => [...prev, response.data.question]);
          setEditorContent(sanitizedContent);
          setOriginalContent(sanitizedContent);
          reset({
            title: response.data.question.title,
            tag: response.data.question.tag || "",
          });
          setLoading(false);
        } catch {
          setLoading(false);
        }
      })();
    } else {
      setEditorContent(DOMPurify.sanitize(question.question_description));
      setOriginalContent(question.question_description);
      reset({
        title: question.title,
        tag: question.tag || "",
      });
      setLoading(false);
    }
  }, [question, reset]);

  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, false] }],
            [{ font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["blockquote", "code-block"],
            ["link", "image", "video"],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            ["clean"],
          ],
        },
      });
      quillInstance.current.root.innerHTML = editorContent;
      quillInstance.current.on("text-change", () => {
        setEditorContent(
          DOMPurify.sanitize(quillInstance.current.root.innerHTML)
        );
      });
    }
  }, [editorContent]);

  const onSubmit = async (data) => {
    try {
      const updatedQuestion = {
        title: data.title,
        question_description: editorContent,
        user_id: user.user_id,
        question_id,
      };
      if (data.tag.trim()) {
        updatedQuestion.tag = data.tag.split(",").map((tag) => tag.trim());
      }
      await axiosInstance.put(
        `/questions/update/${question_id}`,
        updatedQuestion,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id === question_id ? { ...q, ...updatedQuestion } : q
        )
      );
      navigate(`/questions/${question_id}`);
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
          <label>Description (Preview)</label>
          <div
            className={styles.previewBox}
            dangerouslySetInnerHTML={{ __html: editorContent }}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Edit Description</label>
          <div ref={quillRef} className={styles["quill-editor"]}></div>
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
            onClick={() => navigate("/home")}
          >
            Discard Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuestion;
