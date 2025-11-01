'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MapPin, Shield, Bell, CheckCircle } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [micPermission, setMicPermission] = useState<PermissionState | null>(null);
  const [locationPermission, setLocationPermission] = useState<PermissionState | null>(null);
  const router = useRouter();

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission('granted');
    } catch (err) {
      setMicPermission('denied');
    }
  };

  const requestLocationPermission = async () => {
    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      setLocationPermission('granted');
    } catch (err) {
      setLocationPermission('denied');
    }
  };

  const steps = [
    {
      title: 'Welcome to Scream Detection',
      description: 'Your personal safety companion that monitors audio for emergency situations',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This app uses machine learning to detect screams in real-time and automatically alerts your emergency contacts.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <span>Real-time audio monitoring with ML classification</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <span>Automatic SMS and email alerts to emergency contacts</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <span>Location sharing for quick response</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Microphone Permission',
      description: 'We need access to your microphone to detect screams in real-time',
      icon: Mic,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The app continuously analyzes audio from your microphone using a machine learning model. Audio is processed locally and never stored or transmitted unless a scream is detected.
          </p>
          {micPermission === 'granted' && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Microphone access granted</span>
            </div>
          )}
          {micPermission === 'denied' && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              Microphone access denied. You can enable it later in settings, but the app won&apos;t work without it.
            </div>
          )}
          {!micPermission && (
            <Button onClick={requestMicPermission} className="w-full">
              Grant Microphone Access
            </Button>
          )}
        </div>
      ),
    },
    {
      title: 'Location Permission',
      description: 'We need your location to include it in emergency alerts',
      icon: MapPin,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            When a scream is detected, your current location is sent to emergency contacts so they can find you quickly. Location is only accessed when needed.
          </p>
          {locationPermission === 'granted' && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Location access granted</span>
            </div>
          )}
          {locationPermission === 'denied' && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              Location access denied. Alerts will be sent without location information.
            </div>
          )}
          {!locationPermission && (
            <Button onClick={requestLocationPermission} className="w-full">
              Grant Location Access
            </Button>
          )}
        </div>
      ),
    },
    {
      title: 'Setup Complete!',
      description: 'You\'re all set to start monitoring',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Before you start monitoring, make sure to add emergency contacts in the Settings page. They will receive alerts when a scream is detected.
          </p>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Next steps:</p>
            <ul className="space-y-1 text-muted-foreground ml-4">
              <li>• Add emergency contacts in Settings</li>
              <li>• Adjust detection sensitivity if needed</li>
              <li>• Test the alert system</li>
              <li>• Start monitoring from the Dashboard</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep.content}

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)}>Next</Button>
              ) : (
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
