'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CategoryForm({ onSubmit, error }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Nombre de la categoría"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Descripción"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

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
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}