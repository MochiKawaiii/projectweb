const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const hasValue = (value) => Boolean(String(value || '').trim());
const isPlaceholder = (value) => String(value || '').includes('your_email');
const getAppPassword = () => String(MyConstants.EMAIL_PASS || '').replace(/\s+/g, '');
const getOtpLifetimeMinutes = () => Math.max(1, Math.round(Number(MyConstants.OTP_EXPIRES_MS || 0) / 60000));

const EmailUtil = {
  isConfigured() {
    return hasValue(MyConstants.EMAIL_USER)
      && hasValue(MyConstants.EMAIL_PASS)
      && !isPlaceholder(MyConstants.EMAIL_USER)
      && !isPlaceholder(MyConstants.EMAIL_PASS);
  },

  createTransporter() {
    return nodemailer.createTransport({
      service: MyConstants.EMAIL_SERVICE || 'gmail',
      auth: {
        user: MyConstants.EMAIL_USER,
        pass: getAppPassword(),
      },
    });
  },

  async sendOtp(email, otp, customerName = '') {
    if (!this.isConfigured()) return false;

    const transporter = this.createTransporter();
    const expiresInMinutes = getOtpLifetimeMinutes();
    const safeName = String(customerName || '').trim() || 'there';
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <p>Hello ${safeName},</p>
        <p>Your WHENEVER Atelier verification code is:</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:8px;margin:24px 0">${otp}</p>
        <p>This code will expire in ${expiresInMinutes} minutes.</p>
        <p>If you did not request this signup, you can ignore this email.</p>
      </div>
    `;
    const text = [
      `Hello ${safeName},`,
      '',
      'Your WHENEVER Atelier verification code is:',
      otp,
      '',
      `This code will expire in ${expiresInMinutes} minutes.`,
      'If you did not request this signup, you can ignore this email.',
    ].join('\n');

    return new Promise((resolve) => {
      transporter.sendMail(
        {
          from: MyConstants.EMAIL_USER,
          to: email,
          subject: 'WHENEVER Atelier | Your verification code',
          text,
          html,
        },
        (err) => {
          if (err) {
            console.error('Email send failed:', err.message);
            resolve(false);
            return;
          }
          resolve(true);
        }
      );
    });
  },
};

module.exports = EmailUtil;
