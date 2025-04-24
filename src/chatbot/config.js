import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  initialMessages: [createChatBotMessage("Hi! I'm the Back Seat Driver Chatbot, I'm here to use data you've colelcted from your journeys to assist you in understanding that data better and making actionables for you to drive safer and more efficiently.")],
  botName: "HelperBot",
};

export default config;
