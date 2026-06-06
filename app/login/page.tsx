'use client';
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { signIn, error, loading } = useAuth();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    setSubmitting(true);
    await signIn(email, password);
    setSubmitting(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', position: 'relative', zIndex: 1,
    }}>
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(0,212,255,0.08)', animation: 'spin 20s linear infinite' }} />
      <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(0,212,255,0.05)', animation: 'spin 14s linear infinite reverse' }} />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .inp { width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 2px; color: var(--text-primary); font-family: var(--font-mono); font-size: 12px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .inp:focus { border-color: rgba(0,212,255,0.5); }
        .inp::placeholder { color: var(--text-muted); }
        .btn:hover { background: rgba(0,212,255,0.2) !important; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

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

        {error && (
          <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(255,68,102,0.1)', border: '1px solid rgba(255,68,102,0.3)', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ff4466' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          <input
            className="inp"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKey}
            autoComplete="email"
          />
          <input
            className="inp"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKey}
            autoComplete="current-password"
          />
        </div>

        <button
          className="btn"
          onClick={handleSubmit}
          disabled={submitting || loading}
          style={{
            width: '100%', padding: '13px 24px',
            background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.35)',
            borderRadius: 2, cursor: 'pointer', color: '#00d4ff',
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em',
            transition: 'all 0.2s',
          }}
        >
          {submitting ? 'SIGNING IN...' : 'SIGN IN'}
        </button>

        <div style={{ marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          LEAP-HABSAT-01 · AUTHORIZED PERSONNEL ONLY
        </div>
      </div>
    </div>
  );
}