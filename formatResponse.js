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

        // Send user input directly to AI and fetch response
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
