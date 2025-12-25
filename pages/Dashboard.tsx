import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, Segoe UI, sans-serif',
        background: 'linear-gradient(180deg, #0b0f1a 0%, #0e1220 50%, #090c16 100%)',
        padding: '40px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px',
          borderRadius: '20px',
          background: '#111527',
          border: '1px solid rgba(139,92,246,0.25)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 30px rgba(139,92,246,0.25)',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '12px',
          }}
        >
          🎉 Welcome to MoneyMateX!
        </h1>

        {user && (
          <p
            style={{
              fontSize: '16px',
              color: '#a5b4fc',
              marginBottom: '30px',
            }}
          >
            You are logged in as{' '}
            <span style={{ fontWeight: 600, color: '#8b5cf6' }}>
              {user.email || user.displayName || 'User'}
            </span>
            .
          </p>
        )}

        <button
          onClick={handleLogout}
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
          {loading ? 'Logging out…' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
