'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Monitor, Mic, MicOff, Circle, Square, Pause, Play,
  Download, Trash2, ChevronLeft, Camera, RefreshCw, AlertCircle,
  CheckCircle2, Clock, Film, Settings, Maximize2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRANDING } from '@/lib/config';

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
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function RecorderPage() {
  const router = useRouter();

  // State
  const [mode, setMode] = useState<RecordMode>('camera');
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const [recordings, setRecordings] = useState<RecordingEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<'720p' | '1080p'>('720p');
  const [activeTab, setActiveTab] = useState<'recorder' | 'library'>('recorder');
  const [previewRecording, setPreviewRecording] = useState<RecordingEntry | null>(null);

  // Refs
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingNameRef = useRef<string>('');

  // Init camera preview
  const startCameraPreview = useCallback(async () => {
    try {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
      }
      const constraints: MediaStreamConstraints = {
        video: { width: selectedQuality === '1080p' ? 1920 : 1280, height: selectedQuality === '1080p' ? 1080 : 720, facingMode: 'user' },
        audio: micEnabled,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      cameraStreamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.muted = true;
      }
      setCameraReady(true);
      setError(null);
    } catch (e: any) {
      setError('Camera/Microphone access denied. Please allow permissions and try again.');
      setCameraReady(false);
    }
  }, [micEnabled, selectedQuality]);

  useEffect(() => {
    if (mode === 'camera' || mode === 'screen+camera') {
      startCameraPreview();
    } else {
      // Screen only — stop camera
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
        cameraStreamRef.current = null;
        if (liveVideoRef.current) liveVideoRef.current.srcObject = null;
      }
      setCameraReady(mode === 'screen'); // screen mode doesn't need camera to be ready
    }
    return () => {};
  }, [mode]);

  // Cleanup
  useEffect(() => {
    return () => {
      cameraStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      recordings.forEach(r => URL.revokeObjectURL(r.url));
    };
  }, []);

  const stopAllStreams = () => {
    cameraStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
  };

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

    try {
      let finalStream: MediaStream;

      if (mode === 'camera') {
        if (!cameraStreamRef.current) throw new Error('No camera stream');
        // Re-apply mic setting
        const audioTracks = cameraStreamRef.current.getAudioTracks();
        audioTracks.forEach(t => { t.enabled = micEnabled; });
        finalStream = cameraStreamRef.current;

      } else if (mode === 'screen') {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { width: 1920, height: 1080 } as any,
          audio: true,
        });
        screenStreamRef.current = screenStream;
        // Add mic audio
        if (micEnabled) {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          const audioTrack = micStream.getAudioTracks()[0];
          if (audioTrack) screenStream.addTrack(audioTrack);
        }
        // Show screen in preview
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = screenStream;
          liveVideoRef.current.muted = true;
        }
        finalStream = screenStream;
        screenStream.getVideoTracks()[0].addEventListener('ended', () => stopRecording());

      } else {
        // screen+camera
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { width: 1920, height: 1080 } as any,
          audio: true,
        });
        screenStreamRef.current = screenStream;
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = screenStream;
          liveVideoRef.current.muted = true;
        }
        // Camera PIP
        if (!cameraStreamRef.current) {
          const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: micEnabled });
          cameraStreamRef.current = camStream;
        }
        if (pipVideoRef.current) {
          pipVideoRef.current.srcObject = cameraStreamRef.current;
          pipVideoRef.current.muted = true;
        }
        // Merge with AudioContext canvas for combined stream
        const combinedTracks: MediaStreamTrack[] = [
          ...screenStream.getVideoTracks(),
        ];
        // Add audio
        const allAudio = [...screenStream.getAudioTracks()];
        if (micEnabled && cameraStreamRef.current) {
          allAudio.push(...cameraStreamRef.current.getAudioTracks());
        }
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
      recordingNameRef.current = `Recording ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`;

    } catch (e: any) {
      setError(e.message || 'Failed to start recording. Please check permissions.');
      setRecordState('idle');
      // Re-init camera
      if (mode === 'camera' || mode === 'screen+camera') startCameraPreview();
    }
  };

  const finalizeRecording = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const entry: RecordingEntry = {
      id: Date.now().toString(),
      name: recordingNameRef.current,
      url, blob,
      size: blob.size,
      duration: elapsedSeconds,
      mode,
      createdAt: new Date(),
    };
    setRecordings(prev => [entry, ...prev]);
    setRecordState('stopped');
    // Reset preview to camera
    if (mode !== 'camera') {
      screenStreamRef.current = null;
      if (liveVideoRef.current) liveVideoRef.current.srcObject = null;
      if (mode === 'screen+camera') startCameraPreview();
    } else {
      startCameraPreview();
    }
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

  const downloadRecording = (rec: RecordingEntry) => {
    const a = document.createElement('a');
    a.href = rec.url;
    a.download = `${rec.name.replace(/[^a-z0-9]/gi, '_')}.webm`;
    a.click();
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => {
      const rec = prev.find(r => r.id === id);
      if (rec) URL.revokeObjectURL(rec.url);
      return prev.filter(r => r.id !== id);
    });
    if (previewRecording?.id === id) setPreviewRecording(null);
  };

  const resetToIdle = () => {
    setRecordState('idle');
    setElapsedSeconds(0);
    if (mode === 'camera' || mode === 'screen+camera') startCameraPreview();
  };

  const isRecordingActive = recordState === 'recording' || recordState === 'paused';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* NAV */}
      <nav className="border-b border-white/10 bg-white/5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="w-px h-5 bg-white/20" />
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {BRANDING.shortName}
            </div>
            <span className="font-bold text-white tracking-tight">{BRANDING.name}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <div className="w-2 h-2 bg-red-400 rounded-full" />
            <span className="text-xs font-semibold text-red-300 uppercase tracking-wider">Video Recorder</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('recorder')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'recorder' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <span className="flex items-center gap-3"><Video size={15} /> Recorder</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'library' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Film size={15} />
            Library
            {recordings.length > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{recordings.length}</span>
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {activeTab === 'recorder' ? (
          <motion.div
            key="recorder"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="max-w-6xl mx-auto py-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEFT — Settings Panel */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-white mb-1">Recording Setup</h2>
                  <p className="text-sm text-gray-400">Configure your recording before you start.</p>
                </div>

                {/* Mode Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recording Mode</label>
                  {([
                    { key: 'camera', label: 'Camera Only', desc: 'Record from your webcam', icon: Camera },
                    { key: 'screen', label: 'Screen Only', desc: 'Record your entire screen', icon: Monitor },
                    { key: 'screen+camera', label: 'Screen + Camera', desc: 'Screen with webcam overlay', icon: Maximize2 },
                  ] as { key: RecordMode; label: string; desc: string; icon: React.ElementType }[]).map(({ key, label, desc, icon: Icon }) => (
                    <button
                      key={key}
                      disabled={isRecordingActive}
                      onClick={() => setMode(key)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        mode === key
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${mode === key ? 'bg-blue-600' : 'bg-white/10'}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                      </div>
                      {mode === key && <CheckCircle2 size={16} className="text-blue-400 ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>

                {/* Audio */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Audio</label>
                  <button
                    disabled={isRecordingActive}
                    onClick={() => setMicEnabled(m => !m)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      micEnabled ? 'border-green-500/40 bg-green-500/10' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    {micEnabled ? <Mic size={18} className="text-green-400" /> : <MicOff size={18} className="text-gray-400" />}
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">{micEnabled ? 'Microphone On' : 'Microphone Off'}</p>
                      <p className="text-xs text-gray-400">Click to toggle</p>
                    </div>
                    <div className={`ml-auto w-10 h-5 rounded-full transition-all relative ${micEnabled ? 'bg-green-500' : 'bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${micEnabled ? 'left-5' : 'left-0.5'}`} />
                    </div>
                  </button>
                </div>

                {/* Quality */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Video Quality</label>
                  <div className="flex gap-3">
                    {(['720p', '1080p'] as const).map(q => (
                      <button
                        key={q}
                        disabled={isRecordingActive}
                        onClick={() => setSelectedQuality(q)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all disabled:opacity-40 ${
                          selectedQuality === q ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recordings count hint */}
                {recordings.length > 0 && (
                  <button
                    onClick={() => setActiveTab('library')}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-left hover:bg-purple-500/15 transition-colors"
                  >
                    <Film size={18} className="text-purple-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">{recordings.length} Recording{recordings.length !== 1 ? 's' : ''} saved</p>
                      <p className="text-xs text-purple-300">Click to view library</p>
                    </div>
                  </button>
                )}
              </div>

              {/* CENTER + RIGHT — Preview + Controls */}
              <div className="lg:col-span-2 space-y-6">

                {/* Error banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-red-500/15 border border-red-500/30"
                    >
                      <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300">{error}</p>
                      <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-white">✕</button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Video preview */}
                <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-white/10 aspect-video">
                  
                  {/* Main video */}
                  <video
                    ref={liveVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Placeholder when no stream */}
                  {!cameraReady && mode === 'camera' && recordState === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900">
                      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Camera size={36} className="text-gray-500" />
                      </div>
                      <p className="text-gray-400 text-sm">Camera preview will appear here</p>
                      <button onClick={startCameraPreview} className="flex items-center gap-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors">
                        <RefreshCw size={14} /> Enable Camera
                      </button>
                    </div>
                  )}

                  {mode === 'screen' && recordState === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900">
                      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Monitor size={36} className="text-gray-500" />
                      </div>
                      <p className="text-gray-400 text-sm">Screen preview will appear after recording starts</p>
                    </div>
                  )}

                  {mode === 'screen+camera' && recordState === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900">
                      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Maximize2 size={36} className="text-gray-500" />
                      </div>
                      <p className="text-gray-400 text-sm">Screen + camera mode: screen preview starts on record</p>
                    </div>
                  )}

                  {/* Countdown overlay */}
                  <AnimatePresence>
                    {recordState === 'countdown' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 flex items-center justify-center"
                      >
                        <motion.div
                          key={countdown}
                          initial={{ scale: 2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="text-9xl font-bold text-white"
                        >
                          {countdown === 0 ? '🎬' : countdown}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* PIP camera overlay (screen+camera mode) */}
                  {mode === 'screen+camera' && isRecordingActive && (
                    <div className="absolute bottom-4 right-4 w-36 h-24 rounded-lg overflow-hidden border-2 border-white/20 shadow-sm bg-black">
                      <video ref={pipVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* REC badge */}
                  {recordState === 'recording' && (
                    <div className="absolute top-4 left-4 flex items-center gap-3 px-3 py-1.5 bg-red-600 rounded-full shadow-sm">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-white tracking-widest uppercase">REC</span>
                    </div>
                  )}

                  {recordState === 'paused' && (
                    <div className="absolute top-4 left-4 flex items-center gap-3 px-3 py-1.5 bg-yellow-600 rounded-full shadow-sm">
                      <Pause size={12} className="text-white fill-white" />
                      <span className="text-xs font-bold text-white tracking-widest uppercase">Paused</span>
                    </div>
                  )}

                  {/* Timer */}
                  {isRecordingActive && (
                    <div className="absolute top-4 right-4 flex items-center gap-3 px-3 py-1.5 bg-black/60 rounded-full border border-white/10">
                      <Clock size={13} className="text-gray-300" />
                      <span className="text-sm font-mono font-bold text-white">{formatTime(elapsedSeconds)}</span>
                    </div>
                  )}

                  {/* Stopped state */}
                  {recordState === 'stopped' && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4">
                      <div className="w-16 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle2 size={32} className="text-green-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold text-sm">Recording Complete!</p>
                        <p className="text-gray-400 text-sm mt-1">Duration: {formatTime(elapsedSeconds)}</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setActiveTab('library'); }}
                          className="flex items-center gap-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition-colors"
                        >
                          <Film size={15} /> View in Library
                        </button>
                        <button
                          onClick={resetToIdle}
                          className="flex items-center gap-3 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-sm font-semibold transition-colors"
                        >
                          <RefreshCw size={15} /> New Recording
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  {/* Main Record / Stop button */}
                  {recordState === 'idle' || recordState === 'stopped' ? (
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      onClick={beginCountdown}
                      className="flex items-center gap-3 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition-all shadow-sm shadow-red-900/40 hover:shadow-red-900/60"
                    >
                      <Circle size={20} className="fill-white" />
                      Start Recording
                    </motion.button>
                  ) : recordState === 'countdown' ? (
                    <button
                      disabled
                      className="flex items-center gap-3 py-4 bg-gray-700 rounded-lg text-sm font-bold opacity-60 cursor-not-allowed"
                    >
                      <RefreshCw size={20} className="animate-spin" />
                      Starting in {countdown}...
                    </button>
                  ) : (
                    <>
                      {/* Pause / Resume */}
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={pauseResume}
                        className="flex items-center gap-3 py-3.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-sm font-bold text-yellow-300 transition-all"
                      >
                        {recordState === 'paused' ? <><Play size={18} className="fill-current" /> Resume</> : <><Pause size={18} className="fill-current" /> Pause</>}
                      </motion.button>

                      {/* Timer display */}
                      <div className="py-3.5 bg-white/5 border border-white/10 rounded-lg">
                        <span className="font-mono text-2xl font-bold text-white tracking-widest">{formatTime(elapsedSeconds)}</span>
                      </div>

                      {/* Stop */}
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={stopRecording}
                        className="flex items-center gap-3 py-3.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm font-bold text-red-300 transition-all"
                      >
                        <Square size={18} className="fill-current" /> Stop
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Quick tips */}
                {recordState === 'idle' && (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: '🎙️', title: 'System Audio', desc: 'Share tab/window for system sound' },
                      { icon: '⏸️', title: 'Pause & Resume', desc: 'Pause anytime during recording' },
                      { icon: '💾', title: 'Auto-save', desc: 'Recording saved locally on stop' },
                    ].map(t => (
                      <div key={t.title} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                        <div className="text-2xl mb-1">{t.icon}</div>
                        <p className="text-xs font-semibold text-white">{t.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-tight">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* LIBRARY TAB */
          <motion.div
            key="library"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="max-w-6xl mx-auto py-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Recording Library</h2>
                <p className="text-sm text-gray-400 mt-1">{recordings.length} recording{recordings.length !== 1 ? 's' : ''} saved locally</p>
              </div>
              {recordings.length > 0 && (
                <button
                  onClick={() => setActiveTab('recorder')}
                  className="flex items-center gap-3 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-bold transition-colors"
                >
                  <Circle size={14} className="fill-white" /> New Recording
                </button>
              )}
            </div>

            {recordings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 gap-5">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Film size={40} className="text-gray-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-bold text-white">No recordings yet</h3>
                  <p className="text-gray-400 text-sm mt-1">Start recording and your videos will appear here</p>
                </div>
                <button
                  onClick={() => setActiveTab('recorder')}
                  className="flex items-center gap-3 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition-colors"
                >
                  <Circle size={14} className="fill-white" /> Start Recording
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Preview panel */}
                <div className="lg:col-span-2">
                  {previewRecording ? (
                    <div className="space-y-4">
                      <div className="rounded-lg overflow-hidden bg-black border border-white/10 aspect-video">
                        <video
                          src={previewRecording.url}
                          controls
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-white">{previewRecording.name}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatTime(previewRecording.duration)} · {formatSize(previewRecording.size)} · {previewRecording.mode}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => downloadRecording(previewRecording)}
                            className="flex items-center gap-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition-colors"
                          >
                            <Download size={15} /> Download
                          </button>
                          <button
                            onClick={() => { deleteRecording(previewRecording.id); setPreviewRecording(null); }}
                            className="flex items-center gap-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-sm font-semibold text-red-300 transition-colors"
                          >
                            <Trash2 size={15} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-4 min-h-[300px] rounded-lg bg-white/5 border border-white/10">
                      <Film size={32} className="text-gray-600" />
                      <p className="text-gray-400 text-sm">Select a recording to preview</p>
                    </div>
                  )}
                </div>

                {/* Recording list */}
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {recordings.map((rec) => (
                    <motion.div
                      key={rec.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onClick={() => setPreviewRecording(rec)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        previewRecording?.id === rec.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                          {rec.mode === 'camera' ? <Camera size={18} className="text-blue-400" /> :
                           rec.mode === 'screen' ? <Monitor size={18} className="text-purple-400" /> :
                           <Maximize2 size={18} className="text-green-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{rec.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatTime(rec.duration)} · {formatSize(rec.size)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {rec.createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); downloadRecording(rec); }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/20 rounded-lg text-xs font-semibold text-blue-300 transition-colors"
                        >
                          <Download size={12} /> Download
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteRecording(rec.id); }}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-semibold text-red-400 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
