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
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-4xl cursor-pointer transition-transform ${
              (hovered || selected) >= star ? 'text-yellow-400 scale-110' : 'text-gray-300'
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
        <p className="text-red-500 text-sm text-center">{errors.rating.message}</p>
      )}

      <div>
        <textarea
          {...register('review')}
          placeholder="Deja un comentario (opcional)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={4}
        />
        {errors.review && (
          <p className="text-red-500 text-sm mt-1">{errors.review.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-2xl transition-colors"
      >
        Enviar valoración
      </button>
    </form>
  );
}