/**
 * Formats AI response text into a standard format.
 *
 * @param {string} content - AI response text.
 * @returns {string} Formatted content.
 */
function formatResponseText(content) {
    // Remove leading/trailing whitespace
    let formattedContent = content.trim();

    // Add line breaks for numbered points
    formattedContent = formattedContent.replace(/(\d+)\.\s/g, '<br><strong>$1.</strong> ');

    // Bold double asterisk text
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italicize single asterisk text
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Add paragraphs for blank lines
    formattedContent = formattedContent.replace(/\n\s*\n/g, '<br><br>');

    return formattedContent;
}

/**
 * Counts tokens in a string based on a simple word split. 
 * Adjust this function to match the model's tokenization if needed.
 *
 * @param {string} text - Text to count tokens for.
 * @returns {number} Count of tokens.
 */
function countTokens(text) {
    // This is a basic approximation. The actual LLaMA tokenizer may differ.
    return text.split(/\s+/).filter(Boolean).length; // Filter out empty strings
}

/**
 * Fetches AI response from the Groq API.
 *
 * @param {string} question - User's question.
 * @param {string} aiName - AI's name.
 * @param {string} additionalDetails - Additional AI details.
 * @param {string} currentTime - Current time.
 * @param {string} lastInputTime - Last user input time.
 * @returns {string} Formatted AI response.
 */
async function fetchResponse(question, aiName, additionalDetails, currentTime, lastInputTime) {
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
