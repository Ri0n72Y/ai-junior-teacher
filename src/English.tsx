import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { chat, getJwt } from "./services";
import axios from "axios";
import { EnglishVocabularyFormat, prompts } from "./prompts/english";
import { useNavigate } from "react-router";

function English() {
  const [question, setQuestion] = useState("");
  const [word, setWord] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");
  const [wait, setWait] = useState(false);
  const [level, setLevel] = useState(4);
  const [status, setStatus] = useState(0);
  const [checked, setChecked] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    getJwt()
      .then((token) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      })
      .then(() => chat(`${prompts.base}\n现在请你跟我打个招呼，不要超过20个字`))
      .then((res) => {
        setQuestion(res.data.choices[0].message.content);
      });
  }, []);
  const newWord = useCallback(() => {
    if (checked) {
      setWait(true);
      setInputText("");
      setQuestion("");
      const next = [...words, word];
      setWords(next);
      return chat(
        `${prompts.base}\n${prompts.getVocabulary}\n${
          prompts.format
        }\n${prompts.exclude(next)}`
      ).then((res) => {
        const msg = JSON.parse(
          res.data.choices[0].message.content
        ) as EnglishVocabularyFormat;
        setWord(msg.vocab);
        setChecked(false);
        setWait(false);
      });
    }
  }, [checked, word, words]);
  const check = useCallback(() => {
    if (!checked) {
      const inputs = (
        document.querySelector(".answer-text") as HTMLInputElement
      ).value;
      if (!inputs.replace(new RegExp(" ", "g"), "")) {
        setQuestion("请输入答案");
        return;
      }
      setWait(true);
      chat(`${prompts.checkVocabulary(word, inputs, level)}`).then((res) => {
        const msg = res.data.choices[0].message.content;
        setQuestion(msg);
        setChecked(true);
        setWait(false);
      });
    }
  }, [checked, level, word]);
  return (
    <div className="main-container">
      <div className="question">
        {status === 0 && question}
        {status === 1 && "在下方输入这个单词的意思，尽可能简短"}
      </div>
      {status === 0 && !wait && (
        <div className="level">
          <button
            className="btn"
            onClick={() => {
              newWord()?.then(() => setStatus(1));
            }}
          >
            开始
          </button>
          <button
            className="btn"
            onClick={() => {
              navigate("/");
            }}
          >
            返回
          </button>
        </div>
      )}
      {status === 0 && wait && <span className="btn">等待中...</span>}
      {status === 1 && <span className="vocab">{word}</span>}
      {status === 1 && (
        <div className="answer">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="answer-text"
          />
        </div>
      )}
      {status === 1 && <div className="discuss">{question}</div>}
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
            <button
              className="btn"
              style={{ marginLeft: 12, background: "aqua" }}
              onClick={() => {
                checked ? newWord() : check();
              }}
            >
              {checked ? "下一个" : "我确定"}
            </button>
          )}
          {wait && <span style={{ marginLeft: 12 }}>等待中...</span>}
        </div>
      )}
    </div>
  );
}

export default English;
