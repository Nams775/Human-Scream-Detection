# Test Phone Numbers for Development

## Twilio Test Numbers (No Verification Required)

### Valid Test Numbers:
- `+15005550006` - Valid test number for calls/SMS
- `+15005550001` - Invalid test number (for error testing)
- `+15005550002` - Valid test number for international

### How to Use Test Numbers:

1. **Update your emergency contact** in the app:
   - Go to Settings
   - Edit the contact phone number to: `+15005550006`
   - Save the contact

2. **Test the alert system**:
   - Go to Dashboard
   - Click "Test Alert"
   - Check console for success messages

### Environment Variables for Testing:

```env
# Use these for testing (they're free)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+15005550006
```

## Production Setup:

For production use, you'll need to:
1. **Verify real phone numbers** in Twilio console
2. **Or upgrade to paid Twilio account**
3. **Or use alternative services** (WhatsApp Business API, etc.)

## Current Status:
- ✅ Email alerts: Working perfectly
- ⚠️ Phone alerts: Need verification or test numbers
- ✅ App functionality: 100% working

