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
 * Fetches AI response from the Hugging Face API.
 *
 * @param {string} question - User's question.
 * @param {string} aiName - AI's name.
 * @param {string} additionalDetails - Additional AI details.
 * @param {string} currentTime - Current time.
 * @param {string} lastInputTime - Last user input time.
 * @returns {string} Formatted AI response.
 */
async function fetchResponse(question, aiName, additionalDetails, currentTime, lastInputTime) {
    const apiUrl = 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct/v1/chat/completions'; // Actual API URL

    try {
        const inputTokens = countTokens(question) + countTokens(additionalDetails);
        const maxTotalTokens = 1000; // Maximum total tokens (input + output)
        const maxOutputTokens = Math.max(0, maxTotalTokens - inputTokens); // Calculate remaining tokens for output

        console.log(`Input tokens: ${inputTokens}, Output tokens allowed: ${maxOutputTokens}`); // Debugging log

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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', // Ensure to keep your token secure
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "meta-llama/Llama-3.2-3B-Instruct",
                messages: [
                    {
                        role: "system",
                        content: `You are an AI named ${aiName}. ${additionalDetails}. The current time is ${currentTime}. The last user input was at ${lastInputTime}.`
                    },
                    {
                        role: "user",
                        content: question
                    }
                ],
                max_tokens: maxOutputTokens // Set max tokens for output dynamically
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