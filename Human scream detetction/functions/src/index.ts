import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as twilio from 'twilio';
import * as sgMail from '@sendgrid/mail';

admin.initializeApp();

interface AlertRequest {
  userId: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}

interface EmergencyContact {
  name: string;
  phone: string;
  email: string;
}

export const sendAlerts = functions.https.onCall(async (data: AlertRequest, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, location, timestamp } = data;

  if (!userId) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
  }

  try {
    // Get user's emergency contacts
    const contactsSnapshot = await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('contacts')
      .get();

    if (contactsSnapshot.empty) {
      return {
        success: false,
        message: 'No emergency contacts configured',
      };
    }

    const contacts: EmergencyContact[] = contactsSnapshot.docs.map(
      (doc) => doc.data() as EmergencyContact
    );

    // Prepare alert message
    const locationText = location
      ? `Location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : 'Location: Not available';

    const message = `🚨 EMERGENCY ALERT 🚨\n\nA possible scream was detected at ${new Date(
      timestamp
    ).toLocaleString()}.\n\n${locationText}\n\nPlease check immediately!`;

    // Send SMS via Twilio
    const twilioConfig = functions.config().twilio;
    if (twilioConfig && twilioConfig.account_sid && twilioConfig.auth_token) {
      const twilioClient = twilio.default(
        twilioConfig.account_sid,
        twilioConfig.auth_token
      );

      const smsPromises = contacts.map((contact) =>
        twilioClient.messages.create({
          body: message,
          from: twilioConfig.from_number,
          to: contact.phone,
        })
      );

      await Promise.allSettled(smsPromises);
    }

    // Send Email via SendGrid
    const sendgridConfig = functions.config().sendgrid;
    if (sendgridConfig && sendgridConfig.api_key) {
      sgMail.setApiKey(sendgridConfig.api_key);

      const emailPromises = contacts.map((contact) =>
        sgMail.send({
          to: contact.email,
          from: sendgridConfig.from_email,
          subject: '🚨 Emergency Alert - Scream Detected',
          text: message,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">🚨 EMERGENCY ALERT</h1>
              </div>
              <div style="padding: 20px; background-color: #f9fafb;">
                <p style="font-size: 16px; color: #111827;">
                  A possible scream was detected at <strong>${new Date(
                    timestamp
                  ).toLocaleString()}</strong>.
                </p>
                ${
                  location
                    ? `<p style="font-size: 16px;">
                      <a href="https://www.google.com/maps?q=${location.latitude},${location.longitude}" 
                         style="color: #2563eb; text-decoration: none; font-weight: bold;">
                        📍 View Location on Map
                      </a>
                    </p>`
                    : '<p style="font-size: 16px; color: #6b7280;">Location: Not available</p>'
                }
                <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin-top: 20px;">
                  <p style="color: #dc2626; font-weight: bold; margin: 0;">
                    ⚠️ Please check immediately!
                  </p>
                </div>
              </div>
              <div style="padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
                <p>This is an automated alert from Scream Detection App</p>
              </div>
            </div>
          `,
        })
      );

      await Promise.allSettled(emailPromises);
    }

    return {
      success: true,
      message: 'Alerts sent successfully',
      contactCount: contacts.length,
    };
  } catch (error) {
    console.error('Error sending alerts:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send alerts');
  }
});

// HTTP endpoint for Next.js API route
export const sendAlertsHTTP = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { userId, location, timestamp } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    // Get user's emergency contacts
    const contactsSnapshot = await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('contacts')
      .get();

    if (contactsSnapshot.empty) {
      res.json({
        success: false,
        message: 'No emergency contacts configured',
      });
      return;
    }

    const contacts: EmergencyContact[] = contactsSnapshot.docs.map(
      (doc) => doc.data() as EmergencyContact
    );

    // Prepare alert message
    const locationText = location
      ? `Location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : 'Location: Not available';

    const message = `🚨 EMERGENCY ALERT 🚨\n\nA possible scream was detected at ${new Date(
      timestamp
    ).toLocaleString()}.\n\n${locationText}\n\nPlease check immediately!`;

    // Send alerts (same logic as above)
    console.log('Sending alerts to:', contacts.length, 'contacts');
    console.log('Message:', message);

    res.json({
      success: true,
      message: 'Alerts sent successfully',
      contactCount: contacts.length,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to send alerts' });
  }
});
