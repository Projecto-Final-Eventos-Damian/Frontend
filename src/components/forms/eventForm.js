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
      ticket_types: mode === 'create' ? [{ name: '', description: '', price: '' }] : undefined,
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

  useEffect(() => {
    if (categories.length > 0 && initialData.category?.id) {
      setValue('category_id', initialData.category.id.toString());
    }
  }, [categories, initialData.category?.id, setValue]);

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
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6 bg-white p-6 rounded-2xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{mode === 'create' ? 'Crear Evento' : 'Editar Evento'}</h2>

      <div>
        <input
          {...register('title')}
          placeholder="Título"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <textarea
          {...register('description')}
          placeholder="Descripción"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <select
          {...register('category_id')}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="" disabled>Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-600 text-sm">¿No ves la categoría?</span>
        <button
          type="button"
          onClick={() => router.push('/create/categories')}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Añade una nueva
        </button>
      </div>

      <div>
        <input
          type="number"
          {...register('capacity')}
          placeholder="Capacidad"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Fecha de inicio</label>
          <input
            type="datetime-local"
            {...register('start_date_time')}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.start_date_time && <p className="text-red-500 text-sm mt-1">{errors.start_date_time.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Fecha de fin</label>
          <input
            type="datetime-local"
            {...register('end_date_time')}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.end_date_time && <p className="text-red-500 text-sm mt-1">{errors.end_date_time.message}</p>}
        </div>
      </div>

      <div>
        <input
          {...register('location')}
          placeholder="Ubicación"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Imagen</label>
        <input
          type="file"
          {...register('image')}
          accept="image/*"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {mode === 'create' && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Tipos de Entrada</h3>

          {ticketTypes.map((field, index) => (
            <div key={field.id} className="border border-gray-300 p-4 rounded-2xl mb-4 bg-gray-50">
              <div className="mb-2">
                <input
                  {...register(`ticket_types.${index}.name`)}
                  placeholder="Nombre del ticket"
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.ticket_types?.[index]?.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.ticket_types[index].name.message}</p>
                )}
              </div>

              <div className="mb-2">
                <textarea
                  {...register(`ticket_types.${index}.description`)}
                  placeholder="Descripción del ticket"
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="mb-2">
                <input
                  type="number"
                  step="0.01"
                  {...register(`ticket_types.${index}.price`)}
                  placeholder="Precio"
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.ticket_types?.[index]?.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.ticket_types[index].price.message}</p>
                )}
              </div>

              {ticketTypes.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Eliminar ticket
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ name: '', description: '', price: '' })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Añadir ticket
          </button>

          {errors.ticket_types?.message && (
            <p className="text-red-500 text-sm mt-2">{errors.ticket_types.message}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition"
      >
        {mode === 'create' ? 'Crear Evento' : 'Guardar Cambios'}
      </button>
    </form>
  );
}