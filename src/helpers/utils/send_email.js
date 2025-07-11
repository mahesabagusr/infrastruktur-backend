import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { config } from '../infra/global_config.js';

const generateOtp = () => {
  const otp = crypto.randomInt(11111, 99999).toString();
  const expirationTime = Date.now() + 3600000;
  return { otp, expirationTime };
}

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: config.nodemailerConfig
    });

    const mailOptions = {
      from: config.nodemailerConfig.email,
      to: email,
      subject: 'Email OTP Verification',
      text: `Your OTP Verification: ${otp}`
    }

    const result = await transporter.sendMail(mailOptions)
    return result;

  } catch (err) {
    return new Error(err.message)
  }
};

export { generateOtp, sendEmail }