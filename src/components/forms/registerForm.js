'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/schemas/registerSchema';

export default function RegisterForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const submitHandler = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <input
        {...register('name')}
        placeholder="Nombre completo"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

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

      <input
        {...register('confirmPassword')}
        type="password"
        placeholder="Repite la contraseña"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

      <select
        {...register('role')}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Selecciona un rol</option>
        <option value="user">Usuario</option>
        <option value="organizer">Organizador</option>
      </select>
      {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-colors"
      >
        Registrarse
      </button>
    </form>
  );
}