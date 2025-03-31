
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
        console.log("Parsed response from API:", data);
        
        // Handle the new response format which uses "output" field
        if (data.output) {
          // Extract potential command from the output if present
          let command = null;
          
          // Check if there's command information in the response
          if (data.command) {
            command = {
              text: String(data.command.text || ''),
              description: String(data.command.description || ''),
              risk: ['low', 'medium', 'high'].includes(data.command.risk) 
                ? data.command.risk 
                : 'medium'
            };
          }
          
          return {
            botContent: data.output, // Contains markdown formatting
            command: command
          };
        }
        
        // Fallback to the previous format handling
        // Ensure command is properly formatted if it exists
        let command = null;
        if (data.command) {
          command = {
            text: String(data.command.text || ''),
            description: String(data.command.description || ''),
            risk: ['low', 'medium', 'high'].includes(data.command.risk) 
              ? data.command.risk 
              : 'medium'
          };
        }
        
        return {
          botContent: data.message || data.response || "I didn't understand your request.",
          command: command
        };
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        return {
          botContent: "An error occurred while processing your request.",
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
