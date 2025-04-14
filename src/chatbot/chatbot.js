// ChatbotWidget.js
import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

import './chatbot.css';

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={styles.chatbotContainer}>
      {isOpen && (
        <div style={styles.chatbotBox}>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
      <button
        className="btn btn-primary rounded-circle"
        style={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>
    </div>
  );
}

const styles = {
  chatbotContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
  chatbotBox: {
    width: "350px",
    height: "450px",
    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "10px",
    backgroundColor: "white",
  },
  toggleButton: {
    width: "60px",
    height: "60px",
    fontSize: "24px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
  },
};

export default ChatbotWidget;
