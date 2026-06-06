'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth, OAuthProvider, signInWithRedirect,
  getRedirectResult, signOut, onAuthStateChanged, type User
} from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL:       process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithMicrosoft: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, error: null,
  signInWithMicrosoft: async () => {}, logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let handled = false;

    // Step 1: Check redirect result first
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          handled = true;
          setUser(result.user);
          setLoading(false);
          window.location.replace('/dashboard');
        }
      })
      .catch((err) => {
        console.error('Redirect result error:', err);
        if (err.code !== 'auth/no-redirect-operation-pending') {
          setError('Sign-in failed. Please try again.');
        }
      })
      .finally(() => {
        if (!handled) {
          // Step 2: Check if already logged in
          const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
            if (u) {
              const path = window.location.pathname;
              if (!path.startsWith('/dashboard')) {
                window.location.replace('/dashboard');
              }
            }
          });
          return () => unsub();
        }
      });
  }, []);

  const signInWithMicrosoft = async () => {
    setError(null);
    try {
      const provider = new OAuthProvider('microsoft.com');
      provider.setCustomParameters({
        tenant: '405ddc34-d660-46e5-b52d-bfd0be156bb5',
      });
      await signInWithRedirect(auth, provider);
    } catch (err: any) {
      setError('Sign-in failed. Please try again.');
      console.error(err);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    window.location.replace('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithMicrosoft, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);