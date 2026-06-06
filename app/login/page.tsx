'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { signInWithMicrosoft, error, loading } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Rings */}
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '1px solid rgba(0,212,255,0.1)',
          animation: 'spin 20s linear infinite',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '1px solid rgba(0,212,255,0.05)',
          animation: 'spin 15s linear infinite reverse',
        }}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .login-btn:hover {
          background: rgba(0,212,255,0.15) !important;
          transform: translateY(-1px);
        }

        .login-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div
        className="panel"
        style={{
          width: 420,
          padding: '48px 40px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 0 60px rgba(0,212,255,0.08)',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            style={{ margin: '0 auto 16px' }}
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              stroke="#00d4ff"
              strokeWidth="1.5"
              strokeDasharray="8 4"
            />
            <circle cx="24" cy="12" r="6" fill="#00d4ff" />
            <path d="M24 18 L20 30 L24 27 L28 30 Z" fill="#00d4ff" />
          </svg>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              letterSpacing: '0.25em',
              color: '#00d4ff',
              marginBottom: 8,
            }}
          >
            HAB·TELEM
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
            }}
          >
            MISSION CONTROL · SECURE ACCESS
          </div>
        </div>

        <div
          style={{
            height: 1,
            background:
              'linear-gradient(90deg, transparent, var(--border-bright), transparent)',
            marginBottom: 32,
          }}
        />

        <div
          style={{
            marginBottom: 24,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}
        >
          Access restricted to
          <br />
          <span style={{ color: '#00d4ff' }}>
            @gst.sies.edu.in
          </span>{' '}
          accounts only
        </div>

        {error && (
          <div
            style={{
              marginBottom: 20,
              padding: '10px 16px',
              background: 'rgba(255,68,102,0.1)',
              border: '1px solid rgba(255,68,102,0.3)',
              borderRadius: 2,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: '#ff4466',
            }}
          >
            {error}
          </div>
        )}

        <button
          className="login-btn"
          onClick={signInWithMicrosoft}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: 2,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            transition: 'all 0.2s ease',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.08em',
            opacity: loading ? 0.7 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 23 23">
            <path fill="#f25022" d="M1 1h10v10H1z" />
            <path fill="#00a4ef" d="M12 1h10v10H12z" />
            <path fill="#7fba00" d="M1 12h10v10H1z" />
            <path fill="#ffb900" d="M12 12h10v10H12z" />
          </svg>

          {loading
            ? 'INITIALIZING...'
            : 'SIGN IN WITH MICROSOFT'}
        </button>

        <div
          style={{
            marginTop: 24,
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}
        >
          USE YOUR SIES MICROSOFT ACCOUNT
        </div>
      </div>
    </div>
  );
}