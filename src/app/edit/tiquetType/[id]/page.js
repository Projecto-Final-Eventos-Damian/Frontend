'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTicketTypeById, updateTicketType } from '@/services';
import TicketTypeForm from '@/components/forms/tiquetTypeForm';

export default function EditTicketTypePage() {
  const { id } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicketTypeById(id);
        setTicketData({
          name: data.name,
          description: data.description,
          price: data.price,
        });
      } catch (err) {
        setError('No se pudo cargar el ticket');
      }
    };

    fetchTicket();
  }, [id]);

  const handleUpdate = async (updatedData) => {
    setError('');
    setSuccess('');
    try {
      await updateTicketType(id, updatedData);
      setSuccess('Ticket actualizado con éxito');
    } catch (err) {
      setError('Error al actualizar el ticket');
    }
  };

  if (!ticketData) {
    return <p className="text-center mt-4">Cargando datos del ticket...</p>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Ticket</h1>
      <TicketTypeForm
        onSubmit={handleUpdate}
        initialData={ticketData}
        error={error}
        success={success}
      />
    </div>
  );
}
