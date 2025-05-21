'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TicketTypeForm({
  onSubmit,
  initialData = { name: '', description: '', price: '' },
}) {
  const router = useRouter();
  const [ticketData, setTicketData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(ticketData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={ticketData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Nombre del ticket"
        required
      />
      <textarea
        name="description"
        value={ticketData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Descripción"
      />
      <input
        type="number"
        name="price"
        step="0.01"
        value={ticketData.price}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Precio"
        required
      />
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
