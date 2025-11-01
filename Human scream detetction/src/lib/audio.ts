export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private dataArray: Uint8Array | null = null;

  async initialize(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyser);
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }

  getWaveformData(): Uint8Array | null {
    if (!this.analyser || !this.dataArray) return null;
    (this.analyser as any).getByteTimeDomainData(this.dataArray);
    return this.dataArray;
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyser || !this.dataArray) return null;
    (this.analyser as any).getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  getVolume(): number {
    const data = this.getWaveformData();
    if (!data) return 0;
    
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const normalized = (data[i] - 128) / 128;
      sum += normalized * normalized;
    }
    return Math.sqrt(sum / data.length);
  }

  extractMFCC(): number[] {
    // Simplified MFCC extraction for demo
    // In production, use a proper library like meyda.js
    const frequencyData = this.getFrequencyData();
    if (!frequencyData) return [];

    const numCoefficients = 13;
    const mfcc: number[] = [];
    
    for (let i = 0; i < numCoefficients; i++) {
      const start = Math.floor((i * frequencyData.length) / numCoefficients);
      const end = Math.floor(((i + 1) * frequencyData.length) / numCoefficients);
      let sum = 0;
      
      for (let j = start; j < end; j++) {
        sum += frequencyData[j];
      }
      
      mfcc.push(sum / (end - start));
    }
    
    return mfcc;
  }

  stop(): void {
    if (this.microphone) {
      this.microphone.disconnect();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.stream = null;
    this.dataArray = null;
  }
}

export async function checkMicrophonePermission(): Promise<PermissionState> {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    return result.state;
  } catch {
    return 'prompt';
  }
}

export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Location error:', error);
        resolve(null);
      }
    );
  });
}
