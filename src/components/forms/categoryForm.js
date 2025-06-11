'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { categorySchema } from '@/schemas/categorySchema';

export default function CategoryForm({ onSubmit }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const submitHandler = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div>
        <input
          {...register('name')}
          placeholder="Nombre de la categoría"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register('description')}
          placeholder="Descripción"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-2xl transition-colors"
      >
        Crear Categoría
      </button>

      <button
        type="button"
        onClick={() => router.back()}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-2xl transition-colors"
      >
        Volver
      </button>
    </form>
  );
}