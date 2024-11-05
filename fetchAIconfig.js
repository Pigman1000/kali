// Function to get current time
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString(); // You can format the time as needed
}

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

document.addEventListener('DOMContentLoaded', async () => {
    const aiConfig = await fetchAIConfig();

    if (aiConfig) {
        console.log(`AI Name: ${aiConfig.Name}`);
        console.log(`Purpose: ${aiConfig.Purpose}`);
        console.log(`Additional Details: ${aiConfig['Additional Details']}`);
        console.log(`Current Time: ${aiConfig.Time}`);
        console.log(`Last User Input Time: ${aiConfig['Last User Input Time']}`);
    } else {
        console.log("AI configuration is not available.");
    }
});