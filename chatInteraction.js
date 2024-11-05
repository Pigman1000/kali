// Function to get current time
function getCurrentTime() {
    return new Date().toLocaleString(); // Return the current time formatted as needed
}

// Function to fetch AI configuration
async function fetchAIConfig() {
    try {
        const response = await fetch('ai_config.json'); // Change to JSON file
        if (!response.ok) {
            throw new Error(`Failed to fetch AI config: ${response.status}`);
        }
        
        const config = await response.json(); // Parse JSON directly
        
        // Add current time to the config
        config.Time = getCurrentTime(); // Get the current time

        return config; // Return the parsed configuration
    } catch (error) {
        console.error("Error fetching AI config:", error);
        alert("Failed to load AI config.");
        return null; // Return null to handle errors gracefully
    }
}

// DOMContentLoaded event to fetch and log AI config
document.addEventListener('DOMContentLoaded', async () => {
    const aiConfig = await fetchAIConfig(); // Call the fetchAIConfig function

    if (aiConfig) {
        const { Name, Purpose, ['Additional Details']: additionalDetails, ['Last User Input Time']: lastUserInputTime, Time } = aiConfig;

        console.log(`AI Name: ${Name}`);
        console.log(`Purpose: ${Purpose}`);
        console.log(`Additional Details: ${additionalDetails}`);
        console.log(`Current Time: ${Time}`);
        console.log(`Last User Input Time: ${lastUserInputTime}`);
    } else {
        console.log("AI configuration is not available.");
    }
});
