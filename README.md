# AI Health Screening Voice Agent

A web application that allows users to have a live voice conversation with an AI agent for health screening. 
The AI acts as an intake assistant, asking basic health questions one at a time. After the call ends, a structured health report summarizing the conversation is generated and displayed.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **AI Services**: OpenAI (Whisper for STT, GPT-4o-mini for LLM, TTS-1 for Text-to-Speech)

## Features
- **Push-to-Talk Interface**: Clean and intuitive microphone button for users to speak their turn.
- **Real-time Communication**: Uses WebSockets to stream audio and text between the client and server.
- **Adaptive AI**: The AI is prompted to ask one question at a time and adapt to user responses.
- **Structured Report Generation**: Uses OpenAI's JSON mode to generate a concise summary report once the call ends.
- **Graceful Failure Handling**: Short or interrupted calls are handled smoothly, and STT failures prompt the user to try again.

## Prerequisites
- Node.js (v18 or higher recommended)
- An active OpenAI API key with access to Whisper, GPT-4o-mini, and TTS.

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or
   node server.js
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 3. Usage
1. Open your browser to `http://localhost:5173` (or the port Vite provides).
2. Click **Start Call**.
3. Tap the microphone button to start recording, speak your symptoms, and tap again to stop and send the audio.
4. Listen to the AI's response and repeat the process.
5. Once you are done, click **End Call** to view the generated structured health report.

## Future Improvements
- **Continuous Listening / VAD**: Moving from a push-to-talk model to a continuous WebSocket/WebRTC stream using Voice Activity Detection (VAD) for a more natural flow.
- **Barge-in Support**: Allowing the user to interrupt the AI while it is speaking.
- **Language Detection**: Adding robust multi-lingual support and automatic detection in the STT pipeline.
