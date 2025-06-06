'use client';

import { API_BASE_URL } from '@/utils/entorn';
import { useAuth } from '@/hook/authContext';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getReservation, getTicketsByReservation, downloadReservationPDF } from '@/services';
import { toast } from 'react-hot-toast';
import EventCard from '@/components/cards/eventCard';

export default function ReservationDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [reservation, setReservation] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleViewPDF = () => downloadReservationPDF(id);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const reservationData = await getReservation(id);
        setReservation(reservationData);
        const ticketData = await getTicketsByReservation(id);
        setTickets(ticketData);
      } catch (error) {
        console.error(error);
        alert('Error al cargar los datos de la reserva');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id, router]);

  if (loading || authLoading) return <p className="p-4">Cargando reserva...</p>;
  if (!reservation) return <p>No se encontró la reserva.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Detalle de la Reserva del evento:</h1>
      <div className="mb-4">
        <EventCard event={reservation.event} />
      </div>
      <p className="text-gray-600 mb-4">
        Fecha de reserva: <strong>{new Date(reservation.reserved_at).toLocaleString()}</strong>
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Tickets</h2>
      {tickets.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="py-2">
              <p><strong>Código:</strong> {ticket.ticket_code}</p>
              <p><strong>Tipo:</strong> {ticket.ticket_type?.name || 'N/A'}</p>
              <p><strong>Precio:</strong> {ticket.ticket_type?.price} €</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay tickets asociados.</p>
      )}

      <div className="flex gap-4 mt-6">
        {user?.role === 'user' && (
          <button
            onClick={handleViewPDF}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Descargar entradas en pdf
          </button>
        )}

        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
