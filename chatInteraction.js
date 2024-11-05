let thinkingInterval;
let lastUserInputTime = null; // Stores the last user input time

// Function to get the current time as a string
function getCurrentTimeString() {
    const now = new Date();
    return now.toISOString(); // ISO format, e.g., "2023-10-31T14:48:00.000Z"
}

function showThinkingAnimation() {
    const thinkingContainer = document.getElementById('thinking-container');
    thinkingContainer.style.display = 'block';

    const thinkingText = document.getElementById('thinking-text');
    let dotCount = 0;
    thinkingInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        thinkingText.textContent = 'Thinking' + '.'.repeat(dotCount);
    }, 500);
}

function hideThinkingAnimation() {
    clearInterval(thinkingInterval);
    const thinkingContainer = document.getElementById('thinking-container');
    thinkingContainer.style.display = 'none';
}

async function sendToAI(message, aiConfig) {
    const now = new Date();
    const currentTime = now.toLocaleTimeString(); // Current time as a string

    // Prepare the input object for the AI
    const aiInput = {
        message: message,
        time: currentTime, // Current time of the message
        aiName: aiConfig?.Name,
        additionalDetails: aiConfig?.['Additional Details'],
        lastInputTime: lastUserInputTime // Include the last user input time
    };

    const chatbotResponse = await fetchResponse(message, aiInput.aiName, aiInput.additionalDetails);
    return chatbotResponse;
}

document.getElementById('send-button').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value.trim();
    const messagesDiv = document.getElementById('messages');

    if (userInput) {
        const userMessageElement = document.createElement('p');
        userMessageElement.className = 'user-message';
        userMessageElement.innerHTML = `${userInput}`; 
        messagesDiv.appendChild(userMessageElement);
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        document.getElementById('user-input').value = ''; // Clear input field

        // Update lastUserInputTime with the current time
        lastUserInputTime = getCurrentTimeString();

        showThinkingAnimation();

        const aiConfig = await fetchAIConfig(); // Fetch AI configuration
        
        // Send user input directly to AI
        const chatbotResponse = await sendToAI(userInput, aiConfig);

        hideThinkingAnimation();

        const chatbotMessageElement = document.createElement('div');
        chatbotMessageElement.className = 'chatbot-message';
        chatbotMessageElement.innerHTML = `
            <div class="chatbot-response">
                <span class="ai-logo"></span>
                <span>${chatbotResponse}</span>
            </div>
        `;
        messagesDiv.appendChild(chatbotMessageElement);
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
    }
});