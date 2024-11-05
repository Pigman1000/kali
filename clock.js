// Function to get the current time as a formatted string
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString(); // Returns time in the default locale format
}

// Function to store the last user input time
function storeLastUserInputTime() {
    const lastInputTime = getCurrentTime();
    localStorage.setItem('lastUserInputTime', lastInputTime); // Store the last input time in local storage
}

// Function to retrieve the last user input time
function getLastUserInputTime() {
    return localStorage.getItem('lastUserInputTime') || "No previous input recorded."; // Retrieve or return a default message
}