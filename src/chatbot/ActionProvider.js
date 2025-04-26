class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    
    // ChatGPT API endpoint
    this.apiEndpoint = "https://api.openai.com/v1/chat/completions";
    
    // You'll need to set your API key
    this.apiKey = "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"; // Replace with your actual API key
    
    // System prompt to guide ChatGPT's responses
    this.systemPrompt = "You're an AI advisor for a telematics service - keep all answers and conversation related to cars and data presented from here on out";
    
    // Rate limiting variables
    this.isRateLimited = false;
    this.retryAfter = 0;
  }

  // Method to add a message to the chatbot state
  addMessageToState(message) {
    this.setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }

  // Handle API response loading state
  setLoading(isLoading) {
    if (isLoading) {
      const loadingMessage = this.createChatBotMessage("Thinking...");
      this.addMessageToState(loadingMessage);
    }
  }

  // Greet function - simple hardcoded response
  greet() {
    const message = this.createChatBotMessage("Hello there! I'm your telematics advisor. I can help you understand your driving data and provide tips for safer, more efficient driving. How can I assist you today?");
    this.addMessageToState(message);
  }

  // Provide local fallback responses when API is unavailable
  provideFallbackResponse(userMessage) {
    // Simple fallback responses related to driving and telematics
    const fallbackResponses = {
      default: "I'm your telematics assistant. I can help with driving data analysis and vehicle performance when my connection is restored.",
      speed: "Monitoring your speed is important for safe driving. Most telematics devices track speed and can alert you to dangerous driving patterns.",
      fuel: "Fuel efficiency can be improved by maintaining steady speeds, avoiding rapid acceleration, and keeping your tires properly inflated.",
      braking: "Harsh braking is often an indicator of distracted driving or following too closely. Telematics data can help identify these patterns.",
      acceleration: "Smooth acceleration helps improve fuel economy and reduces wear on your vehicle's components.",
      maintenance: "Regular maintenance is crucial for vehicle safety and performance. Many telematics systems can track maintenance needs based on mileage and usage patterns."
    };

    // Simple keyword matching for better responses
    const lowercase = userMessage.toLowerCase();
    let responseKey = "default";
    
    if (lowercase.includes("speed") || lowercase.includes("fast") || lowercase.includes("slow")) {
      responseKey = "speed";
    } else if (lowercase.includes("fuel") || lowercase.includes("gas") || lowercase.includes("economy")) {
      responseKey = "fuel";
    } else if (lowercase.includes("brake") || lowercase.includes("stop") || lowercase.includes("slow down")) {
      responseKey = "braking";
    } else if (lowercase.includes("accelerat") || lowercase.includes("speed up")) {
      responseKey = "acceleration";
    } else if (lowercase.includes("maintenance") || lowercase.includes("repair") || lowercase.includes("fix")) {
      responseKey = "maintenance";
    }

    return fallbackResponses[responseKey];
  }

  // Main function to handle messages and pass them to ChatGPT
  async handleMessage(userMessage) {
    // Show loading state
    this.setLoading(true);
    
    // Check if we're currently rate limited
    if (this.isRateLimited) {
      // Remove loading message
      this.setState(prev => {
        const messages = [...prev.messages];
        messages.pop();
        return {
          ...prev,
          messages,
        };
      });
      
      // Provide fallback response
      const fallbackMessage = this.createChatBotMessage(
        `${this.provideFallbackResponse(userMessage)} (API currently unavailable due to rate limiting. Please try again later.)`
      );
      this.addMessageToState(fallbackMessage);
      return;
    }
    
    try {
      const response = await this.fetchChatGPTResponse(userMessage);
      
      // Remove loading message and add response
      this.setState(prev => {
        const messages = [...prev.messages];
        // Remove the loading message
        messages.pop();
        return {
          ...prev,
          messages,
        };
      });
      
      const chatbotResponse = this.createChatBotMessage(response);
      this.addMessageToState(chatbotResponse);
    } catch (error) {
      console.error("Error fetching response:", error);
      
      // Check if this is a rate limiting error
      if (error.message && error.message.includes("status 429")) {
        this.isRateLimited = true;
        
        // Reset rate limit after 1 minute (adjust as needed)
        setTimeout(() => {
          this.isRateLimited = false;
        }, 60000);
      }
      
      // Remove loading message and add error response
      this.setState(prev => {
        const messages = [...prev.messages];
        messages.pop();
        return {
          ...prev,
          messages,
        };
      });
      
      // Provide a more helpful message for rate limiting
      let errorMessage;
      if (this.isRateLimited) {
        errorMessage = this.createChatBotMessage(
          `${this.provideFallbackResponse(userMessage)} (I'm currently experiencing high demand. Please try again in a minute.)`
        );
      } else {
        errorMessage = this.createChatBotMessage(
          "Sorry, I'm having trouble connecting right now. Please try again later."
        );
      }
      
      this.addMessageToState(errorMessage);
    }
  }

  // Function to call ChatGPT API
  async fetchChatGPTResponse(userMessage) {
    try {
      const requestBody = {
        model: "gpt-3.5-turbo", // You can use "gpt-4" for better results if you have access
        messages: [
          {
            role: "system",
            content: this.systemPrompt
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      };

      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      // Check for rate limiting headers
      if (response.headers.has("retry-after")) {
        const retryAfter = parseInt(response.headers.get("retry-after"), 10);
        if (!isNaN(retryAfter)) {
          this.retryAfter = retryAfter;
        }
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  }
}

export default ActionProvider;