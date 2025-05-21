'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEventById, getEventTicketTypes } from '@/services';
import TiquetTypeCard from '@/components/cards/tiquetTypeCard';

export default function TicketTypesPage() {
  const params = useParams();
  const eventId = params.id;
  const router = useRouter();

  const [ticketTypes, setTicketTypes] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login?redirect=/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const event = await getEventById(eventId);
        setEventTitle(event.title);
        const tickets = await getEventTicketTypes(eventId);
        setTicketTypes(tickets);
      } catch (err) {
        console.error('Error al obtener datos del evento:', err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId, router]);

  if (loading) return <p className="p-4">Cargando tickets...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Tipos de Ticket del Evento: {eventTitle}
      </h1>

      {ticketTypes.length === 0 ? (
        <p>No hay tipos de tickets asociados a este evento.</p>
      ) : (
        <div className="space-y-4">
          {ticketTypes.map((ticket) => (
            <TiquetTypeCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}

      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver
      </button>
    </div>
  );
}
