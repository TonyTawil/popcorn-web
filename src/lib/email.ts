import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  verificationUrl: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: 'hello@antoinetawil.com',
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #333; text-align: center; font-size: 24px; margin-bottom: 20px;">
            Verify your email address
          </h1>
          <p style="color: #666; text-align: center; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            Thanks for signing up! Please click the button below to verify your email address.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}"
               style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
              Verify Email
            </a>
          </div>
          <p style="color: #666; text-align: center; font-size: 14px; margin-top: 30px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              This is an automated email, please do not reply.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
} 