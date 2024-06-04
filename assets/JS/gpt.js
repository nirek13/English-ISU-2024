// Function to display a message

// node --version # Should be >= 18
// npm install @google/generative-ai

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = "AIzaSyCJdO0htiBNMkAFQOEsg2PCEypb46KhEFA";

function displayMessage(message, role) {
    // Select the chat-messages element
    const chatMessages = document.getElementById('chat-messages');

    // Create a new div element
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message'); // Add a class to style the message

    // Set the inner HTML of the div to the message content
    messageDiv.innerHTML = `
        <div class="message-content ${role === 'user' ? 'user-message' : 'bot-message'}">
            <p>${message}</p>
        </div>
    `;

    // Append the message div to the chat-messages element
    chatMessages.appendChild(messageDiv);

    // Scroll to the bottom of the chat-messages element to show the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send message to OpenAI API
async function sendMessage() {
    const inputField = document.getElementById("message-input");
    const message = inputField.value.trim();

    if (message === "") {
        console.log("message empty");
        return; // If the message is empty, do nothing
    }

    // Display user message in chat window
    displayMessage(message, "user");

    try {
        // Send user message to OpenAI API
        const openai = new OpenAI();
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant answering questions about a kid named nirek." }, { role: "user", content: message }],
            model: "gpt-3.5-turbo",
        });

        // Extract the response from the completion
        const response = completion.choices[0].message.content;

        // Display bot response in chat window
        displayMessage(response, "bot");
    } catch (error) {
        console.error("Error sending message to OpenAI API:", error);
        displayMessage("Sorry, something went wrong. Please try again later.", "bot");
    }

    // Clear input field after sending message
    inputField.value = "";
}

async function run() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const inputField = document.getElementById("message-input");
    const message = inputField.value.trim();

    if (message === "") {
        console.log("message empty");
        return; // If the message is empty, do nothing
    }

    // Display user message in chat window
    displayMessage(message, "user");
    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ];

    const parts = [
        {text: message},
    ];

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
    });

    const response = result.response;
    console.log(response.text());
    inputField.value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    // Add event listener to the button
    document.getElementById("send-message-btn").addEventListener("click", run);
    console.log("loaded");
});