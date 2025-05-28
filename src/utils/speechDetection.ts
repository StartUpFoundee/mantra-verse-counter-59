
interface SpeechDetectionProps {
  onSpeechDetected: () => void;
  onSpeechEnded: () => void;
  minDecibels?: number;
}

export class SpeechDetection {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private isListening = false;
  private lastSpeechTime = 0;
  private isSpeaking = false;
  private silenceTimeout: number | null = null;
  private animationFrame: number | null = null;
  private onSpeechDetected: () => void;
  private onSpeechEnded: () => void;
  private minDecibels: number;
  private consecutiveSilenceFrames = 0;
  private consecutiveSpeechFrames = 0;
  private speechStartTime = 0;
  private minMantraDuration = 800; // Increased minimum duration
  private silenceGapRequired = 1500; // Increased silence gap to 1.5 seconds
  private backgroundNoiseLevel = 0;
  private noiseCalibrationFrames = 0;
  private isCalibrated = false;
  private speechBuffer: number[] = [];
  private bufferSize = 30; // Track last 30 frames for better detection

  constructor({ onSpeechDetected, onSpeechEnded, minDecibels = -70 }: SpeechDetectionProps) {
    this.onSpeechDetected = onSpeechDetected;
    this.onSpeechEnded = onSpeechEnded;
    this.minDecibels = minDecibels;
  }

  public async start(): Promise<boolean> {
    try {
      if (this.isListening) {
        this.stop();
      }
      
      this.audioContext = new AudioContext();
      await this.audioContext.resume();
      
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.minDecibels = this.minDecibels;
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.1; // Less smoothing for better detection
      
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: false, 
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.stream);
      this.mediaStreamSource.connect(this.analyser);
      
      this.isListening = true;
      this.backgroundNoiseLevel = 0;
      this.noiseCalibrationFrames = 0;
      this.isCalibrated = false;
      this.isSpeaking = false;
      this.consecutiveSilenceFrames = 0;
      this.consecutiveSpeechFrames = 0;
      this.speechBuffer = [];
      
      this.detectSound();
      
      console.log("Speech detection started with improved mantra detection");
      return true;
    } catch (error) {
      console.error("Error starting speech detection:", error);
      return false;
    }
  }

  public stop(): void {
    if (!this.isListening) return;
    
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect();
      this.mediaStreamSource = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.analyser = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.consecutiveSilenceFrames = 0;
    this.consecutiveSpeechFrames = 0;
    this.isCalibrated = false;
    this.speechBuffer = [];
    console.log("Speech detection stopped and cleaned up");
  }

  private detectSound = (): void => {
    if (!this.isListening || !this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // Focus on voice frequency range (100Hz - 3000Hz) for better mantra detection
    const voiceStartBin = Math.floor(100 * this.analyser.fftSize / (this.audioContext?.sampleRate || 44100));
    const voiceEndBin = Math.floor(3000 * this.analyser.fftSize / (this.audioContext?.sampleRate || 44100));
    
    let voiceEnergy = 0;
    for (let i = voiceStartBin; i < Math.min(voiceEndBin, dataArray.length); i++) {
      voiceEnergy += dataArray[i];
    }
    voiceEnergy = voiceEnergy / (voiceEndBin - voiceStartBin);
    
    // Add to speech buffer for trend analysis
    this.speechBuffer.push(voiceEnergy);
    if (this.speechBuffer.length > this.bufferSize) {
      this.speechBuffer.shift();
    }
    
    // Calibrate background noise for first 50 frames (more accurate)
    if (!this.isCalibrated && this.noiseCalibrationFrames < 50) {
      this.backgroundNoiseLevel += voiceEnergy;
      this.noiseCalibrationFrames++;
      
      if (this.noiseCalibrationFrames === 50) {
        this.backgroundNoiseLevel = this.backgroundNoiseLevel / 50;
        this.isCalibrated = true;
        console.log("Background noise calibrated:", this.backgroundNoiseLevel.toFixed(2));
      }
    }
    
    // Dynamic threshold with trend analysis
    const avgRecentEnergy = this.speechBuffer.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, this.speechBuffer.length);
    const dynamicThreshold = this.isCalibrated 
      ? Math.max(18, this.backgroundNoiseLevel * 3) 
      : 25;
    
    const now = Date.now();
    const isSpeechDetected = voiceEnergy > dynamicThreshold && avgRecentEnergy > dynamicThreshold;
    
    if (isSpeechDetected) {
      // Voice detected
      this.consecutiveSpeechFrames++;
      this.consecutiveSilenceFrames = 0;
      
      // Require more consecutive frames to avoid false positives
      if (this.consecutiveSpeechFrames >= 5 && !this.isSpeaking) {
        this.isSpeaking = true;
        this.speechStartTime = now;
        this.onSpeechDetected();
        console.log("Mantra speech started, voice energy:", voiceEnergy.toFixed(2), "threshold:", dynamicThreshold.toFixed(2));
      }
      
      this.lastSpeechTime = now;
      
      if (this.silenceTimeout) {
        clearTimeout(this.silenceTimeout);
        this.silenceTimeout = null;
      }
    } else {
      // Silence detected
      this.consecutiveSilenceFrames++;
      this.consecutiveSpeechFrames = 0;
      
      if (this.isSpeaking) {
        const speechDuration = now - this.speechStartTime;
        const silenceDuration = now - this.lastSpeechTime;
        
        // Require 1.5+ seconds of silence and minimum speech duration
        if (silenceDuration > this.silenceGapRequired) {
          if (speechDuration >= this.minMantraDuration) {
            console.log(`Mantra completed - Duration: ${speechDuration}ms, Silence: ${silenceDuration}ms`);
            this.isSpeaking = false;
            this.onSpeechEnded();
          } else {
            console.log(`Speech too short (${speechDuration}ms), not counting as mantra`);
            this.isSpeaking = false;
          }
        }
      }
    }
    
    this.animationFrame = requestAnimationFrame(this.detectSound);
  };
}
