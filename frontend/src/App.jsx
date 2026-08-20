import React, { useState } from 'react';
import CallInterface from './components/CallInterface';
import ReportView from './components/ReportView';
import { useSocket } from './hooks/useSocket';
import { Stethoscope } from 'lucide-react';

function App() {
  const { socket, isConnected, report, error, aiResponse, startCall, endCall, sendAudioChunk } = useSocket();
  const [callStatus, setCallStatus] = useState('idle'); // idle, active, finished

  const handleStartCall = () => {
    startCall();
    setCallStatus('active');
  };

  const handleEndCall = () => {
    endCall();
    setCallStatus('finished');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
        
        {/* Header */}
        <div className="p-6 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Stethoscope className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-xl font-bold">AI Health Screening</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">System:</span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? 'Connected' : 'Disconnected'} />
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 mx-6 mt-6 rounded-r">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6">
          {callStatus === 'idle' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Start your intake screening</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Have a live voice conversation with our AI assistant to detail your symptoms before seeing a doctor.
              </p>
              <button 
                onClick={handleStartCall}
                disabled={!isConnected}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnected ? 'Start Call' : 'Connecting to Server...'}
              </button>
            </div>
          )}

          {callStatus === 'active' && (
            <CallInterface 
              onEndCall={handleEndCall} 
              onAudioReady={sendAudioChunk}
              aiResponse={aiResponse}
            />
          )}

          {callStatus === 'finished' && report && (
            <ReportView report={report} onRestart={() => setCallStatus('idle')} />
          )}

          {callStatus === 'finished' && !report && !error && (
            <div className="text-center py-12 animate-pulse">
              <p className="text-slate-400">Generating health report...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
