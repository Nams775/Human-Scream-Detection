# Useful Commands

Quick reference for all commands you'll need.

## Installation

```bash
# Install dependencies
npm install

# Install Firebase CLI globally
npm install -g firebase-tools

# Install Vercel CLI (for deployment)
npm install -g vercel
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Deploy everything
firebase deploy

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Functions
firebase deploy --only functions

# View Functions logs
firebase functions:log

# Set Functions environment variables
firebase functions:config:set twilio.account_sid="YOUR_SID"
firebase functions:config:set twilio.auth_token="YOUR_TOKEN"
firebase functions:config:set twilio.from_number="+1234567890"
firebase functions:config:set sendgrid.api_key="YOUR_KEY"
firebase functions:config:set sendgrid.from_email="your@email.com"

# View Functions config
firebase functions:config:get

# Start Firebase emulators
firebase emulators:start
```

## Firebase Functions (in functions/ directory)

```bash
cd functions

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run locally
npm run serve

# Deploy
npm run deploy

# View logs
npm run logs
```

## Deployment

```bash
# Deploy to Vercel
vercel

# Deploy to Vercel (production)
vercel --prod

# Set environment variables on Vercel
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
```

## Git (Optional)

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote
git remote add origin <your-repo-url>

# Push to GitHub
git push -u origin main
```

## Troubleshooting

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force

# Check Node version
node --version

# Check npm version
npm --version

# Check Firebase CLI version
firebase --version

# Test Firebase connection
firebase projects:list
```

## Testing

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check for unused dependencies
npx depcheck

# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

## Maintenance

```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Update to latest versions (careful!)
npx npm-check-updates -u
npm install

# Audit security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Environment Setup

```bash
# Copy example env file
cp .env.local.example .env.local

# Edit environment variables (Windows)
notepad .env.local

# Edit environment variables (Mac/Linux)
nano .env.local
```

## Database Management

```bash
# Export Firestore data
firebase firestore:export gs://your-bucket/backup

# Import Firestore data
firebase firestore:import gs://your-bucket/backup

# Delete Firestore collection (use with caution!)
# Use Firebase Console or write a script
```

## PWA

```bash
# Generate PWA icons (requires imagemagick)
convert icon.png -resize 192x192 public/icon-192.png
convert icon.png -resize 512x512 public/icon-512.png

# Or use online tool: https://realfavicongenerator.net/
```

## Performance

```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer

# Check Lighthouse score
npx lighthouse http://localhost:3000 --view

# Profile build
npm run build -- --profile
```

## Quick Commands for Common Tasks

### First Time Setup
```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your Firebase config
firebase login
firebase init
firebase deploy --only firestore:rules
npm run dev
```

### Daily Development
```bash
npm run dev
# Make changes
# Test in browser
# Commit changes
```

### Deploy Updates
```bash
npm run build
vercel --prod
firebase deploy --only functions
```

### Add Emergency Contact (via Firebase Console)
```bash
# Go to Firebase Console → Firestore
# Navigate to: users/{userId}/contacts
# Add document with fields: name, phone, email
```

### View Logs
```bash
# Next.js logs
# Check terminal where npm run dev is running

# Firebase Functions logs
firebase functions:log

# Vercel logs
vercel logs
```

### Reset Everything (Nuclear Option)
```bash
rm -rf node_modules .next
rm package-lock.json
npm install
npm run dev
```

## Environment Variables Reference

```env
# Required for app to work
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Optional
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Firebase Functions Config Reference

```bash
# Twilio (SMS)
firebase functions:config:set twilio.account_sid="ACxxxxx"
firebase functions:config:set twilio.auth_token="your_token"
firebase functions:config:set twilio.from_number="+1234567890"

# SendGrid (Email)
firebase functions:config:set sendgrid.api_key="SG.xxxxx"
firebase functions:config:set sendgrid.from_email="alerts@yourdomain.com"
```

## Keyboard Shortcuts (VS Code)

- `Ctrl+Shift+P` - Command palette
- `Ctrl+P` - Quick file open
- `Ctrl+`` - Toggle terminal
- `Ctrl+B` - Toggle sidebar
- `F5` - Start debugging
- `Ctrl+Shift+F` - Search in files

## Browser DevTools

- `F12` - Open DevTools
- `Ctrl+Shift+C` - Inspect element
- `Ctrl+Shift+J` - Open console
- `Ctrl+Shift+M` - Toggle device toolbar
- `Ctrl+Shift+I` - Open DevTools

## Tips

1. Keep terminal open with `npm run dev` running
2. Use another terminal for Firebase commands
3. Check browser console for errors
4. Use Firebase Console to view database
5. Test on mobile using ngrok or local network
6. Use React DevTools extension
7. Enable verbose logging for debugging

## Resources

- Next.js Docs: https://nextjs.org/docs
- Firebase Docs: https://firebase.google.com/docs
- TensorFlow.js: https://www.tensorflow.org/js
- Tailwind CSS: https://tailwindcss.com/docs
- Twilio API: https://www.twilio.com/docs
- SendGrid API: https://docs.sendgrid.com
