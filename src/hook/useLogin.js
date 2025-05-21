'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hook/authContext';
import { loginUser } from '@/services';
import { toast } from 'react-hot-toast';

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      login(data.token);
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect') || '/';
      router.push(redirectUrl);
    } catch (err) {
      toast.error(err.message || 'Error al iniciar sesión');
    }
  };

  return { handleLogin };
}
