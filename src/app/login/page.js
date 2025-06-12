'use client';

import { useLogin } from '@/hook/useLogin';
import { useRegister } from '@/hook/useRegister';
import LoginForm from '@/components/forms/loginForm';
import RegisterForm from '@/components/forms/registerForm';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Parte izquierda - visible solo en pantallas menores a lg */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8 space-y-4 hidden lg:flex">
        <h1 className="text-5xl font-bold text-center text-gray-800 max-w-xs">Bienvenido a</h1>
        <div className="relative w-70 h-15">
          <Image
            src='/logo-text.png'
            alt="EventMix"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="relative w-40 h-40">
          <Image
            src='/logo-icon.png'
            alt="EventMix Icon"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Parte derecha - ancho 100% en pantallas pequeñas, 50% en pantallas grandes */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center bg-cover bg-center relative min-h-screen"
        style={{ backgroundImage: "url('/fondo-login.jpg')" }}
      >
        {/* Card de login/register */}
        <div className="relative bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg w-full max-w-sm z-10 m-5">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {showRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>

          {showRegister ? (
            <>
              <RegisterForm onSubmit={handleRegister} />
              <p className="text-sm mt-4 text-center text-gray-700">
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
              <p className="text-sm mt-4 text-center text-gray-700">
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
    </div>
  );
}
