import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import twilio from 'twilio';
import sgMail from '@sendgrid/mail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, location, timestamp } = body;

    // Input validation
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Valid user ID required' }, { status: 400 });
    }

    if (location && (typeof location.latitude !== 'number' || typeof location.longitude !== 'number')) {
      return NextResponse.json({ error: 'Invalid location format' }, { status: 400 });
    }

    if (!timestamp || typeof timestamp !== 'number') {
      return NextResponse.json({ error: 'Valid timestamp required' }, { status: 400 });
    }

    // Get user's emergency contacts
    const contactsRef = collection(db, 'users', userId, 'contacts');
    const contactsSnapshot = await getDocs(contactsRef);
    
    if (contactsSnapshot.empty) {
      return NextResponse.json({ 
        message: 'No emergency contacts configured',
        sent: false 
      });
    }

    const contacts = contactsSnapshot.docs.map(doc => doc.data());

    // Prepare alert messages
    const locationText = location 
      ? `Location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : 'Location: Not available';
    
    const smsMessage = `🚨 EMERGENCY ALERT 🚨\n\nA possible scream was detected at ${new Date(timestamp).toLocaleString()}.\n\n${locationText}\n\nPlease check immediately!`;
    
    const voiceMessage = `Emergency alert. A possible scream was detected at ${new Date(timestamp).toLocaleTimeString()}. ${location ? `Location: latitude ${location.latitude}, longitude ${location.longitude}` : 'Location not available'}. Please check immediately.`;

    const results = {
      calls: 0,
      sms: 0,
      emails: 0,
      errors: [] as string[]
    };

    // Get credentials from environment
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_FROM_NUMBER;
    const sendgridKey = process.env.SENDGRID_API_KEY;
    const sendgridFrom = process.env.SENDGRID_FROM_EMAIL;

    console.log('\n📊 Alert System Check:');
    console.log('Twilio Config:', { hasSid: !!twilioSid, hasToken: !!twilioToken, hasNumber: !!twilioNumber });
    console.log('SendGrid Config:', { hasApiKey: !!sendgridKey, hasFromEmail: !!sendgridFrom });
    console.log('Sending alerts to', contacts.length, 'contact(s)\n');

    // Initialize Twilio if credentials exist
    let twilioClient = null;
    if (twilioSid && twilioToken && twilioNumber) {
      twilioClient = twilio(twilioSid, twilioToken);
    }

    // Initialize SendGrid if credentials exist
    if (sendgridKey) {
      sgMail.setApiKey(sendgridKey);
    }

    // Send alerts to each contact
    for (const contact of contacts) {
      // Make voice call via Twilio
      if (twilioClient && contact.phone) {
        try {
          // Validate phone number format
          const phoneNumber = contact.phone.startsWith('+') ? contact.phone : `+${contact.phone}`;
          
          await twilioClient.calls.create({
            to: phoneNumber,
            from: twilioNumber!,
            twiml: `<Response><Say voice="alice">${voiceMessage}</Say></Response>`
          });
          results.calls++;
          console.log(`✓ Voice call sent to ${contact.name} (${phoneNumber})`);
        } catch (error: any) {
          console.error(`✗ Call failed to ${contact.name}:`, error.message);
          const errorMsg = error.message.includes('unverified') 
            ? `Call to ${contact.name} failed: Phone number needs verification in Twilio trial account`
            : `Call to ${contact.name} failed: ${error.message}`;
          results.errors.push(errorMsg);
        }
      }

      // Send SMS via Twilio
      if (twilioClient && contact.phone) {
        try {
          // Validate phone number format
          const phoneNumber = contact.phone.startsWith('+') ? contact.phone : `+${contact.phone}`;
          
          await twilioClient.messages.create({
            body: smsMessage,
            from: twilioNumber!,
            to: phoneNumber
          });
          results.sms++;
          console.log(`✓ SMS sent to ${contact.name} (${phoneNumber})`);
        } catch (error: any) {
          console.error(`✗ SMS failed to ${contact.name}:`, error.message);
          const errorMsg = error.message.includes('unverified') 
            ? `SMS to ${contact.name} failed: Phone number needs verification in Twilio trial account`
            : `SMS to ${contact.name} failed: ${error.message}`;
          results.errors.push(errorMsg);
        }
      }

      // Send email via SendGrid
      if (sendgridKey && sendgridFrom && contact.email) {
        try {
          await sgMail.send({
            to: contact.email,
            from: sendgridFrom,
            subject: 'Emergency Alert - Scream Detected',
            text: smsMessage,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; font-size: 24px;">Emergency Alert</h1>
                  <p style="margin: 5px 0 0 0; font-size: 16px;">Scream Detection System</p>
                </div>
                <div style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                  <p style="font-size: 18px; color: #111827; margin-bottom: 20px;">
                    <strong>A possible scream was detected at ${new Date(timestamp).toLocaleString()}.</strong>
                  </p>
                  ${location ? `
                    <div style="background-color: #e5f3ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
                      <p style="margin: 0; font-size: 16px; color: #1e40af;">
                        <strong>📍 Location:</strong> 
                        <a href="https://www.google.com/maps?q=${location.latitude},${location.longitude}" 
                           style="color: #2563eb; text-decoration: none;">
                          View on Google Maps
                        </a>
                      </p>
                    </div>
                  ` : '<p style="font-size: 16px; color: #6b7280;">Location: Not available</p>'}
                  <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin-top: 25px; border-radius: 4px;">
                    <p style="color: #dc2626; font-weight: bold; margin: 0; font-size: 16px;">
                      ⚠️ Please check immediately!
                    </p>
                  </div>
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">
                      This is an automated alert from your Scream Detection App.<br>
                      If this was a false alarm, please check your detection settings.
                    </p>
                  </div>
                </div>
              </div>
            `
          });
          results.emails++;
          console.log(`✓ Email sent to ${contact.name} (${contact.email})`);
        } catch (error: any) {
          console.error(`✗ Email failed to ${contact.name}:`, error.message);
          results.errors.push(`Email to ${contact.name} failed: ${error.message}`);
        }
      }
    }

    // Log summary
    console.log('\n📊 Alert Summary:');
    console.log(`   Calls: ${results.calls}/${contacts.length}`);
    console.log(`   SMS: ${results.sms}/${contacts.length}`);
    console.log(`   Emails: ${results.emails}/${contacts.length}`);
    if (results.errors.length > 0) {
      console.log(`   Errors: ${results.errors.length}`);
      results.errors.forEach(err => console.log(`     - ${err}`));
    }
    // Check if we have verification issues
    const hasVerificationIssues = results.errors.some(error => 
      error.includes('unverified') || error.includes('verification')
    );

    if (hasVerificationIssues) {
      console.log('\n💡 SOLUTION: To fix phone alerts:');
      console.log('   1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
      console.log('   2. Add and verify your phone numbers');
      console.log('   3. Or use test numbers: +15005550006');
      console.log('');
    }

    // If no credentials configured, log warning
    if (!twilioClient && !sendgridKey) {
      console.warn('⚠️  No Twilio or SendGrid credentials configured. Alerts were not sent.');
      return NextResponse.json({ 
        message: 'No alert services configured. Please add Twilio/SendGrid credentials to .env.local',
        sent: false,
        contactCount: contacts.length 
      });
    }

    return NextResponse.json({ 
      message: hasVerificationIssues 
        ? 'Alerts processed (phone numbers need verification in Twilio)'
        : 'Alerts processed',
      sent: results.calls > 0 || results.sms > 0 || results.emails > 0,
      results,
      contactCount: contacts.length,
      verificationNeeded: hasVerificationIssues
    });

  } catch (error) {
    console.error('Alert error:', error);
    return NextResponse.json(
      { error: 'Failed to send alerts' },
      { status: 500 }
    );
  }
}
