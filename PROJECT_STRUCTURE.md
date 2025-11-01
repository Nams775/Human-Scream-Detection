# Project Structure

```
Human scream detetction/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/                  # API routes
│   │   │   └── alerts/
│   │   │       └── send/
│   │   │           └── route.ts  # Alert sending endpoint
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main dashboard with monitoring
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── signup/
│   │   │   └── page.tsx          # Sign up page
│   │   ├── reset-password/
│   │   │   └── page.tsx          # Password reset page
│   │   ├── onboarding/
│   │   │   └── page.tsx          # Onboarding/tutorial flow
│   │   ├── settings/
│   │   │   └── page.tsx          # Settings and contact management
│   │   ├── layout.tsx            # Root layout with AuthProvider
│   │   ├── page.tsx              # Home page (redirects)
│   │   └── globals.css           # Global styles with Tailwind
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   └── WaveformVisualizer.tsx # Audio waveform component
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx       # Firebase authentication context
│   │
│   ├── lib/
│   │   ├── firebase.ts           # Firebase initialization
│   │   ├── audio.ts              # Audio processing utilities
│   │   ├── ml-model.ts           # TensorFlow.js model
│   │   └── utils.ts              # Helper functions
│   │
│   └── types/
│       └── index.ts              # TypeScript type definitions
│
├── functions/                    # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts              # Alert functions (Twilio/SendGrid)
│   ├── package.json
│   └── tsconfig.json
│
├── public/                       # Static assets
│   ├── manifest.json             # PWA manifest
│   ├── icon-192.png              # PWA icon (192x192)
│   └── icon-512.png              # PWA icon (512x512)
│
├── firebase.json                 # Firebase configuration
├── firestore.rules               # Firestore security rules
├── firestore.indexes.json        # Firestore indexes
├── .firebaserc                   # Firebase project config
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind CSS config
├── next.config.js                # Next.js config with PWA
├── postcss.config.js             # PostCSS config
│
├── .env.local.example            # Environment variables template
├── .gitignore                    # Git ignore rules
│
├── README.md                     # Full documentation
├── SETUP_GUIDE.md                # Detailed setup instructions
├── QUICK_START.md                # Quick start guide
└── PROJECT_STRUCTURE.md          # This file
```

## Key Files Explained

### Frontend (Next.js)

**`src/app/layout.tsx`**
- Root layout with dark mode
- Wraps app with AuthProvider
- Includes global styles

**`src/app/dashboard/page.tsx`**
- Main monitoring interface
- Real-time audio processing
- ML inference loop
- Detection log display
- Alert triggering

**`src/contexts/AuthContext.tsx`**
- Firebase authentication wrapper
- Login, signup, logout, password reset
- Auth state management

**`src/lib/audio.ts`**
- AudioProcessor class for WebAudio API
- Waveform and frequency data extraction
- MFCC feature extraction
- Permission checking

**`src/lib/ml-model.ts`**
- TensorFlow.js model wrapper
- Baseline scream detection model
- Prediction and training methods

**`src/components/WaveformVisualizer.tsx`**
- Canvas-based waveform display
- Real-time audio visualization

### Backend (Firebase Functions)

**`functions/src/index.ts`**
- `sendAlerts`: Cloud Function for alerts
- `sendAlertsHTTP`: HTTP endpoint version
- Twilio SMS integration
- SendGrid email integration

### Configuration

**`firebase.json`**
- Firebase project configuration
- Functions and Firestore setup

**`firestore.rules`**
- Security rules (users can only access their own data)

**`next.config.js`**
- PWA configuration with next-pwa
- Webpack config for Firebase compatibility

**`.env.local`**
- Firebase client configuration
- API endpoints

## Data Flow

### Authentication Flow
1. User signs up/logs in via Firebase Auth
2. AuthContext manages auth state
3. Protected routes check authentication
4. User data stored in Firestore under `/users/{uid}`

### Monitoring Flow
1. User grants microphone permission
2. AudioProcessor captures audio stream
3. Extract MFCC features every 500ms
4. ML model predicts scream/no-scream
5. If scream detected (confidence > threshold):
   - Get current location
   - Save log to Firestore
   - Trigger alert function
   - Send SMS and email to contacts

### Alert Flow
1. Dashboard calls `/api/alerts/send`
2. API route fetches emergency contacts from Firestore
3. Calls Firebase Function or sends directly
4. Function sends SMS via Twilio
5. Function sends email via SendGrid
6. Returns success/failure status

## Database Schema

### Firestore Structure

```
/users/{userId}
  - (user profile data)
  
  /contacts/{contactId}
    - name: string
    - phone: string
    - email: string
  
  /settings/preferences
    - threshold: number (0.5-0.95)
    - modelVersion: string
  
  /logs/{logId}
    - timestamp: number
    - classification: "scream" | "no-scream"
    - confidence: number
    - latitude?: number
    - longitude?: number
```

## Component Hierarchy

```
App (layout.tsx)
└── AuthProvider
    ├── Home (page.tsx) → redirects
    ├── Login (login/page.tsx)
    ├── Signup (signup/page.tsx)
    ├── ResetPassword (reset-password/page.tsx)
    ├── Onboarding (onboarding/page.tsx)
    ├── Dashboard (dashboard/page.tsx)
    │   ├── WaveformVisualizer
    │   ├── PermissionStatus
    │   ├── MonitoringControls
    │   └── DetectionLogs
    └── Settings (settings/page.tsx)
        ├── ContactList
        ├── AddContactForm
        ├── DetectionSettings
        └── DataManagement
```

## Technology Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **ML**: TensorFlow.js
- **Audio**: Web Audio API
- **PWA**: next-pwa
- **SMS**: Twilio
- **Email**: SendGrid
- **Deployment**: Vercel (frontend) + Firebase (backend)

## Development Workflow

1. **Local Development**: `npm run dev`
2. **Build**: `npm run build`
3. **Deploy Frontend**: `vercel deploy`
4. **Deploy Functions**: `firebase deploy --only functions`
5. **Deploy Rules**: `firebase deploy --only firestore:rules`

## Security Features

- Firebase Authentication required for all operations
- Firestore rules restrict data access to authenticated users
- API keys stored in environment variables
- Twilio/SendGrid keys in Firebase Functions config
- HTTPS required for microphone/location access
- Audio processed locally (not transmitted)

## Performance Considerations

- Audio processing runs at 500ms intervals (adjustable)
- TensorFlow.js model is lightweight (13 input features)
- Firestore queries limited to 10 most recent logs
- PWA enables offline capability
- Service worker caches static assets

## Browser Requirements

- Modern browser with Web Audio API support
- Microphone access (requires HTTPS)
- Geolocation API support
- JavaScript enabled
- Minimum: Chrome 80+, Firefox 75+, Safari 14+

## Future Enhancements

- [ ] Voice commands to start/stop monitoring
- [ ] Multiple detection modes (scream, gunshot, glass break)
- [ ] Historical analytics and charts
- [ ] Geofencing (only monitor in certain locations)
- [ ] Bluetooth integration for wearables
- [ ] Native mobile apps (React Native)
- [ ] Multi-language support
- [ ] Custom model training UI
- [ ] Integration with smart home systems
- [ ] Emergency services direct notification
