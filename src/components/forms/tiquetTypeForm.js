'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ticketTypeSchema } from '@/schemas/tiquetTypeSchema';

export default function TicketTypeForm({
  onSubmit,
  initialData = { name: '', description: '', price: '' },
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ticketTypeSchema),
    defaultValues: initialData,
  });

  const submitHandler = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <input
          type="text"
          {...register('name')}
          className="w-full p-2 border rounded"
          placeholder="Nombre del ticket"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register('description')}
          className="w-full p-2 border rounded"
          placeholder="Descripción"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <input
          type="number"
          step="0.01"
          {...register('price')}
          className="w-full p-2 border rounded"
          placeholder="Precio"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <button type="submit" className="w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded">
        Guardar cambios
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
