const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'missing-key');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

// System prompt to set the persona
const SYSTEM_PROMPT = `
You are a helpful, professional, and empathetic AI health screening agent conducting a live intake call.
Your goal is to ask basic health screening questions one at a time to gather necessary information.
You should ask about:
1. Patient's name
2. Main concern or symptom
3. How long it's been going on (duration)
4. Severity (e.g., on a scale of 1-10)
5. Any other related symptoms

Guidelines:
- Ask only ONE question at a time.
- Keep your responses concise and conversational (like a real spoken call).
- Do not provide medical diagnoses or advice.
- Adapt to the user's answers. If they provide a vague answer, ask a clarifying question.
- If they have answered all core questions, let them know the screening is complete and you will generate a report, then politely end the conversation.
`;

/**
 * Gets the next AI response directly from an audio chunk using Gemini.
 * @param {Array} history - Array of Gemini message objects {role: 'user'|'model', parts: [{text: string}]}
 * @param {string} audioBase64 - Base64 encoded webm audio
 * @returns {Promise<{text: string, updatedHistory: Array}>}
 */
async function processAudioTurn(history, audioBase64) {
  // Gemini expects parts array
  const promptParts = [
    { text: SYSTEM_PROMPT },
    {
      inlineData: {
        mimeType: "audio/webm",
        data: audioBase64
      }
    }
  ];

  // We have to use the startChat session to maintain history easily, 
  // or manually format it. Let's use startChat.
  const chat = model.startChat({
    history: history,
    systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] } // Some models support this, or we just prepend to history.
  });

  // Wait, gemini-2.5-flash-lite supports systemInstruction
  const response = await chat.sendMessage([
    {
      inlineData: {
        mimeType: "audio/webm", // Usually works with webm from browser
        data: audioBase64
      }
    }
  ]);
  
  const text = response.response.text();
  
  // Return the new text and the updated history from the chat session
  const newHistory = await chat.getHistory();
  return { text, updatedHistory: newHistory };
}

/**
 * Initiates the chat history for a new call
 */
async function startCallSession() {
  const chat = model.startChat({
    systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] }
  });
  
  const response = await chat.sendMessage([{ text: "Introduce yourself as the AI intake assistant and ask for my name and main concern. Keep it brief." }]);
  const text = response.response.text();
  const history = await chat.getHistory();
  return { text, history };
}

/**
 * Generates a structured JSON health report from the conversation history.
 * @param {Array} history 
 * @returns {Promise<Object>}
 */
async function generateReport(history) {
  // Use a new model instance enforcing JSON schema for the report
  const reportModel = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash-lite',
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          patientName: { type: SchemaType.STRING, nullable: true },
          mainConcern: { type: SchemaType.STRING, nullable: true },
          duration: { type: SchemaType.STRING, nullable: true },
          severity: { type: SchemaType.STRING, nullable: true },
          relatedSymptoms: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          flags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          summary: { type: SchemaType.STRING }
        },
        required: ["summary"]
      }
    }
  });

  const chatTextHistory = history.map(h => `${h.role}: ${h.parts.map(p => p.text || '[audio snippet]').join(' ')}`).join('\n');
  
  const prompt = `Based on the following conversation history, generate a structured health report.\n\nConversation:\n${chatTextHistory}`;

  const response = await reportModel.generateContent(prompt);
  
  try {
    return JSON.parse(response.response.text());
  } catch (e) {
    console.error("Failed to parse report JSON", e);
    return { error: "Failed to generate structured report." };
  }
}

module.exports = {
  processAudioTurn,
  startCallSession,
  generateReport
};
