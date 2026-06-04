'use client';
import React from 'react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { signInWithGoogle, error, loading } = useAuth();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', position: 'relative', zIndex: 1,
    }}>
      {/* Animated ring */}
      <div style={{
        position: 'absolute',
        width: 400, height: 400,
        borderRadius: '50%',
        border: '1px solid rgba(0,212,255,0.1)',
        animation: 'spin 20s linear infinite',
      }} />
      <div style={{
        position: 'absolute',
        width: 300, height: 300,
        borderRadius: '50%',
        border: '1px solid rgba(0,212,255,0.06)',
        animation: 'spin 15s linear infinite reverse',
      }} />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .login-btn:hover { background: rgba(0,212,255,0.15) !important; transform: translateY(-1px); }
        .login-btn:active { transform: translateY(0); }
      `}</style>

      <div className="panel" style={{
        width: 420, padding: '48px 40px', textAlign: 'center',
        position: 'relative', zIndex: 2,
        boxShadow: '0 0 60px rgba(0,212,255,0.08)',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 16px' }}>
            <circle cx="24" cy="24" r="22" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="8 4" />
            <circle cx="24" cy="12" r="6" fill="#00d4ff" />
            <path d="M24 18 L20 30 L24 27 L28 30 Z" fill="#00d4ff" />
            <circle cx="24" cy="24" r="2" fill="rgba(0,212,255,0.3)" />
          </svg>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.25em', color: '#00d4ff', marginBottom: 8 }}>
            HAB·TELEM
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
            MISSION CONTROL · SECURE ACCESS
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--border-bright), transparent)', marginBottom: 32 }} />

        <div style={{ marginBottom: 24, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Access restricted to<br />
          <span style={{ color: '#00d4ff' }}>@gst.sies.edu.in</span> accounts only
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: 20, padding: '10px 16px',
            background: 'rgba(255,68,102,0.1)', border: '1px solid rgba(255,68,102,0.3)',
            borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ff4466',
          }}>
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          className="login-btn"
          onClick={signInWithGoogle}
          disabled={loading}
          style={{
            width: '100%', padding: '14px 24px',
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: 2, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            transition: 'all 0.2s ease', color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em',
          }}
        >
          {/* Google icon */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'SIGNING IN...' : 'SIGN IN WITH GOOGLE'}
        </button>

        <div style={{ marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          UNAUTHORIZED ACCESS IS PROHIBITED
        </div>
      </div>
    </div>
  );
}
