# Quick Start Guide

Get the Scream Detection App running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Firebase Setup (2 minutes)

### Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project" → Enter name → Create
3. Enable Authentication: Authentication → Get started → Email/Password → Enable
4. Create Firestore: Firestore Database → Create database → Production mode → Enable

### Get Config
1. Project Settings (gear icon) → Your apps → Web icon (</>)
2. Copy the config values

### Add to .env.local
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 3. Deploy Firestore Rules

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Firestore only)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## 4. Run the App

```bash
npm run dev
```

Open http://localhost:3000

## 5. Test It Out

1. **Sign Up** with email/password
2. **Grant permissions** for microphone and location
3. **Add a contact** in Settings (use your own email/phone for testing)
4. **Start monitoring** from Dashboard
5. **Click "Test Alert"** to verify the system

## That's It! 🎉

The app is now running locally. Alerts are logged to console (SMS/Email require Twilio/SendGrid setup).

## Next Steps

- **Add Real Alerts**: Follow SETUP_GUIDE.md to configure Twilio (SMS) and SendGrid (Email)
- **Deploy**: Use Vercel for frontend, Firebase for backend
- **Train Model**: Collect audio samples to improve detection accuracy
- **Customize**: Adjust detection threshold in Settings

## Troubleshooting

**Microphone not working?**
- Use HTTPS or localhost
- Check browser permissions
- Try Chrome/Edge

**Firebase errors?**
- Verify .env.local values
- Check Firestore rules are deployed
- Ensure Authentication is enabled

**Build errors?**
```bash
rm -rf node_modules .next
npm install
npm run dev
```

## Need Help?

Check README.md and SETUP_GUIDE.md for detailed instructions.
