'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hook/authContext';

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (email, password) => {
    setError('');
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Credenciales incorrectas');
      const data = await res.json();
      login(data.token);
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect') || '/';
      router.push(redirectUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  return { handleLogin, error };
}
