'use client';
import React from 'react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { signInWithMicrosoft, error, loading } = useAuth();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', position: 'relative', zIndex: 1,
    }}>
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(0,212,255,0.08)', animation: 'spin 20s linear infinite' }} />
      <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(0,212,255,0.05)', animation: 'spin 14s linear infinite reverse' }} />

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <div className="panel" style={{ width: 400, padding: '48px 40px', textAlign: 'center', position: 'relative', zIndex: 2, boxShadow: '0 0 60px rgba(0,212,255,0.06)' }}>

        <div style={{ marginBottom: 32 }}>
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 14px' }}>
            <circle cx="24" cy="24" r="22" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="8 4" />
            <circle cx="24" cy="12" r="6" fill="#00d4ff" />
            <path d="M24 18 L20 30 L24 27 L28 30 Z" fill="#00d4ff" />
          </svg>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.25em', color: '#00d4ff', marginBottom: 6 }}>
            HAB·TELEM
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
            MISSION CONTROL · SECURE ACCESS
          </div>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--border-bright), transparent)', marginBottom: 28 }} />

        <div style={{ marginBottom: 24, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          RESTRICTED TO <span style={{ color: '#00d4ff' }}>@SIES.EDU.IN</span> ACCOUNTS
        </div>

        {error && (
          <div style={{ marginBottom: 20, padding: '10px 14px', background: 'rgba(255,68,102,0.1)', border: '1px solid rgba(255,68,102,0.3)', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ff4466' }}>
            {error}
          </div>
        )}

        <button
          onClick={signInWithMicrosoft}
          disabled={loading}
          style={{
            width: '100%', padding: '14px 24px',
            background: 'rgba(0,120,212,0.1)', border: '1px solid rgba(0,120,212,0.4)',
            borderRadius: 2, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            color: '#60a5fa', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em',
            transition: 'all 0.2s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
          </svg>
          {loading ? 'SIGNING IN...' : 'SIGN IN WITH MICROSOFT'}
        </button>

        <div style={{ marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          USE YOUR SIES.EDU.IN MICROSOFT ACCOUNT
        </div>
      </div>
    </div>
  );
}