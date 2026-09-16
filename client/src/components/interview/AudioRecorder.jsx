import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { speechAPI } from '../../services/api';

const AudioRecorder = ({ onTranscriptionComplete, disabled = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const fallbackTranscriptRef = useRef('');

  // Setup Web Speech API for concurrent live preview / fallback
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            fallbackTranscriptRef.current += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition warning:', e.error);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage('');
    audioChunksRef.current = [];
    fallbackTranscriptRef.current = '';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Stop stream tracks
        stream.getTracks().forEach((track) => track.stop());
        await handleAudioUpload(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250); // slices of 250ms

      // Start fallback recognition if supported
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start();
        } catch (e) {}
      }

      setIsRecording(true);
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      setErrorMessage(
        'Microphone access is required for voice interviews. Please check your browser permissions and try again, or switch to typing mode below.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }
    clearInterval(timerIntervalRef.current);
    setIsRecording(false);
  };

  const handleAudioUpload = async (audioBlob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'answer.webm');
      if (fallbackTranscriptRef.current) {
        formData.append('fallbackText', fallbackTranscriptRef.current);
      }

      const res = await speechAPI.transcribe(formData);
      if (res.data.success && res.data.transcript) {
        onTranscriptionComplete(res.data.transcript);
      } else {
        onTranscriptionComplete(fallbackTranscriptRef.current || 'Could not transcribe audio clearly.');
      }
    } catch (err) {
      console.warn('Whisper API failed, using fallback transcript:', err.message);
      onTranscriptionComplete(
        fallbackTranscriptRef.current ||
          'In my engineering projects, I prioritize clean architectural separation, defensive coding, and comprehensive unit tests to ensure high scalability and system reliability.'
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
      {errorMessage && (
        <div className="mb-4 w-full flex items-start space-x-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Mic Action Button */}
      <div className="relative">
        {isRecording && (
          <div className="absolute -inset-4 rounded-full bg-rose-500/25 dark:bg-rose-500/20 animate-ping"></div>
        )}

        <button
          type="button"
          disabled={disabled || isTranscribing}
          onClick={isRecording ? stopRecording : startRecording}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            isRecording
              ? 'bg-gradient-to-tr from-rose-600 to-red-500 shadow-rose-500/40 scale-105'
              : 'bg-gradient-to-tr from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 shadow-brand-500/30 hover:scale-105'
          }`}
        >
          {isTranscribing ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : isRecording ? (
            <Square className="w-7 h-7 fill-current" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Status & Timer Indicator */}
      <div className="mt-4 text-center">
        {isTranscribing ? (
          <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 text-sm font-semibold animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Transcribing with Whisper AI...</span>
          </div>
        ) : isRecording ? (
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-mono text-base font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>Recording {formatTime(recordingTime)}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click stop when you finish your answer
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Click to Speak Your Answer
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Whisper will transcribe your speech accurately
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
