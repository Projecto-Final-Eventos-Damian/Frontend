'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getTicketTypeById, updateTicketType } from '@/services';
import TicketTypeForm from '@/components/forms/tiquetTypeForm';
import { toast } from 'react-hot-toast';

export default function EditTicketTypePage() {
  const router = useRouter();
  const { id } = useParams();
  const [ticketData, setTicketData] = useState(null);

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
        toast.error('No se pudo cargar el ticket');
      }
    };

    fetchTicket();
  }, [id]);

  const handleUpdate = async (updatedData) => {
    try {
      await updateTicketType(id, updatedData);
      router.back();
      toast.success('Ticket actualizado con éxito');
    } catch (err) {
      toast.error(err.message || 'Error al actualizar el ticket');
    }
  };

  if (!ticketData) {
    return <p className="text-center mt-4">Cargando datos del ticket...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">Editar Ticket</h1>
      <div className="bg-white shadow-md rounded-2xl p-6">
        <TicketTypeForm
          onSubmit={handleUpdate}
          initialData={ticketData}
        />
      </div>
    </div>
  );
}
