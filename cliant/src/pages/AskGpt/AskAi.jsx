import { useState } from "react";
import styles from "./AskAi.module.css";
import axiosinstance from "../../Axios/axiosConfig";
import { Link } from "react-router-dom";

const AskAi = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim()) {
      setResponse("Please type a question before asking AI.");
      return;
    }

    setLoading(true);
    setResponse(""); // Clear old response

    try {
      const res = await axiosinstance.post("/chatgpt", {
        question: prompt,
      });
      console.log("✅ Backend response:", res.data);
      // ✅ Handle backend responses correctly
      if (res.data.error) {
        setResponse(`Error: ${res.data.error}`);
      } else if (res.data.reply) {
        setResponse(res.data.reply);
      } else {
        setResponse("We could not find the response. Try again later.");
      }

      setPrompt("");
    } catch (error) {
      setResponse(
        " ERROR → " + JSON.stringify(error.response?.data || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.askAiContainer}>
      <h3>Need help? You can Ask AI</h3>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask AI for help with your question..."
        className={styles.textarea}
      />

      <button onClick={handleAsk} className={styles.button} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {response && (
        <div className={styles.responseBox}>
          <strong>AI Response:</strong>
          <p>{response}</p>
          <Link to="/home">
            <button>click Here To Go Home</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AskAi;
