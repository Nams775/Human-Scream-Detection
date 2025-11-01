# Installation Checklist

Use this checklist to ensure everything is set up correctly.

## ✅ Prerequisites

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Modern web browser (Chrome, Firefox, Safari, Edge)
- [ ] Firebase account created
- [ ] Git installed (optional)

## ✅ Project Setup

- [ ] Navigate to project directory
- [ ] Run `npm install` successfully
- [ ] No errors in installation

## ✅ Firebase Configuration

### Firebase Console
- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Firebase web app registered

### Environment Variables
- [ ] `.env.local` file created (from `.env.local.example`)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` set
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` set
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` set
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` set
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` set
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` set

### Firebase CLI
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Logged in to Firebase (`firebase login`)
- [ ] Project initialized (`firebase init`)
- [ ] `.firebaserc` updated with your project ID
- [ ] Firestore rules deployed (`firebase deploy --only firestore:rules`)

## ✅ Development Server

- [ ] Run `npm run dev`
- [ ] Server starts without errors
- [ ] Open http://localhost:3000
- [ ] Page loads successfully
- [ ] No console errors

## ✅ Basic Functionality

### Authentication
- [ ] Sign up page loads
- [ ] Can create new account
- [ ] Receives verification email (if configured)
- [ ] Can log in with created account
- [ ] Can log out
- [ ] Password reset page works

### Onboarding
- [ ] Onboarding page appears after signup
- [ ] Can navigate through steps
- [ ] Microphone permission prompt appears
- [ ] Location permission prompt appears
- [ ] Can complete onboarding

### Dashboard
- [ ] Dashboard loads after login
- [ ] Permission status displayed correctly
- [ ] Waveform visualizer renders
- [ ] "Start Monitoring" button works
- [ ] Waveform shows activity when monitoring
- [ ] "Stop Monitoring" button works
- [ ] No console errors during monitoring

### Settings
- [ ] Settings page loads
- [ ] Can add emergency contact
- [ ] Contact appears in list
- [ ] Can delete contact
- [ ] Can adjust detection threshold
- [ ] Can save settings
- [ ] Settings persist after reload

## ✅ Advanced Features (Optional)

### Twilio (SMS Alerts)
- [ ] Twilio account created
- [ ] Account SID obtained
- [ ] Auth Token obtained
- [ ] Phone number acquired
- [ ] Firebase Functions config set
- [ ] Functions deployed
- [ ] Test SMS sent successfully

### SendGrid (Email Alerts)
- [ ] SendGrid account created
- [ ] API key created
- [ ] Sender email verified
- [ ] Firebase Functions config set
- [ ] Functions deployed
- [ ] Test email sent successfully

### PWA
- [ ] App icons created (192x192 and 512x512)
- [ ] Manifest.json configured
- [ ] Service worker registered
- [ ] App installable on mobile
- [ ] Offline functionality works

## ✅ Testing

### Manual Testing
- [ ] Sign up with new email
- [ ] Grant microphone permission
- [ ] Grant location permission
- [ ] Add test emergency contact
- [ ] Start monitoring
- [ ] Make loud noise (test detection)
- [ ] Check detection log appears
- [ ] Click "Test Alert" button
- [ ] Verify alert received (console or actual)
- [ ] Adjust threshold in settings
- [ ] Clear logs
- [ ] Log out and log back in

### Browser Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Works on mobile browser

### Permission Testing
- [ ] Handles microphone permission denial gracefully
- [ ] Handles location permission denial gracefully
- [ ] Shows appropriate warnings
- [ ] Can re-request permissions

## ✅ Production Deployment (Optional)

### Frontend (Vercel)
- [ ] Vercel account created
- [ ] Vercel CLI installed
- [ ] Project deployed (`vercel`)
- [ ] Environment variables added
- [ ] Production URL works
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)

### Backend (Firebase)
- [ ] Functions deployed (`firebase deploy --only functions`)
- [ ] Functions logs show no errors
- [ ] API endpoints accessible
- [ ] Alerts working in production

### Database
- [ ] Firestore rules deployed
- [ ] Indexes created
- [ ] Security rules tested
- [ ] Backup configured (optional)

## ✅ Security Checklist

- [ ] `.env.local` in `.gitignore`
- [ ] No API keys in source code
- [ ] Firestore rules restrict access
- [ ] Firebase Functions use environment config
- [ ] HTTPS enabled in production
- [ ] Authentication required for all operations
- [ ] User data isolated per user

## ✅ Performance Checklist

- [ ] Page load time < 3 seconds
- [ ] Monitoring starts quickly
- [ ] No memory leaks during long monitoring
- [ ] Waveform renders smoothly
- [ ] ML inference completes in < 100ms
- [ ] Firestore queries optimized
- [ ] Images optimized
- [ ] Service worker caching works

## ✅ Documentation

- [ ] README.md reviewed
- [ ] SETUP_GUIDE.md followed
- [ ] QUICK_START.md tested
- [ ] PROJECT_STRUCTURE.md understood
- [ ] Code comments clear
- [ ] Environment variables documented

## 🎉 Final Verification

- [ ] All features work end-to-end
- [ ] No console errors
- [ ] No build warnings
- [ ] All tests pass
- [ ] Documentation complete
- [ ] Ready for demo/presentation

## 🐛 Troubleshooting

If any checkbox fails, refer to:
1. **README.md** - Overview and features
2. **QUICK_START.md** - Fast setup guide
3. **SETUP_GUIDE.md** - Detailed instructions
4. **PROJECT_STRUCTURE.md** - Architecture details

Common issues:
- **Build errors**: Delete `node_modules` and `.next`, run `npm install`
- **Firebase errors**: Check `.env.local` values and Firestore rules
- **Mic not working**: Ensure HTTPS and browser permissions
- **Alerts not sending**: Check Firebase Functions logs

## 📝 Notes

- Development uses localhost (HTTP allowed for mic access)
- Production requires HTTPS for mic and location
- Free Firebase tier sufficient for testing
- Twilio/SendGrid have free tiers for testing
- PWA requires HTTPS to install

## 🚀 Next Steps After Completion

1. Collect audio samples for model training
2. Fine-tune detection threshold
3. Add more emergency contacts
4. Test in real-world scenarios
5. Monitor Firebase usage
6. Optimize performance
7. Add analytics (optional)
8. Share with users

---

**Last Updated**: 2025-10-08
**Version**: 1.0.0
