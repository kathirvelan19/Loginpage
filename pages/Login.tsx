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
      const response = await fetch('https://loginpage-1jlc.onrender.com/notify-login', {
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
      } else if (err.code === 'auth/too-many-requests') {http://
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
