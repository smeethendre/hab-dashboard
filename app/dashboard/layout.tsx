'use client';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.replace('/login');
    }
  }, [user, loading]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.15em' }}>
      AUTHENTICATING...
    </div>
  );

  if (!user) return null;
  return <>{children}</>;
}