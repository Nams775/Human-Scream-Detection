'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';
import { AudioProcessor, checkMicrophonePermission, getCurrentLocation } from '@/lib/audio';
import { getModel } from '@/lib/ml-model';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Mic, MicOff, MapPin, Settings, LogOut, AlertTriangle, Bell } from 'lucide-react';
import { DetectionLog, MonitoringStatus } from '@/types';
import { formatTimestamp, createGoogleMapsLink } from '@/lib/utils';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [status, setStatus] = useState<MonitoringStatus['currentStatus']>('idle');
  const [waveformData, setWaveformData] = useState<Uint8Array | null>(null);
  const [micPermission, setMicPermission] = useState<PermissionState>('prompt');
  const [locationPermission, setLocationPermission] = useState<PermissionState>('prompt');
  const [logs, setLogs] = useState<DetectionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const audioProcessorRef = useRef<AudioProcessor | null>(null);
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkPermissions = async () => {
    const mic = await checkMicrophonePermission();
    setMicPermission(mic);

    try {
      const locResult = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      setLocationPermission(locResult.state);
    } catch {
      setLocationPermission('prompt');
    }
  };

  const loadLogs = useCallback(async () => {
    if (!user) return;

    try {
      const logsRef = collection(db, 'users', user.uid, 'logs');
      const q = query(logsRef, orderBy('timestamp', 'desc'), limit(10));
      const snapshot = await getDocs(q);
      
      const logsData: DetectionLog[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as DetectionLog));
      
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    checkPermissions();
    loadLogs();
    setIsLoading(false);
  }, [user, router, loadLogs]);

  const startMonitoring = async () => {
    try {
      setIsLoading(true);
      
      // Initialize audio processor
      audioProcessorRef.current = new AudioProcessor();
      await audioProcessorRef.current.initialize();
      
      // Load ML model
      const model = await getModel();
      
      setIsMonitoring(true);
      setStatus('listening');
      
      // Start monitoring loop
      monitoringIntervalRef.current = setInterval(async () => {
        if (!audioProcessorRef.current) return;
        
        // Update waveform
        const waveform = audioProcessorRef.current.getWaveformData();
        setWaveformData(waveform);
        
        // Extract features and predict
        const mfcc = audioProcessorRef.current.extractMFCC();
        if (mfcc.length > 0) {
          try {
            const prediction = await model.predict(mfcc);
            
            if (prediction.isScream && prediction.confidence > 0.7) {
              setStatus('scream-detected');
              await handleScreamDetected(prediction.confidence);
            } else {
              setStatus('listening');
            }
          } catch (error) {
            console.error('Prediction error:', error);
          }
        }
      }, 500); // Check every 500ms
      
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      alert('Failed to start monitoring. Please check microphone permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopMonitoring = () => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }
    
    if (audioProcessorRef.current) {
      audioProcessorRef.current.stop();
      audioProcessorRef.current = null;
    }
    
    setIsMonitoring(false);
    setStatus('idle');
    setWaveformData(null);
  };

  const handleScreamDetected = async (confidence: number) => {
    if (!user) return;

    // Get location
    const location = await getCurrentLocation();
    
    // Save log
    const logData: Omit<DetectionLog, 'id'> = {
      timestamp: Date.now(),
      classification: 'scream',
      confidence,
      latitude: location?.latitude,
      longitude: location?.longitude,
    };

    try {
      const logsRef = collection(db, 'users', user.uid, 'logs');
      await addDoc(logsRef, logData);
      
      // Send alerts
      await sendAlerts(location);
      
      // Reload logs
      loadLogs();
    } catch (error) {
      console.error('Failed to save log:', error);
    }
  };

  const sendAlerts = async (location: { latitude: number; longitude: number } | null) => {
    try {
      const response = await fetch('/api/alerts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid,
          location,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        console.error('Failed to send alerts');
      }
    } catch (error) {
      console.error('Alert error:', error);
    }
  };

  const testAlert = async () => {
    const location = await getCurrentLocation();
    await sendAlerts(location);
    alert('Test alert sent to emergency contacts!');
  };

  const handleLogout = async () => {
    stopMonitoring();
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage scream detection</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Permission Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Permission Status</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="flex items-center gap-2">
              <Mic className={`h-5 w-5 ${micPermission === 'granted' ? 'text-green-500' : 'text-destructive'}`} />
              <span className="text-sm">
                Microphone: <span className="font-medium capitalize">{micPermission}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className={`h-5 w-5 ${locationPermission === 'granted' ? 'text-green-500' : 'text-yellow-500'}`} />
              <span className="text-sm">
                Location: <span className="font-medium capitalize">{locationPermission}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Monitoring</CardTitle>
                <CardDescription>Real-time audio analysis and scream detection</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === 'scream-detected' ? 'bg-destructive text-destructive-foreground' :
                  status === 'listening' ? 'bg-green-500/10 text-green-500' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {status === 'scream-detected' && <AlertTriangle className="inline h-4 w-4 mr-1" />}
                  {status === 'listening' && 'Listening'}
                  {status === 'scream-detected' && 'Scream Detected!'}
                  {status === 'idle' && 'Idle'}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <WaveformVisualizer waveformData={waveformData} isActive={isMonitoring} />
            
            <div className="flex gap-2">
              {!isMonitoring ? (
                <Button onClick={startMonitoring} className="flex-1" disabled={micPermission !== 'granted'}>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Monitoring
                </Button>
              ) : (
                <Button onClick={stopMonitoring} variant="destructive" className="flex-1">
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Monitoring
                </Button>
              )}
              <Button onClick={testAlert} variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Test Alert
              </Button>
            </div>

            {micPermission !== 'granted' && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                Microphone permission required to start monitoring. Please grant permission in your browser settings.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detection Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Detection History</CardTitle>
            <CardDescription>Recent scream detections and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No detections yet</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          log.classification === 'scream'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {log.classification}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <div className="text-sm mt-1">
                        Confidence: {(log.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    {log.latitude && log.longitude && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(createGoogleMapsLink(log.latitude!, log.longitude!), '_blank')}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        View Location
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
