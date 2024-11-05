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

// Function to fetch AI response
async function fetchResponse(question, aiName, additionalDetails) {
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions'; // Updated API URL
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, // Get API key from environment variables
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Updated model name
                messages: [
                    {
                        role: "user",
                        content: question // User's question content
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data); // Log the entire response for debugging

        // Check if data.choices and content are as expected
        if (data.choices && data.choices.length > 0) {
            const content = data.choices[0]?.message?.content || "No response.";
            return formatResponseText(content); // Format the AI response
        } else {
            console.error("Unexpected response structure:", data);
            return "No valid response received from the AI.";
        }
    } catch (error) {
        console.error("Error fetching response:", error);
        return "Error retrieving response."; // Provide user feedback on error
    }
}

// Function to send input to AI
async function sendToAI(message, aiConfig) {
    const now = new Date();
    const currentTime = now.toLocaleTimeString(); // Current time as a string

    // Prepare the input object for the AI
    const aiInput = {
        message: message,
        time: currentTime,
        aiName: aiConfig?.Name,
        additionalDetails: aiConfig?.['Additional Details'],
        lastInputTime: lastUserInputTime // Include the last user input time
    };

    console.log('AI Input:', aiInput); // Debugging log
    const chatbotResponse = await fetchResponse(message, aiInput.aiName, aiInput.additionalDetails);
    return chatbotResponse;
}

// Event listener for button click
document.getElementById('send-button').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value.trim();
    const messagesDiv = document.getElementById('messages');

    if (userInput) {
        // Create and append user message element
        const userMessageElement = document.createElement('p');
        userMessageElement.className = 'user-message';
        userMessageElement.innerHTML = `${userInput}`;
        messagesDiv.appendChild(userMessageElement);
        
        // Scroll to the bottom of the messages
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        document.getElementById('user-input').value = ''; // Clear input field

        // Update lastUserInputTime with the current time
        lastUserInputTime = getCurrentTimeString();

        showThinkingAnimation();

        const aiConfig = await fetchAIConfig(); // Fetch AI configuration

        // Send user input directly to AI
        const chatbotResponse = await sendToAI(userInput, aiConfig);

        hideThinkingAnimation();

        // Create and append chatbot response element
        const chatbotMessageElement = document.createElement('div');
        chatbotMessageElement.className = 'chatbot-message';
        chatbotMessageElement.innerHTML = `
            <div class="chatbot-response">
                <span class="ai-logo"></span>
                <span>${chatbotResponse}</span>
            </div>
        `;
        messagesDiv.appendChild(chatbotMessageElement);
        
        // Scroll to the bottom of the messages
        messagesDiv.scrollTop = messagesDiv.scrollHeight; 
    }
});
