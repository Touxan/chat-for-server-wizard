
/**
 * Generate a bot response based on user message
 * This hook makes an API call to get a response from the agent
 */
export const useBotResponseGenerator = () => {
  const generateBotResponse = async (message: string) => {
    try {
      console.log("Sending message to bot API:", message);
      const response = await fetch("https://sup-n8n.unipile.com/webhook/fa9cedbd-a97f-40d1-aea0-be886097d07c", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      // Handle potential empty responses
      const responseText = await response.text();
      
      if (!responseText || responseText.trim() === '') {
        console.log("Empty response received from API");
        return {
          botContent: "Sorry, I couldn't process your request at the moment.",
          command: null
        };
      }
      
      try {
        const data = JSON.parse(responseText);
        return {
          botContent: data.message || data.response || "I didn't understand your request.",
          command: data.command || null
        };
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        // If JSON parsing fails, return the raw text if possible
        return {
          botContent: responseText.length > 500 ? 
            "I received a response but couldn't process it correctly." : 
            responseText,
          command: null
        };
      }
    } catch (error) {
      console.error("Error generating bot response:", error);
      return {
        botContent: "Sorry, I'm having difficulty processing your request right now.",
        command: null
      };
    }
  };

  return {
    generateBotResponse
  };
};
