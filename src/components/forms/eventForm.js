'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '@/services/petitions';

export default function EventForm({ onSubmit, error }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    capacity: '',
    start_date_time: '',
    end_date_time: '',
    location: '',
    image_url: '',
  });

  const [categories, setCategories] = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      category_id: Number(formData.category_id),
      capacity: Number(formData.capacity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="title" placeholder="Título" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
      <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required />
      
      <select
        name="category_id"
        value={formData.category_id}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="" disabled>Selecciona una categoría</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <input name="capacity" type="number" placeholder="Capacidad" value={formData.capacity} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="start_date_time" type="datetime-local" value={formData.start_date_time} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="end_date_time" type="datetime-local" value={formData.end_date_time} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="location" placeholder="Ubicación" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="image_url" placeholder="Ruta de imagen" value={formData.image_url} onChange={handleChange} className="w-full p-2 border rounded" required />
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">Crear Evento</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
