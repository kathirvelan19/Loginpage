// Loginpage/backend/server.js (Your backend file)

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express(); // Initialize Express app

// IMPORTANT: For Vercel serverless functions, you should remove app.listen()
// const PORT = process.env.PORT || 5000; // This line can be removed or commented out

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // Ensure this is a boolean
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
                    <a href="https://loginpage-1jlc.onrender.com/dashboard"
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

// CRUCIAL: Export the app instance for Vercel to use as a serverless function
module.exports = app;

// REMOVE or COMMENT OUT this line for Vercel deployment:
// app.listen(PORT, () => {
//   console.log(`Backend server running on port ${PORT}`);
// });```

---

### **2. Frontend Code (`pages/Login.tsx`)**

**File Path:** `Loginpage/pages/Login.tsx`

The change is still to use the relative path `/api/notify-login` in the `fetch` call.

```typescript
// Loginpage/pages/Login.tsx (Your frontend Login component)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Corrected path
import { UserCredential } from 'firebase/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, googleSignIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("Login: User detected in useEffect, navigating to dashboard. User email:", user.email);
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const sendLoginNotification = async (userEmail: string | null, userName: string | null = null) => {
    console.log(`Login: Attempting to send login notification for email: ${userEmail}, name: ${userName}`);
    if (!userEmail) {
      console.error('Login: sendLoginNotification received no userEmail. Aborting notification.');
      return;
    }
    try {
      // CHANGE THIS LINE: Use the relative /api/notify-login path
      const response = await fetch('/api/notify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: userEmail, userName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login: Failed to send login notification. Backend response:', response.status, errorData);
        // Do NOT set UI error here, as the user is already logged in
      } else {
        console.log('Login: Login notification email request sent successfully to backend.');
      }
    } catch (notificationError) {
      console.error('Login: Error calling login notification API (network or server not reachable):', notificationError);
      // Do NOT set UI error here, as the user is already logged in
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential: UserCredential = await login(email, password);
      console.log("Login: Email/Password login successful for", userCredential.user.email);

      await sendLoginNotification(
        userCredential.user.email,
        userCredential.user.displayName
      );

    } catch (err: any) {
      console.error('Login: Email/Password login error:', err.code, err.message);
      if (err.code === 'auth/invalid-email' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      }
      else {
        setError('Failed to sign in. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    console.log("Login: Google Sign-In button clicked.");

    try {
      const userCredential: UserCredential = await googleSignIn();
      console.log("Login: Google sign-in successful. UserCredential object:", userCredential); // Log the full object

      const userEmail = userCredential.user.email;
      const userName = userCredential.user.displayName;

      console.log(`Login: User email from Google login: ${userEmail}`);
      console.log(`Login: User display name from Google login: ${userName}`);

      // Now attempt to send the notification
      await sendLoginNotification(userEmail, userName);

    } catch (err: any) {
      console.error('Login: Google Sign-In authentication error:', err.code || 'Unknown', err.message || 'No message');
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in window closed. Please try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Another Google sign-in request is already in progress.');
      } else {
        setError('Failed to sign in with Google. Please try again. Check console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #0b0f1a 0%, #0e1220 50%, #090c16 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, Segoe UI, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '32px',
          borderRadius: '18px',
          background: '#111527',
          border: '1px solid rgba(139,92,246,0.25)',
          boxShadow: `
            0 10px 40px rgba(0,0,0,0.6),
            0 0 30px rgba(139,92,246,0.25)
          `,
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            color: '#ffffff',
            fontSize: '26px',
            fontWeight: 600,
            marginBottom: '6px',
          }}
        >
          Sign in to MoneyMateX
        </h2>

        <p
          style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#a5b4fc',
            marginBottom: '28px',
          }}
        >
          Manage your finances securely
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '16px',
            borderRadius: '12px',
            background: '#0b1020',
            border: '1px solid #1f2545',
            color: '#ffffff',
            fontSize: '14px',
            outline: 'none',
            transition: 'border 0.2s ease, box-shadow 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.border = '1px solid #8b5cf6';
            e.target.style.boxShadow =
              '0 0 0 3px rgba(139,92,246,0.25)';
          }}
          onBlur={(e) => {
            e.target.style.border = '1px solid #1f2545';
            e.target.style.boxShadow = 'none';
          }}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '18px',
            borderRadius: '12px',
            background: '#0b1020',
            border: '1px solid #1f2545',
            color: '#ffffff',
            fontSize: '14px',
            outline: 'none',
            transition: 'border 0.2s ease, box-shadow 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.border = '1px solid #8b5cf6';
            e.target.style.boxShadow =
              '0 0 0 3px rgba(139,92,246,0.25)';
          }}
          onBlur={(e) => {
            e.target.style.border = '1px solid #1f2545';
            e.target.style.boxShadow = 'none';
          }}
        />

        {error && (
          <p
            style={{
              color: '#f87171',
              fontSize: '13px',
              textAlign: 'center',
              marginBottom: '12px',
            }}
          >
            {error}
          </p>
        )}

        {/* SIGN IN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            color: '#ffffff',
            border: 'none',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(139,92,246,0.35)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            marginBottom: '12px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow =
              '0 10px 30px rgba(139,92,246,0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 8px 24px rgba(139,92,246,0.35)';
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        {/* GOOGLE SIGN IN BUTTON */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            background: '#e4e8edff', // Google blue
            color: '#05cbeeff',
            border: 'none',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(66, 133, 244, 0.35)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow =
              '0 10px 30px rgba(66, 133, 244, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 8px 24px rgba(66, 133, 244, 0.35)';
          }}
        >
          {loading ? 'Signing in with Google…' : (
            <>
              <svg
                style={{ marginRight: '10px' }}
                width="18"
                height="18"
                viewBox="0 0 18 18"
                aria-hidden="true"
              >
                <path
                  d="M9 3.48c1.69 0 2.83 1.22 3.45 1.79l2.85-2.84C14.16 1.16 12.13 0 9 0 5.4 0 2.2 2.02.59 5.09l3.05 2.33C4.84 5.92 6.7 3.48 9 3.48z"
                  fill="#ea4335"
                ></path>
                <path
                  d="M17.64 9.2c0-.62-.05-1.16-.14-1.63H9v3.08h4.74c-.21 1.13-.88 1.94-1.93 2.53l2.89 2.22c1.74-1.6 2.72-3.9 2.72-6.19z"
                  fill="#4285f4"
                ></path>
                <path
                  d="M3.58 10.74c-.11-.32-.18-.65-.18-.99s.07-.67-.18-.99L.59 5.09C.22 5.86 0 6.69 0 7.5c0 1.05.28 2.05.79 2.87l3.05 2.33c-.02-.68-.13-1.35-.13-2.03z"
                  fill="#fbbc05"
                ></path>
                <path
                  d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.89-2.22c-.78.58-1.9.95-3.07.95-2.29 0-4.23-1.55-4.9-3.61L.59 12.91C2.2 15.98 5.4 18 9 18z"
                  fill="#34a853"
                ></path>
              </svg>
              Sign in with Google
            </>
          )}
        </button>


        <p
          style={{
            marginTop: '22px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#9ca3af',
          }}
        >
          Don’t have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: '#a78bfa',
              fontWeight: 500,
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
