# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with these variables:

### Firebase Configuration
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Twilio Configuration (Optional - for SMS/Voice alerts)
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=your_twilio_phone_number
```

### SendGrid Configuration (Optional - for Email alerts)
```env
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email@example.com
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Firebase:**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication and Firestore
   - Copy your config values to `.env.local`

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Go to http://localhost:3000
   - Create an account or sign in
   - Complete the onboarding process
   - Add emergency contacts in Settings
   - Start monitoring from the Dashboard

## Features

- ✅ Real-time scream detection using machine learning
- ✅ Automatic alerts to emergency contacts
- ✅ Location sharing for quick response
- ✅ Modern, responsive UI with dark mode
- ✅ Secure authentication with Firebase
- ✅ Progressive Web App (PWA) support

## Troubleshooting

- **Microphone not working:** Check browser permissions
- **Alerts not sending:** Verify Twilio/SendGrid credentials
- **Firebase errors:** Check your environment variables
- **Build errors:** Run `npm install` to update dependencies