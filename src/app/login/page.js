'use client';

import { useLogin } from '@/hook/useLogin';
import { useRegister } from '@/hook/useRegister';
import LoginForm from '@/components/forms/loginForm';
import RegisterForm from '@/components/forms/registerForm';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const { handleLogin } = useLogin();
  const { handleRegister } = useRegister();
  const searchParams = useSearchParams();
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const registerParam = searchParams.get('register');
    if (registerParam === '1') {
      setShowRegister(true);
    }
  }, [searchParams]);

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {showRegister ? 'Crear cuenta' : 'Iniciar sesión'}
      </h1>

      {showRegister ? (
        <>
          <RegisterForm onSubmit={handleRegister} />
          <p className="text-sm mt-4">
            ¿Ya tienes cuenta?{' '}
            <button onClick={() => setShowRegister(false)} className="text-blue-500 underline cursor-pointer">
              Iniciar sesión
            </button>
          </p>
        </>
      ) : (
        <>
          <LoginForm onSubmit={handleLogin} />
          <p className="text-sm mt-4">
            ¿No tienes cuenta?{' '}
            <button onClick={() => setShowRegister(true)} className="text-blue-500 underline cursor-pointer">
              Registrarse
            </button>
          </p>
        </>
      )}
    </div>
  );
}
