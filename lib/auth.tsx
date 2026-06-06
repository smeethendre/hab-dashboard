'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  OAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithMicrosoft: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithMicrosoft: async () => {},
  logout: async () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  console.log('========== AUTH INITIALIZING ==========');

  console.log('HOSTNAME:', window.location.hostname);
  console.log('URL:', window.location.href);

  console.log('FIREBASE CONFIG');
  console.log('AUTH DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log('PROJECT ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

  getRedirectResult(auth)
    .then((result) => {
      console.log('========== REDIRECT RESULT ==========');
      console.log(result);

      if (result?.user) {
        console.log('REDIRECT LOGIN SUCCESS');
        console.log('UID:', result.user.uid);
        console.log('EMAIL:', result.user.email);
      } else {
        console.log('REDIRECT RESULT IS NULL');
      }
    })
    .catch((err) => {
      console.error('========== REDIRECT ERROR ==========');
      console.error(err);
      console.error('CODE:', err?.code);
      console.error('MESSAGE:', err?.message);
    });

  const unsub = onAuthStateChanged(auth, (u) => {
    console.log('========== AUTH STATE CHANGED ==========');
    console.log(u);

    setUser(u);
    setLoading(false);

    if (u) {
      console.log('USER LOGGED IN');
      console.log('UID:', u.uid);
      console.log('EMAIL:', u.email);

      if (
        window.location.pathname === '/' ||
        window.location.pathname === '/login'
      ) {
        console.log('REDIRECTING TO DASHBOARD');
        window.location.href = '/dashboard';
      }
    } else {
      console.log('NO AUTHENTICATED USER');
    }
  });

  return () => unsub();
}, []);

  const signInWithMicrosoft = async () => {
  try {
    setError(null);

    console.log('========== LOGIN START ==========');

    const provider = new OAuthProvider('microsoft.com');

    console.log('CALLING signInWithRedirect');

    await signInWithRedirect(auth, provider);

    console.log('REDIRECT INITIATED');
  } catch (err: any) {
    console.error('========== LOGIN ERROR ==========');
    console.error(err);

    setError(err?.message || 'Sign-in failed');
  }
};

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithMicrosoft,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);