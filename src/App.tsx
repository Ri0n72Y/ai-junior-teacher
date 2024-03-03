import { useEffect, useState } from "react";
import "./App.css";
import { chat, getJwt } from "./services";
import axios from "axios";
import { systemPrompt } from "./prompts/base";
import { useNavigate } from "react-router";

function App() {
  const [question, setQuestion] = useState("");
  const [wait, setWait] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getJwt()
      .then((token) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      })
      .then(() => chat(systemPrompt.greeting))
      .then((res) => {
        setQuestion(res.data.choices[0].message.content);
      });
  }, []);
  return (
    <div className="main-container">
      <div className="question">{question}</div>
      <div className="level">
        {!wait && (
          <>
            <button
              className="btn"
              onClick={() => {
                setWait(true);
                navigate("/math");
              }}
            >
              数学
            </button>
            {/* <button
            className='btn'
            onClick={() => { setWait(true); navigate("/english") }}>
            英语
          </button> */}
          </>
        )}
        {wait && <div>请稍等。。。</div>}
      </div>
    </div>
  );
}

export default App;
