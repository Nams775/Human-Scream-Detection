export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface DetectionLog {
  id: string;
  timestamp: number;
  classification: 'scream' | 'no-scream';
  confidence: number;
  latitude?: number;
  longitude?: number;
}

export interface UserSettings {
  threshold: number;
  modelVersion: string;
}

export interface PermissionStatus {
  microphone: 'granted' | 'denied' | 'prompt';
  location: 'granted' | 'denied' | 'prompt';
}

export interface MonitoringStatus {
  isListening: boolean;
  currentStatus: 'idle' | 'listening' | 'scream-detected' | 'no-scream';
}
