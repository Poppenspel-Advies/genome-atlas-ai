import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Mic, Video, FileAudio, Loader2, X, Sparkles, MessageSquareText, Send, AlertTriangle } from 'lucide-react';

export type InputMode = 'idle' | 'photo' | 'audio' | 'video' | 'text';

interface UploadAreaProps {
  onFileSelected: (file: File | null, mode: InputMode, textDescription?: string) => void;
  isProcessing: boolean;
}

export function UploadArea({ onFileSelected, isProcessing }: UploadAreaProps) {
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState<InputMode>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [micError, setMicError] = useState<string | null>(null);
  const micErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File, inputMode: InputMode) => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      setMode(inputMode);
      onFileSelected(file, inputMode, textInput.trim());
    },
    [onFileSelected, previewUrl, textInput],
  );

  const handleTextSubmit = useCallback(() => {
    if (!textInput.trim()) return;
    setMode('text');
    onFileSelected(null, 'text', textInput.trim());
  }, [textInput, onFileSelected]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;

      if (file.type.startsWith('image/')) handleFile(file, 'photo');
      else if (file.type.startsWith('video/')) handleFile(file, 'video');
      else if (file.type.startsWith('audio/')) handleFile(file, 'audio');
    },
    [handleFile],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  // Clean up mic error timer on unmount
  useEffect(() => {
    return () => {
      if (micErrorTimerRef.current) clearTimeout(micErrorTimerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], 'voice-note.webm', { type: 'audio/webm' });
        handleFile(file, 'audio');
      };

      mediaRecorder.start();
      setRecording(true);
      setMode('audio');
    } catch (err) {
      console.error('Mic access denied:', err);
      // Show a human-friendly message
      setMicError(
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Microphone access was denied. Please allow microphone permissions in your browser settings and try again.'
          : 'Could not access your microphone. Check your browser permissions or try a different device.'
      );
      // Auto-dismiss after 5 seconds
      if (micErrorTimerRef.current) clearTimeout(micErrorTimerRef.current);
      micErrorTimerRef.current = setTimeout(() => setMicError(null), 5000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setMode('idle');
    setTextInput('');
    setMicError(null);
    if (micErrorTimerRef.current) {
      clearTimeout(micErrorTimerRef.current);
      micErrorTimerRef.current = null;
    }
  };

  // Preview display (file-based)
  if (previewUrl && mode !== 'idle' && mode !== 'text' && !isProcessing) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative rounded-xl overflow-hidden border border-accent/20 bg-surface-elevated">
          {mode === 'photo' && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
          )}
          {mode === 'video' && (
            <video src={previewUrl} controls className="w-full h-64 object-cover" />
          )}
          {mode === 'audio' && (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <FileAudio className="w-10 h-10 text-accent" />
              <audio src={previewUrl} controls className="w-4/5" />
            </div>
          )}
          <button
            onClick={reset}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative w-full max-w-lg mx-auto rounded-2xl overflow-hidden
        border-2 border-dashed transition-all duration-500
        ${dragOver
          ? 'border-accent bg-accent/5 shadow-[0_0_40px_rgba(139,92,246,0.15)]'
          : 'border-white/10 hover:border-white/20 bg-surface/50'
        }
      `}
    >
      {/* Glow border effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-natural/5 animate-pulse-glow" />
      </div>

      <div className="relative p-8 text-center">
        {isProcessing ? (
          <div className="py-8 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <p className="text-foreground-muted text-sm">
              Analyzing specimen across time...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/20 mb-4">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Drop your specimen here
              </h2>
              <p className="text-sm text-foreground-muted max-w-sm mx-auto">
                Upload a photo, video, voice note, or describe a species to explore its evolutionary future
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file, 'photo');
              }}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file, 'video');
              }}
            />

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-elevated border border-white/10 text-sm text-foreground hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 active:scale-[0.97]"
              >
                <Camera className="w-4 h-4" />
                Photo
              </button>

              <button
                onClick={() => videoInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-elevated border border-white/10 text-sm text-foreground hover:border-natural/40 hover:bg-natural/5 transition-all duration-200 active:scale-[0.97]"
              >
                <Video className="w-4 h-4" />
                Video
              </button>

              <button
                onClick={recording ? stopRecording : startRecording}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 active:scale-[0.97] ${
                  recording
                    ? 'bg-destructive/20 border-destructive/40 text-destructive animate-pulse'
                    : 'bg-surface-elevated border-white/10 text-foreground hover:border-accent/40 hover:bg-accent/5'
                }`}
              >
                <Mic className="w-4 h-4" />
                {recording ? 'Stop' : 'Voice Note'}
              </button>
            </div>

            {/* Mic access error banner */}
            {micError && (
              <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 animate-fade-in">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1 text-left">
                  <p className="text-[10px] text-destructive font-medium">Microphone access denied</p>
                  <p className="text-[10px] text-foreground-muted leading-relaxed">{micError}</p>
                </div>
                <button
                  onClick={() => setMicError(null)}
                  className="p-0.5 rounded text-foreground-muted/50 hover:text-foreground transition-colors shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] text-foreground-muted/40 uppercase tracking-widest">or describe</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Text input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MessageSquareText className="absolute left-3 top-3 w-4 h-4 text-foreground-muted/40" />
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Describe a species, mutation, or evolutionary scenario..."
                  className="w-full bg-surface-elevated border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-xs text-foreground placeholder:text-foreground-muted/40 outline-none focus:border-accent/40 transition-colors resize-none h-20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleTextSubmit();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="self-end p-2.5 rounded-lg bg-gradient-to-r from-accent to-pink text-white disabled:opacity-20 hover:opacity-90 transition-all active:scale-[0.97]"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-4 text-xs text-foreground-muted">
              or drag & drop a file here
            </p>
          </>
        )}
      </div>
    </div>
  );
}