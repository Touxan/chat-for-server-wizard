
/**
 * Generate a bot response based on user message
 * This hook extracts the AI response logic from the useChatMessages hook
 */
export const useBotResponseGenerator = () => {
  const generateBotResponse = (message: string) => {
    let botContent = "";
    let command = null;
    
    if (message.toLowerCase().includes("restart") || message.toLowerCase().includes("redémarrer")) {
      botContent = "I can help you restart your server. Here's the command I recommend:";
      command = {
        text: "sudo systemctl restart nginx",
        description: "This command will restart the NGINX web server without affecting other services.",
        risk: "low" as const,
      };
    } else if (message.toLowerCase().includes("update") || message.toLowerCase().includes("mise à jour")) {
      botContent = "I can help you update your system. Here's the recommended command:";
      command = {
        text: "sudo apt update && sudo apt upgrade -y",
        description: "This command will update the package list and upgrade all installed packages to their latest versions.",
        risk: "medium" as const,
      };
    } else if (message.toLowerCase().includes("delete") || message.toLowerCase().includes("supprimer")) {
      botContent = "I understand that you want to delete something. Please be careful with this command:";
      command = {
        text: "sudo rm -rf /var/log/old_logs/",
        description: "This command will recursively delete all files in the old_logs directory. Make sure you no longer need these files.",
        risk: "high" as const,
      };
    } else {
      botContent = "I'm analyzing your request. Could you provide more details about what you'd like to do with your Scaleway servers?";
    }
    
    return { botContent, command };
  };

  return {
    generateBotResponse,
  };
};
