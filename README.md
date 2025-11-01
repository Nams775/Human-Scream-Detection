# Scream Detection App

A real-time scream detection application using machine learning that automatically sends emergency alerts via SMS and email.

## Features

- 🔐 **Authentication**: Login, Sign-Up, and Password Reset with Firebase Auth
- 🎙️ **Permissions**: Microphone and location permission handling
- 🧠 **Machine Learning**: Real-time scream classification using TensorFlow.js
- 📊 **Dashboard**: Live waveform visualization and monitoring controls
- 🚨 **Alert System**: Automatic SMS and email alerts to emergency contacts
- ⚙️ **Settings**: Manage contacts, adjust sensitivity, and clear logs
- 💻 **PWA Support**: Installable as a Progressive Web App

## Tech Stack

- **Frontend**: Next.js 14 (TypeScript) + TailwindCSS + shadcn/ui
- **Auth & DB**: Firebase Authentication + Firestore
- **ML**: TensorFlow.js for in-browser inference
- **APIs**: Twilio (SMS), SendGrid (Email)
- **Deployment**: Vercel (frontend) + Firebase (backend)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project
- Twilio account (for SMS)
- SendGrid account (for email)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Human scream detetction"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database with the following structure:

```
users/{userId}
  ├── contacts/{contactId}
  │   ├── name: string
  │   ├── phone: string
  │   └── email: string
  ├── settings/preferences
  │   ├── threshold: number
  │   └── modelVersion: string
  └── logs/{logId}
      ├── timestamp: number
      ├── classification: string
      ├── confidence: number
      ├── latitude?: number
      └── longitude?: number
```

4. Set Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Twilio & SendGrid Setup (Optional)

### Twilio (SMS Alerts)

1. Sign up at [twilio.com](https://www.twilio.com)
2. Get your Account SID, Auth Token, and a phone number
3. Add to Firebase Functions environment:
```bash
firebase functions:config:set twilio.account_sid="YOUR_SID" twilio.auth_token="YOUR_TOKEN" twilio.from_number="YOUR_NUMBER"
```

### SendGrid (Email Alerts)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Add to Firebase Functions environment:
```bash
firebase functions:config:set sendgrid.api_key="YOUR_API_KEY" sendgrid.from_email="your@email.com"
```

## ML Model

The app includes a baseline TensorFlow.js model for scream detection. The model:

- **Input**: 13 MFCC (Mel-frequency cepstral coefficients) features
- **Architecture**: Dense neural network with dropout layers
- **Output**: Binary classification (scream/no-scream) with confidence score

### Training Your Own Model

To improve accuracy, you can train the model with your own audio samples:

1. Collect audio samples of screams and non-screams
2. Extract MFCC features using the `AudioProcessor` class
3. Use the `trainOnSample()` method to fine-tune the model
4. Save the trained model using `saveModel()`

## Usage

1. **Sign Up**: Create an account with email and password
2. **Onboarding**: Grant microphone and location permissions
3. **Add Contacts**: Go to Settings and add emergency contacts
4. **Start Monitoring**: Click "Start Monitoring" on the dashboard
5. **Detection**: When a scream is detected, alerts are automatically sent
6. **Test Alerts**: Use the "Test Alert" button to verify the system

## Deployment

### Deploy to Vercel

```bash
npm run build
vercel deploy
```

### Deploy Firebase Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

## Browser Compatibility

- Chrome/Edge 80+
- Firefox 75+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: HTTPS is required for microphone and location access.

## Troubleshooting

### Microphone not working
- Ensure HTTPS is enabled
- Check browser permissions
- Try a different browser

### Alerts not sending
- Verify Twilio/SendGrid credentials
- Check Firebase Functions logs
- Ensure contacts are added in Settings

### Model not loading
- Check browser console for errors
- Ensure TensorFlow.js is properly loaded
- Try refreshing the page

## Security Considerations

- Audio is processed locally in the browser
- Only detection results are stored in Firestore
- Firebase security rules restrict data access
- API keys for Twilio/SendGrid are stored securely in Firebase Functions
- Location is only accessed when needed

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues or questions, please open an issue on GitHub.
