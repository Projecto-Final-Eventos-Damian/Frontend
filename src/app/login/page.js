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
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {showRegister ? 'Crear cuenta' : 'Iniciar sesión'}
        </h1>

        {showRegister ? (
          <>
            <RegisterForm onSubmit={handleRegister} />
            <p className="text-sm mt-4 text-center">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => setShowRegister(false)}
                className="text-blue-500 hover:underline"
              >
                Iniciar sesión
              </button>
            </p>
          </>
        ) : (
          <>
            <LoginForm onSubmit={handleLogin} />
            <p className="text-sm mt-4 text-center">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => setShowRegister(true)}
                className="text-blue-500 hover:underline"
              >
                Registrarse
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}