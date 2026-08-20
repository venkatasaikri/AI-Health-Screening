import React from 'react';
import { FileText, Clock, AlertCircle, Activity, User, RotateCcw } from 'lucide-react';

export default function ReportView({ report, onRestart }) {
  if (!report) return null;

  if (report.error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-100 mb-2">Report Generation Failed</h2>
        <p className="text-slate-400 mb-6">{report.error}</p>
        <button 
          onClick={onRestart}
          className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-full transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Start New Screening
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-4">
          <FileText className="w-6 h-6 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Intake Report Summary</h2>
        <p className="text-slate-400 mt-2 max-w-lg mx-auto">{report.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
          <div className="flex items-center gap-2 text-slate-300 mb-2">
            <User className="w-4 h-4" />
            <span className="font-medium text-sm">Patient Name</span>
          </div>
          <p className="text-lg font-semibold">{report.patientName || 'Not provided'}</p>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
          <div className="flex items-center gap-2 text-slate-300 mb-2">
            <Activity className="w-4 h-4" />
            <span className="font-medium text-sm">Main Concern</span>
          </div>
          <p className="text-lg font-semibold">{report.mainConcern || 'Not specified'}</p>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
          <div className="flex items-center gap-2 text-slate-300 mb-2">
            <Clock className="w-4 h-4" />
            <span className="font-medium text-sm">Duration</span>
          </div>
          <p className="text-lg font-semibold">{report.duration || 'Not specified'}</p>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
          <div className="flex items-center gap-2 text-slate-300 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium text-sm">Severity</span>
          </div>
          <p className="text-lg font-semibold">{report.severity || 'Not specified'}</p>
        </div>
      </div>

      {report.relatedSymptoms && report.relatedSymptoms.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Related Symptoms</h3>
          <div className="flex flex-wrap gap-2">
            {report.relatedSymptoms.map((symptom, idx) => (
              <span key={idx} className="bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full border border-blue-500/30">
                {symptom}
              </span>
            ))}
          </div>
        </div>
      )}

      {report.flags && report.flags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Flags / Follow-up</h3>
          <ul className="space-y-2">
            {report.flags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2 text-amber-300 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center pt-6 border-t border-slate-700">
        <button 
          onClick={onRestart}
          className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-full shadow transition-all hover:scale-105"
        >
          Done
        </button>
      </div>
    </div>
  );
}
