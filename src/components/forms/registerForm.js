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
        placeholder="Nombre"
        className="w-full p-2 border rounded"
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <input
        {...register('email')}
        type="email"
        placeholder="Correo"
        className="w-full p-2 border rounded"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <input
        {...register('password')}
        type="password"
        placeholder="Contraseña"
        className="w-full p-2 border rounded"
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <input
        {...register('confirmPassword')}
        type="password"
        placeholder="Repite la contraseña"
        className="w-full p-2 border rounded"
      />
      {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

      <select {...register('role')} className="w-full p-2 border rounded">
        <option value="">Selecciona un rol</option>
        <option value="user">Usuario</option>
        <option value="organizer">Organizador</option>
      </select>
      {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded cursor-pointer">
        Registrarse
      </button>
    </form>
  );
}
