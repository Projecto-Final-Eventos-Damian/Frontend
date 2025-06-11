'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/schemas/loginSchema';

export default function LoginForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const submitHandler = (data) => {
    onSubmit(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <input
        {...register('email')}
        type="email"
        placeholder="Correo electrónico"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <input
        {...register('password')}
        type="password"
        placeholder="Contraseña"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-colors"
      >
        Entrar
      </button>
    </form>
  );
}
