import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { chat, getJwt } from "./services";
import axios from "axios";
import { MathQuestion, prompts } from "./prompts/math";
import { systemPrompt } from "./prompts/base";

function Math() {
  const [question, setQuestion] = useState<MathQuestion>();
  const [solution, setSolution] = useState("");
  const [inputText, setInputText] = useState("");
  const [wait, setWait] = useState(false);
  const [level, setLevel] = useState(4);
  const [status, setStatus] = useState(0);
  const [checked, setChecked] = useState(true);
  useEffect(() => {
    getJwt()
      .then((token) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      })
      .then(() => chat(`${prompts.base}\n现在请你跟我打个招呼，不要超过20个字`))
      .then((res) => {
        setQuestion({
          question: res.data.choices[0].message.content as string,
          answer: "",
        });
      });
  }, []);
  const newQuestion = useCallback(() => {
    if (checked) {
      setWait(true);
      setInputText("");
      setQuestion(undefined);
      setSolution("");
      return chat(
        `${prompts.base}\n${systemPrompt.difficulty(level)}\n${prompts.format}`
      ).then((res) => {
        const msg = JSON.parse(
          res.data.choices[0].message.content
        ) as MathQuestion;
        setQuestion(msg);
        setChecked(false);
        setWait(false);
      });
    }
  }, [checked, level]);
  const check = useCallback(() => {
    if (!checked) {
      const inputs = (
        document.querySelector(".answer-text") as HTMLInputElement
      ).value;
      if (!inputs.replace(new RegExp(" ", "g"), "")) {
        setSolution("请输入答案");
        return;
      }
      setWait(true);
      chat(
        `问题：${question?.question}。${systemPrompt.precheck}: ${inputText}`
      ).then((res) => {
        const msg = res.data.choices[0].message.content;
        setSolution(msg);
        setChecked(true);
        setWait(false);
      });
    }
  }, [checked, inputText, question?.question]);
  const solve = useCallback(() => {
    setWait(true);
    chat(`${systemPrompt.solve(question?.question ?? "", level)}`).then(
      (res) => {
        const msg = res.data.choices[0].message.content;
        setSolution(msg);
        setChecked(true);
        setWait(false);
      }
    );
  }, [level, question?.question]);
  return (
    <div className="main-container">
      <img src="/yeah.webp" alt="" />
      <div className="question">{question?.question}</div>
      {status === 0 && !wait && (
        <button
          className="btn"
          onClick={() => {
            newQuestion()?.then(() => setStatus(1));
          }}
        >
          开始
        </button>
      )}
      {status === 0 && wait && <span className="btn">等待中...</span>}
      {status === 1 && (
        <div className="answer">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="answer-text"
          />
        </div>
      )}
      {status === 1 && <div className="discuss">{solution}</div>}
      {status === 1 && (
        <div className="level">
          <button
            className="btn"
            onClick={() => {
              setLevel(level - 1);
            }}
          >
            简单点
          </button>
          <span>{level}</span>
          <button
            className="btn"
            onClick={() => {
              setLevel(level + 1);
            }}
          >
            再难点
          </button>
          {!wait && (
            <>
              <button
                className="btn"
                style={{ marginLeft: 12, background: "aqua" }}
                onClick={() => {
                  checked ? newQuestion() : check();
                }}
              >
                {checked ? "下一个" : "我确定"}
              </button>
              {checked && (
                <button
                  className="btn"
                  style={{ marginLeft: 12, background: "aqua" }}
                  onClick={solve}
                >
                  告诉我解答
                </button>
              )}
            </>
          )}
          {wait && <span style={{ marginLeft: 12 }}>等待中...</span>}
        </div>
      )}
    </div>
  );
}

export default Math;
