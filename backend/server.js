// backend/server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer configuration error:', error);
  } else {
    console.log('Nodemailer ready to send emails');
  }
});

app.post('/send-welcome-email', async (req, res) => {
  const { toEmail, userName } = req.body;

  if (!toEmail) {
    return res.status(400).json({ message: 'Recipient email is required.' });
  }

 const mailOptions = {
  from: process.env.EMAIL_FROM,
  to: toEmail,
  subject: '🎉 Welcome to MoneyMateX — Your Smart Finance Partner',
  html: `
  <div style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 15px;">
          
          <!-- Main Card -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.08); overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#2563eb,#0ea5e9); padding:30px; text-align:center;">
                <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:700;">
                  Welcome to MoneyMateX 🎉
                </h1>
                <p style="margin:10px 0 0; color:#e0f2fe; font-size:15px;">
                  Smarter way to manage your money
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:35px 30px; color:#374151;">
                <p style="font-size:16px; margin:0 0 15px;">
                  Hello <strong>${userName || 'User'}</strong>,
                </p>

                <p style="font-size:15px; line-height:1.6; margin:0 0 15px;">
                  Welcome to <strong>MoneyMateX</strong>! 🎯  
                  Your account has been successfully created, and we’re excited to have you onboard.
                </p>

                <p style="font-size:15px; line-height:1.6; margin:0 0 20px;">
                  With MoneyMateX, you can effortlessly:
                </p>

                <ul style="padding-left:20px; margin:0 0 25px; font-size:15px; line-height:1.7;">
                  <li>📊 Track your expenses & income</li>
                  <li>💡 Understand your spending habits</li>
                  <li>🎯 Achieve your financial goals faster</li>
                </ul>

                <!-- Button -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="https://kathirvelan19.github.io/loginpage/dashboard"
                     style="background:#2563eb; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:8px; font-size:15px; font-weight:600; display:inline-block;">
                    Go to Dashboard →
                  </a>
                </div>

                <p style="font-size:14px; line-height:1.6; margin:0;">
                  If you ever need help, our support team is always here for you.
                </p>

                <p style="margin-top:20px; font-size:14px;">
                  Cheers,<br/>
                  <strong>MoneyMateX Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#6b7280;">
                <p style="margin:0 0 8px;">
                  © ${new Date().getFullYear()} MoneyMateX. All rights reserved.
                </p>
                <p style="margin:0;">
                  If you didn’t create this account, please ignore this email.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
  `,
};


  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${toEmail}`);
    res.status(200).json({ message: 'Welcome email sent successfully.' });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ message: 'Failed to send welcome email.', error: error.message });
  }
});

app.post('/notify-login', async (req, res) => {
  const { toEmail, userName } = req.body;

  if (!toEmail) {
    return res.status(400).json({ message: 'Recipient email is required.' });
  }
 const mailOptions = {
  from: process.env.EMAIL_FROM,
  to: toEmail,
  subject: '🔐 Successful Login to Your MoneyMateX Account',
  html: `
  <div style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 15px;">

          <!-- Main Card -->
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.08); overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#0f766e,#22c55e); padding:28px; text-align:center;">
                <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700;">
                  Login Successful 🔐
                </h1>
                <p style="margin:8px 0 0; color:#dcfce7; font-size:14px;">
                  Your MoneyMateX account was accessed
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px 30px; color:#374151;">
                <p style="font-size:16px; margin:0 0 14px;">
                  Hello <strong>${userName || 'User'}</strong>,
                </p>

                <p style="font-size:15px; line-height:1.6; margin:0 0 18px;">
                  This is to inform you that a successful login to your
                  <strong>MoneyMateX</strong> account was detected.
                </p>

                <!-- Info Box -->
                <table width="100%" cellpadding="0" cellspacing="0"
                  style="background:#f0fdf4; border-left:4px solid #22c55e; border-radius:8px; margin-bottom:20px;">
                  <tr>
                    <td style="padding:14px 16px; font-size:14px; color:#166534;">
                      <strong>🕒 Login Time:</strong>
                      ${new Date().toLocaleString()}
                    </td>
                  </tr>
                </table>

                <p style="font-size:14px; line-height:1.6; margin:0 0 20px;">
                  If this was you, no action is required.  
                  If you do not recognize this activity, please secure your account immediately.
                </p>

                <!-- Action Button -->
                <div style="text-align:center; margin:28px 0;">
                  <a href="https://kathirvelan19.github.io/loginpage/login"
                     style="background:#0f766e; color:#ffffff; text-decoration:none;
                            padding:13px 26px; border-radius:8px;
                            font-size:14px; font-weight:600; display:inline-block;">
                    Review Account Activity
                  </a>
                </div>

                <p style="font-size:14px; margin-top:20px;">
                  Stay safe,<br/>
                  <strong>MoneyMateX Security Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:18px; text-align:center; font-size:12px; color:#6b7280;">
                <p style="margin:0 0 6px;">
                  This is an automated security notification. Please do not reply.
                </p>
                <p style="margin:0;">
                  © ${new Date().getFullYear()} MoneyMateX. All rights reserved.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
  `,
};


   try {
    await transporter.sendMail(mailOptions);
    console.log(`Login notification email sent to ${toEmail}`);
    res.status(200).json({ message: 'Login notification email sent successfully.' });
  } catch (error) {
    console.error('Error sending login notification email:', error);
    res.status(500).json({ message: 'Failed to send login notification email.', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

