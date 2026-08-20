import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://ai-health-screening-24ea.onrender.com';

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('ai_text_response', (data) => {
      setAiResponse(prev => ({ ...prev, text: data.text }));
    });

    newSocket.on('ai_audio_response', (data) => {
      setAiResponse(prev => ({ ...prev, audio: data.audio }));
    });

    newSocket.on('call_report', (data) => {
      setReport(data.report);
    });

    newSocket.on('call_error', (data) => {
      setError(data.message);
    });

    return () => newSocket.close();
  }, []);

  const startCall = () => {
    setReport(null);
    setError(null);
    setAiResponse(null);
    if (socket) socket.emit('start_call');
  };

  const endCall = () => {
    if (socket) socket.emit('end_call');
  };

  const sendAudioChunk = (base64Audio) => {
    if (socket) socket.emit('audio_chunk', { audio: base64Audio });
  };

  return { socket, isConnected, report, error, aiResponse, startCall, endCall, sendAudioChunk };
}
