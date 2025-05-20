'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCategories } from '@/services';

export default function EventForm({ onSubmit, initialData = {}, mode = 'create' }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    capacity: '',
    start_date_time: '',
    end_date_time: '',
    location: '',
    image: null,
    ...initialData,
    category_id: initialData.category?.id?.toString() || '',
  });

  const [ticketTypes, setTicketTypes] = useState([
    { name: '', description: '', price: '' },
  ]);

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
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image' && !value) return;
      data.append(key, value);
    });

    if (mode === 'create') {
      data.append('ticket_types', JSON.stringify(ticketTypes));
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" placeholder="Título" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
      <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required />

      <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-2 border rounded" required>
        <option value="" disabled>Selecciona una categoría</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <input name="capacity" type="number" placeholder="Capacidad" value={formData.capacity} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="start_date_time" type="datetime-local" value={formData.start_date_time} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="end_date_time" type="datetime-local" value={formData.end_date_time} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="location" placeholder="Ubicación" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="image" type="file" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded" />

      {mode === 'create' && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Tipos de Entrada</h3>
          {ticketTypes.map((ticket, index) => (
            <div key={index} className="border p-4 rounded mb-2 relative">
              <input
                type="text"
                placeholder="Nombre del ticket"
                value={ticket.name}
                onChange={(e) => {
                  const updated = [...ticketTypes];
                  updated[index].name = e.target.value;
                  setTicketTypes(updated);
                }}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <textarea
                placeholder="Descripción del ticket"
                value={ticket.description}
                onChange={(e) => {
                  const updated = [...ticketTypes];
                  updated[index].description = e.target.value;
                  setTicketTypes(updated);
                }}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Precio"
                value={ticket.price}
                onChange={(e) => {
                  const updated = [...ticketTypes];
                  updated[index].price = e.target.value;
                  setTicketTypes(updated);
                }}
                className="w-full p-2 border rounded"
                required
              />
              {ticketTypes.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...ticketTypes];
                    updated.splice(index, 1);
                    setTicketTypes(updated);
                  }}
                  className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-800 transition"
                >
                  Eliminar ticket
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setTicketTypes(prev => [...prev, { name: '', description: '', price: '' }])}
            className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
          >
            + Añadir ticket
          </button>
        </div>
      )}

      <button type="submit" className="w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded">
        {mode === 'create' ? 'Crear Evento' : 'Guardar Cambios'}
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