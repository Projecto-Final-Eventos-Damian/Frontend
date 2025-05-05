'use client';

import { useLogin } from '@/hook/useLogin';
import LoginForm from '@/components/forms/loginForm';

export default function LoginPage() {
  const { handleLogin, error } = useLogin();

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      <LoginForm onSubmit={handleLogin} error={error} />
    </div>
  );
}