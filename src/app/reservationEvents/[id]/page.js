'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEventById, getReservationsTicketsByEventId } from '@/services';
import ReservationCard from '@/components/cards/ReservationCard';

export default function EventReservationsPage() {
  const params = useParams();
  const eventId = params.id;
  const router = useRouter();

  const [eventTitle, setEventTitle] = useState('');
  const [reservations, setReservations] = useState([]);
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

        const eventReservations = await getReservationsTicketsByEventId(eventId);
        setReservations(eventReservations);
      } catch (err) {
        console.error('Error al obtener reservas del evento:', err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId, router]);

  if (loading) return <p className="p-4">Cargando reservas...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Reservas del Evento: {eventTitle}
      </h1>

      {reservations.length === 0 ? (
        <p>No hay reservas asociadas a este evento.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map(({ reservation, tickets }) => (
            <ReservationCard key={reservation.id} reservation={reservation} tickets={tickets} />
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