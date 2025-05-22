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
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <input
          {...register('name')}
          placeholder="Nombre de la categoría"
          className="w-full p-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register('description')}
          placeholder="Descripción"
          className="w-full p-2 border rounded"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <button type="submit" className="w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded">
        Crear Categoría
      </button>

      <button
        type="button"
        onClick={() => router.back()}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Volver
      </button>
    </form>
  );
}
