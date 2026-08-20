const {
  processAudioTurn,
  startCallSession,
  generateReport
} = require('./services/ai');

// Store active conversations in memory
// Key: socket.id, Value: Array of Gemini message objects
const activeCalls = new Map();

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('start_call', async () => {
      console.log(`Call started by ${socket.id}`);
      
      try {
        const { text, history } = await startCallSession();
        activeCalls.set(socket.id, history);
        
        // Since we are using browser TTS, we only need to emit text
        socket.emit('ai_text_response', { text });
      } catch (error) {
        console.error("Error starting call:", error);
        socket.emit('call_error', { message: 'Failed to start call. Ensure Gemini API key is valid.' });
      }
    });

    socket.on('audio_chunk', async (data) => {
      console.log(`Received audio chunk from ${socket.id}`);
      
      const history = activeCalls.get(socket.id);
      if (!history) {
        socket.emit('call_error', { message: 'No active call found.' });
        return;
      }

      try {
        const { text, updatedHistory } = await processAudioTurn(history, data.audio);
        console.log(`AI Response (${socket.id}): ${text}`);
        
        activeCalls.set(socket.id, updatedHistory);

        // Tell client to transcribe locally via TTS
        socket.emit('ai_text_response', { text });

      } catch (error) {
        console.error("Error processing audio chunk:", error);
        socket.emit('call_error', { message: 'An error occurred while processing your audio with Gemini.' });
      }
    });

    socket.on('end_call', async () => {
      console.log(`Call ended by ${socket.id}`);
      const history = activeCalls.get(socket.id);
      
      if (history && history.length > 0) {
        try {
          const report = await generateReport(history);
          socket.emit('call_report', { report });
        } catch (error) {
          console.error("Error generating report:", error);
          socket.emit('call_error', { message: 'Failed to generate report.' });
        }
      } else {
        socket.emit('call_report', { 
          report: { error: "Call was empty or context lost." } 
        });
      }

      activeCalls.delete(socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      activeCalls.delete(socket.id);
    });
  });
}

module.exports = setupSocketHandlers;
