// import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Configuration, OpenAIApi } from "openai";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { IoSend } from "react-icons/io5";

import Logo from "../../Assets/icon.png";
import "./ChatBot.css";

function ChatBot({ setBotIsOpen }) {
  const [chats, setChats] = useState([
    {
      id: 212,
      text: "Hi, How can i help you?",
      sender: "robot",
    },
  ]);

  const [input, setInput] = useState();

  const boxRef = useRef();

  const [typing, setTyping] = useState(false);

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
  });

  const openai = new OpenAIApi(configuration);

  useEffect(() => {
    boxRef.current.scrollTo(-20, 10000000000);
  }, [chats]);

  const sendMessage = async (e) => {
    console.log(process.env.REACT_APP_KEY);

    e.preventDefault();

    setChats((prev) => [
      ...prev,
      { id: Date.now(), text: input, sender: "user" },
    ]);

    boxRef.current.scrollTo(-20, 10000000000);

    setTyping(true);
    setInput("");

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: input,
      temperature: 0.3,
      max_tokens: 60,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      stop: ["You: "],
    });

    setTyping(false);
    setChats((prev) => [
      ...prev,
      { id: Date.now(), text: response.data.choices[0].text, sender: "robot" },
    ]);

    console.log(response);
  };

  return (
    <div className="chatbot-outer">
      <div className="chatbox-container">
        <div className="header">
          <div className="left-header">
            <div className="stack-logo">
              <img src={Logo} alt="" />
            </div>
            <span className="header-title">
              <b>Stack</b> Overflow<b> Bot</b>
            </span>
          </div>
          <button onClick={() => setBotIsOpen(false)}>
            <FiChevronDown />
          </button>
        </div>
        <div className="chats-box" ref={boxRef}>
          {chats?.map((chat) => {
            return (
              <div className={chat.sender} key={chat.id}>
                <span> {chat.text} </span>
              </div>
            );
          })}
          {typing && <span className="typing">Loading...</span>}
        </div>

        <form onSubmit={sendMessage}>
          <div className="footer">
            <input
              type="text"
              placeholder="Ask your queries..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <button type="submit">
              <IoSend />
              {/* <FontAwesomeIcon icon={faPaperPlane} /> */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;
