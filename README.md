# Gemini AI Chatbot

This is a versatile chatbot application built with React and TypeScript, powered by the Google Gemini API. It allows users to switch between different AI personas (Tools) like a general assistant, a code generator, and a creative writer, each with its own system instruction to guide its responses.

The user interface is designed to be clean, responsive, and intuitive, featuring a sidebar for tool selection and a real-time chat window with streaming responses from the AI.

## Features

-   **Multiple AI Personas:** Switch between different "Tools" to change the chatbot's behavior and expertise.
-   **Streaming Responses:** AI responses are streamed in real-time for a more dynamic user experience.
-   **Typing Indicator:** A visual indicator shows when the AI is preparing a response.
-   **Markdown Support:** The chat displays formatted code blocks and bold text.
-   **Responsive Design:** The layout is optimized for both desktop and mobile devices.
-   **Zero-Build Deployment:** Runs directly in the browser using ES modules, requiring no build step.

## Deployment on Render

This project is configured for easy deployment as a **Static Site** on [Render](https://render.com/).

### Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  A [Render](https://render.com/) account.
3.  A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Deployment Steps

1.  **Push to GitHub:**
    Create a new repository on your GitHub account and push all the files from this project (`.tsx`, `.html`, `.ts`, `render.yaml`, etc.) to it.

2.  **Create a New Static Site on Render:**
    -   Log in to your Render dashboard.
    -   Click the **"New +"** button and select **"Static Site"**.
    -   Connect your GitHub account and select the repository you just created.
    -   Render will ask you to confirm the settings. The `render.yaml` file should pre-fill them, but ensure they are correct:
        -   **Name:** Give your site a name (e.g., `gemini-ai-chatbot`).
        -   **Build Command:** Leave this blank.
        -   **Publish Directory:** `.` (the root directory).

3.  **Add Your API Key:**
    -   This is the most important step. The application needs your Gemini API key to function.
    -   Go to the **"Environment"** tab for your new service.
    -   Click **"Add Environment Variable"**.
    -   Enter `API_KEY` for the **Key** and paste your Google Gemini API key into the **Value** field.
    -   **Important:** Render keeps this key secure and makes it available to your application.

4.  **Deploy:**
    -   Click the **"Create Static Site"** button.
    -   Render will deploy your application. After a minute or two, your chatbot will be live on the URL provided by Render!

Your site is now set up with continuous deployment. Any time you push new changes to your GitHub repository's main branch, Render will automatically redeploy the updated version.
