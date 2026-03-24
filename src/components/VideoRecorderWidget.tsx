'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Monitor, Mic, MicOff, Circle, Square, Pause, Play,
  Download, Trash2, Camera, X, CheckCircle2, Maximize2, AlertCircle, Clock, RefreshCw
} from 'lucide-react';

type RecordMode = 'camera' | 'screen' | 'screen+camera';
type RecordState = 'idle' | 'countdown' | 'recording' | 'paused' | 'stopped';

interface RecordingEntry {
  id: string;
  name: string;
  url: string;
  size: number;
  duration: number;
  mode: RecordMode;
  createdAt: Date;
  blob: Blob;
}

function formatTime(seconds: number): string {
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function VideoRecorderWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  // State
  const [mode, setMode] = useState<RecordMode>('screen+camera');
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [latestRecording, setLatestRecording] = useState<RecordingEntry | null>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingNameRef = useRef<string>('');
  
  // Refs for preview or PIP
  const pipVideoRef = useRef<HTMLVideoElement>(null);
  const playbackVideoRef = useRef<HTMLVideoElement>(null);

  // Cleanup
  useEffect(() => {
    return () => {
      cameraStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      if (latestRecording) URL.revokeObjectURL(latestRecording.url);
    };
  }, [latestRecording]);

  const beginCountdown = () => {
    setCountdown(3);
    setRecordState('countdown');
    let c = 3;
    const interval = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(interval);
        startActualRecording();
      }
    }, 1000);
  };

  const startActualRecording = async () => {
    chunksRef.current = [];
    setElapsedSeconds(0);
    setError(null);
    setLatestRecording(null);

    try {
      let finalStream: MediaStream;

      if (mode === 'camera') {
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: micEnabled });
        cameraStreamRef.current = camStream;
        finalStream = camStream;
        
        // Setup PIP
        if (pipVideoRef.current) {
          pipVideoRef.current.srcObject = camStream;
          pipVideoRef.current.muted = true;
        }

      } else if (mode === 'screen') {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true, // system audio
        });
        screenStreamRef.current = screenStream;
        
        if (micEnabled) {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          const audioTrack = micStream.getAudioTracks()[0];
          if (audioTrack) screenStream.addTrack(audioTrack);
        }
        finalStream = screenStream;
        screenStream.getVideoTracks()[0].addEventListener('ended', () => stopRecording());

      } else {
        // screen+camera
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        screenStreamRef.current = screenStream;
        
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: micEnabled });
        cameraStreamRef.current = camStream;
        
        if (pipVideoRef.current) {
          pipVideoRef.current.srcObject = camStream;
          pipVideoRef.current.muted = true;
        }

        const combinedTracks: MediaStreamTrack[] = [...screenStream.getVideoTracks()];
        const allAudio = [...screenStream.getAudioTracks(), ...camStream.getAudioTracks()];
        combinedTracks.push(...allAudio);
        finalStream = new MediaStream(combinedTracks);
        screenStream.getVideoTracks()[0].addEventListener('ended', () => stopRecording());
      }

      const mr = new MediaRecorder(finalStream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm',
      });
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => finalizeRecording();
      mediaRecorderRef.current = mr;
      mr.start(1000);

      setRecordState('recording');
      timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
      recordingNameRef.current = `Recording_${Date.now()}`;

    } catch (e: any) {
      setError(e.message || 'Failed to start recording. Please check permissions.');
      setRecordState('idle');
      
      cameraStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      cameraStreamRef.current = null;
      screenStreamRef.current = null;
    }
  };

  const finalizeRecording = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    
    setLatestRecording({
      id: Date.now().toString(),
      name: recordingNameRef.current,
      url, blob,
      size: blob.size,
      duration: elapsedSeconds,
      mode,
      createdAt: new Date(),
    });
    
    setRecordState('stopped');
    
    // Stop tracks
    cameraStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
    cameraStreamRef.current = null;
    screenStreamRef.current = null;
    if (pipVideoRef.current) pipVideoRef.current.srcObject = null;
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
  };

  const pauseResume = () => {
    if (!mediaRecorderRef.current) return;
    if (mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordState('paused');
    } else if (mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
      setRecordState('recording');
    }
  };

  const downloadRecording = () => {
    if (!latestRecording) return;
    const a = document.createElement('a');
    a.href = latestRecording.url;
    a.download = `${latestRecording.name}.webm`;
    a.click();
  };

  const isRecordingActive = recordState === 'recording' || recordState === 'paused' || recordState === 'countdown';

  return (
    <>
      {/* Floating Widget Button */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
        
        {/* PIP Video if Camera is active during recording */}
        {(mode === 'camera' || mode === 'screen+camera') && isRecordingActive && recordState !== 'countdown' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-48 aspect-video rounded-lg overflow-hidden border-2 border-white/20 shadow-sm bg-black"
          >
            <video ref={pipVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </motion.div>
        )}

        <AnimatePresence>
          {isOpen && !isRecordingActive && recordState !== 'stopped' && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="mb-2 bg-white rounded-lg shadow-sm border border-gray-100 w-80 overflow-hidden"
            >
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-3">
                  <Video size={16} className="text-blue-600" /> Site Recorder
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {error && (
                  <div className="flex gap-3 p-3 rounded-lg bg-red-50 text-red-600 text-xs">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Record</label>
                  <div className="grid grid-cols-1 gap-3 border bg-gray-50/50 p-1.5 rounded-lg">
                    {([
                      { id: 'screen+camera', label: 'Screen + Camera', icon: Maximize2 },
                      { id: 'screen', label: 'Screen Only', icon: Monitor },
                      { id: 'camera', label: 'Camera Only', icon: Camera },
                    ] as const).map(option => (
                      <button
                        key={option.id}
                        onClick={() => setMode(option.id as RecordMode)}
                        className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-all ${
                          mode === option.id ? 'bg-white shadow-sm text-blue-600 border border-gray-100' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <option.icon size={15} /> {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Microphone</label>
                  <button
                    onClick={() => setMicEnabled(!micEnabled)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      micEnabled ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-sm font-medium">
                      {micEnabled ? <Mic size={15} /> : <MicOff size={15} />}
                      {micEnabled ? 'Mic Enabled' : 'Mic Disabled'}
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-all relative ${micEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${micEnabled ? 'left-[18px]' : 'left-0.5'}`} />
                    </div>
                  </button>
                </div>

                <button
                  onClick={beginCountdown}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-red-600/20 transition-all"
                >
                  <Circle size={16} className="fill-white" /> Start Recording
                </button>
              </div>
            </motion.div>
          )}

          {recordState === 'stopped' && latestRecording && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="mb-2 bg-white rounded-lg shadow-sm border border-gray-100 w-80 overflow-hidden"
            >
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-green-600" /> Recording Saved
                </h3>
                <button onClick={() => { setRecordState('idle'); setIsOpen(false); }} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-200">
                  <video src={latestRecording.url} controls className="w-full h-full" />
                </div>
                <div className="text-sm text-gray-600 flex justify-between px-1">
                  <span>Duration: <strong>{formatTime(latestRecording.duration)}</strong></span>
                  <span>Size: <strong>{formatSize(latestRecording.size)}</strong></span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={downloadRecording}
                    className="flex-1 flex justify-center items-center gap-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Download size={15} /> Download
                  </button>
                  <button
                    onClick={() => setRecordState('idle')}
                    className="flex-1 flex justify-center items-center gap-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Trash2 size={15} /> Discard
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* FAB / Recording Control Bar */}
        <AnimatePresence mode="wait">
          {isRecordingActive ? (
            <motion.div
              key="active-controls"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 bg-gray-900 text-white p-2 border border-gray-700 rounded-lg shadow-sm"
            >
              {recordState === 'countdown' ? (
                <div className="flex items-center gap-3 px-4 font-bold text-red-500">
                  <RefreshCw size={16} className="animate-spin" /> Starting in {countdown}...
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-3">
                    {recordState === 'recording' ? (
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    ) : (
                      <Pause size={12} className="text-yellow-500 fill-yellow-500" />
                    )}
                    <span className="font-mono text-sm font-bold w-12">{formatTime(elapsedSeconds)}</span>
                  </div>
                  
                  <div className="h-5 w-px bg-gray-700" />
                  
                  <button
                    onClick={pauseResume}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors"
                    title={recordState === 'recording' ? "Pause" : "Resume"}
                  >
                    {recordState === 'recording' ? <Pause size={16} className="fill-white" /> : <Play size={16} className="fill-white" />}
                  </button>
                  <button
                    onClick={stopRecording}
                    className="w-10 h-10-lg-500 transition-colors"
                    title="Stop Recording"
                  >
                    <Square size={14} className="fill-current" />
                  </button>
                </>
              )}
            </motion.div>
          ) : (
            <motion.button
              key="fab"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="w-14 text-white rounded-lg shadow-sm shadow-blue-500/30 flex items-center justify-center relative hover:shadow-sm hover:shadow-blue-500/40 transition-all"
            >
              <Video size={24} className={isOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
