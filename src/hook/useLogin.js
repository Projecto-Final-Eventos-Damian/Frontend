'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hook/authContext';
import { loginUser } from '@/services/petitions';

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (email, password) => {
    setError('');
    try {
      const data = await loginUser(email, password);
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
