import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'UniIntern <onboarding@resend.dev>';

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Your UniIntern Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #1a2b4a; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎓 UniIntern</h1>
        </div>
        
        <h2 style="color: #1a2b4a;">Verify Your Email Address</h2>
        <p style="color: #6b7280;">Thank you for joining UniIntern. Use the verification code below to complete your registration.</p>
        
        <div style="background-color: #f0f2f5; border-radius: 10px; padding: 30px; text-align: center; margin: 20px 0;">
          <p style="color: #6b7280; margin: 0 0 10px;">Your verification code is:</p>
          <h1 style="color: #1a2b4a; font-size: 48px; letter-spacing: 10px; margin: 0;">${otp}</h1>
          <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0;">This code expires in 10 minutes</p>
        </div>
        
        <p style="color: #6b7280; font-size: 12px;">If you did not create an account with UniIntern, please ignore this email.</p>
        
        <div style="border-top: 1px solid #e5e7eb; margin-top: 20px; padding-top: 20px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px;">© 2024 UniIntern Application Tracking System</p>
        </div>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
};
