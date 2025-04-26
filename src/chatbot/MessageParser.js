class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lowercase = message.toLowerCase();

    // Special handling for greetings
    if (lowercase.includes("hello") || 
        lowercase.includes("hi") || 
        lowercase.includes("hey") || 
        lowercase.includes("greetings")) {
      this.actionProvider.greet();
      return;
    }

    // For all other messages, pass to ChatGPT through our action provider
    this.actionProvider.handleMessage(message);
  }
}

export default MessageParser;