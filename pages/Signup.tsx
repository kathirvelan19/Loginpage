import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // --- Inline CSS helper ---
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    marginBottom: '14px',
    borderRadius: '12px',
    background: '#0b1020',
    border: '1px solid #1f2545',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border 0.2s ease, box-shadow 0.2s ease',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border = '1px solid #8b5cf6';
    e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.25)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border = '1px solid #1f2545';
    e.target.style.boxShadow = 'none';
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);

      // Send welcome email
      try {
        const emailResponse = await fetch('https://kathirvelan19.github.io/loginpage/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toEmail: email,
            userName: name || 'User',
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send welcome email:', await emailResponse.json());
        } else {
          console.log('Welcome email request sent successfully.');
        }
      } catch (emailErr) {
        console.error('Error calling welcome email API:', emailErr);
      }
    } catch (err: any) {
      console.error('Signup error:', err.code, err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please log in or use a different email.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0b0f1a 0%, #0e1220 50%, #090c16 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, Segoe UI, sans-serif',
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '34px',
          borderRadius: '18px',
          background: '#111527',
          border: '1px solid rgba(139,92,246,0.25)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 30px rgba(139,92,246,0.25)',
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
          Create your account
        </h2>

        <p
          style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#a5b4fc',
            marginBottom: '26px',
          }}
        >
          Join MoneyMateX and manage smarter
        </p>

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <input
          type="password"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ ...inputStyle, marginBottom: '18px' }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {error && (
          <p style={{ color: '#f87171', fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
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
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(139,92,246,0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.35)';
          }}
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        <p
          style={{
            marginTop: '22px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#9ca3af',
          }}
        >
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#a78bfa', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
