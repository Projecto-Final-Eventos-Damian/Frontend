'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ratingSchema } from '@/schemas/ratingSchema';
import { useState } from 'react';

export default function RatingForm({ onSubmit }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ratingSchema),
    defaultValues: {
      rating: 0,
      review: '',
    },
  });

  const submitHandler = (data) => {
    if (!selected) return alert('Selecciona una puntuación');
    onSubmit(data);
  };

  const handleStarClick = (value) => {
    setSelected(value);
    setValue('rating', value);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-3xl cursor-pointer ${
              (hovered || selected) >= star ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleStarClick(star)}
          >
            ★
          </span>
        ))}
      </div>
      {errors.rating && (
        <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
      )}

      <div>
        <textarea
          {...register('review')}
          placeholder="Deja un comentario (opcional)"
          className="w-full p-2 border rounded"
          rows={4}
        />
        {errors.review && (
          <p className="text-red-500 text-sm mt-1">{errors.review.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Enviar valoración
      </button>
    </form>
  );
}