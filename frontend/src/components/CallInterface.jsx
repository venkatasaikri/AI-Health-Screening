import React, { useEffect } from 'react';
import { Mic, Square, PhoneOff } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

export default function CallInterface({ onEndCall, onAudioReady, aiResponse }) {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder(onAudioReady);

  // Play AI text using browser's native SpeechSynthesis API
  useEffect(() => {
    if (aiResponse?.text) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(aiResponse.text);
      // Optional: pick a specific voice if desired
      // const voices = window.speechSynthesis.getVoices();
      // utterance.voice = voices.find(v => v.lang === 'en-US') || voices[0];
      window.speechSynthesis.speak(utterance);
    }
  }, [aiResponse]);

  // Clean up speech synthesis when component unmounts (e.g. call ends)
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative mb-12">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-colors duration-300 ${
          isRecording ? 'bg-red-500/20' : 'bg-blue-500/10'
        }`}>
          {isRecording && <div className="absolute inset-0 rounded-full animate-pulse-ring" />}
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-transform transform hover:scale-105 z-10 ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-10 h-10" />}
          </button>
        </div>
      </div>

      <div className="text-center mb-8 min-h-[4rem]">
        <h3 className="text-lg font-medium text-slate-200 mb-2">
          {isRecording ? 'Listening...' : 'Tap the microphone to speak'}
        </h3>
        {aiResponse?.text && !isRecording && (
          <p className="text-slate-400 text-sm max-w-md mx-auto italic">
            "{aiResponse.text}"
          </p>
        )}
      </div>

      <button
        onClick={onEndCall}
        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-red-400 font-medium py-2 px-6 rounded-full transition-colors"
      >
        <PhoneOff className="w-4 h-4" />
        End Call
      </button>
    </div>
  );
}
