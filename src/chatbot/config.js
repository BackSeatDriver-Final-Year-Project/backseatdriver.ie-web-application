import { createChatBotMessage } from "react-chatbot-kit";
import React from "react";

const botName = "Back Seat Driver";

const config = {
  initialMessages: [
    createChatBotMessage(
      "Hello! I'm your Back Seat Driver assistant. I can help analyze your driving data, provide safety tips, and offer insights to improve your fuel efficiency. How can I help you today?"
    ),
  ],
  botName: botName,
  customStyles: {
    botMessageBox: {
      backgroundColor: "#4a1c6f",
    },
    chatButton: {
      backgroundColor: "#4a1c6f",
    },
  },
  state: {
    userData: null,
  },
};

export default config;