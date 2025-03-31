
/**
 * Generate a bot response based on user message
 * This hook makes an API call to get a response from the agent
 */
export const useBotResponseGenerator = () => {
  const generateBotResponse = async (message: string) => {
    try {
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
      
      const data = await response.json();
      return {
        botContent: data.message || data.response || "Je n'ai pas compris votre demande.",
        command: data.command || null
      };
    } catch (error) {
      console.error("Error generating bot response:", error);
      return {
        botContent: "Désolé, je rencontre des difficultés à traiter votre demande en ce moment.",
        command: null
      };
    }
  };

  return {
    generateBotResponse
  };
};
