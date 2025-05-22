'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEventSchema, editEventSchema } from '@/schemas/eventSchema';
import { getCategories } from '@/services';

export default function EventForm({ onSubmit, initialData = {}, mode = 'create' }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  const schema = mode === 'create' ? createEventSchema : editEventSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...initialData,
      category_id: initialData.category?.id?.toString() || '',
      ticket_types:
        mode === 'create'
          ? [{ name: '', description: '', price: '' }]
          : undefined,
    },
  });

  const { fields: ticketTypes, append, remove } = useFieldArray({
    control,
    name: 'ticket_types',
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  const image = watch('image');

  const submitHandler = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image') {
        if (value && value[0]) {
          formData.append(key, value[0]);
        }
      } else if (key === 'ticket_types') {
        if (mode === 'create') {
          formData.append('ticket_types', JSON.stringify(value));
        }
      } else {
        formData.append(key, value);
      }
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <input
          {...register('title')}
          placeholder="Título"
          className="w-full p-2 border rounded"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <textarea
          {...register('description')}
          placeholder="Descripción"
          className="w-full p-2 border rounded"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <select
          {...register('category_id')}
          className="w-full p-2 border rounded"
        >
          <option value="" disabled>Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-md text-gray-600">¿No ves la categoría?</span>
        <button
          type="button"
          onClick={() => router.push('/create/categories')}
          className="text-blue-600 hover:underline text-md font-medium"
        >
          Añade una nueva
        </button>
      </div>

      <div>
        <input
          type="number"
          {...register('capacity')}
          placeholder="Capacidad"
          className="w-full p-2 border rounded"
        />
        {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity.message}</p>}
      </div>

      <div>
        <input
          type="datetime-local"
          {...register('start_date_time')}
          className="w-full p-2 border rounded"
        />
        {errors.start_date_time && <p className="text-red-500 text-sm">{errors.start_date_time.message}</p>}
      </div>

      <div>
        <input
          type="datetime-local"
          {...register('end_date_time')}
          className="w-full p-2 border rounded"
        />
        {errors.end_date_time && <p className="text-red-500 text-sm">{errors.end_date_time.message}</p>}
      </div>

      <div>
        <input
          {...register('location')}
          placeholder="Ubicación"
          className="w-full p-2 border rounded"
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
      </div>

      <div>
        <input
          type="file"
          {...register('image')}
          accept="image/*"
          className="w-full p-2 border rounded"
        />
      </div>

      {mode === 'create' && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Tipos de Entrada</h3>
          {ticketTypes.map((field, index) => (
            <div key={field.id} className="border p-4 rounded mb-2">
              <div>
                <input
                  {...register(`ticket_types.${index}.name`)}
                  placeholder="Nombre del ticket"
                  className="w-full p-2 border rounded"
                />
                {errors.ticket_types?.[index]?.name && (
                  <p className="text-red-500 text-sm">{errors.ticket_types[index].name.message}</p>
                )}
              </div>

              <div>
                <textarea
                  {...register(`ticket_types.${index}.description`)}
                  placeholder="Descripción del ticket"
                  className="w-full p-2 border rounded mb-2 mt-3"
                />
              </div>

              <div>
                <input
                  type="number"
                  step="0.01"
                  {...register(`ticket_types.${index}.price`)}
                  placeholder="Precio"
                  className="w-full p-2 border rounded"
                />
                {errors.ticket_types?.[index]?.price && (
                  <p className="text-red-500 text-sm">{errors.ticket_types[index].price.message}</p>
                )}
              </div>

              {ticketTypes.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-700"
                >
                  Eliminar ticket
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ name: '', description: '', price: '' })}
            className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          >
            + Añadir ticket
          </button>
          {errors.ticket_types?.message && (
            <p className="text-red-500 text-sm mt-2">{errors.ticket_types.message}</p>
          )}
        </div>
      )}

      <button type="submit" className="w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded">
        {mode === 'create' ? 'Crear Evento' : 'Guardar Cambios'}
      </button>
      <button
        type="button"
        onClick={() => router.back()}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver
      </button>
    </form>
  );
}
