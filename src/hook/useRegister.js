'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hook/authContext';
import { registerUser } from '@/services';
import { toast } from 'react-hot-toast';

export function useRegister() {
  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = async ({ name, email, password, role }) => {
    try {
      const data = await registerUser(name, email, password, role);
      login(data.token);
      toast.success('¡Registro exitoso!');
      router.push('/');
    } catch (err) {
      toast.error(err.message || 'Error al registrarse');
    }
  };

  return { handleRegister };
}
