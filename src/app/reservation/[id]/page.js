'use client';

import { useAuth } from '@/hook/authContext';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getReservation, getTicketsByReservation, downloadReservationPDF, deleteReservation } from '@/services';
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

  const handleDeleteReservation = async () => {
    const confirmDelete = window.confirm('¿Seguro que quieres cancelar esta reserva?');

    if (!confirmDelete) return;

    try {
      await deleteReservation(id);
      toast.success('Reserva cancelada correctamente.');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cancelar la reserva.');
    }
  };

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
      <h1 className="text-3xl font-bold mb-6">Detalle de la Reserva</h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Evento</h2>
      <div className="mb-6">
        <EventCard event={reservation.event} />
      </div>

      {user?.role === 'organizer' && reservation.user && (
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Reserva realizada por:</span> {reservation.user.name}
        </p>
      )}

      <p className="text-gray-700 mb-6">
        <span className="font-semibold">Fecha de reserva:</span> {new Date(reservation.reserved_at).toLocaleString()}
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Entradas</h2>

      {tickets.length > 0 ? (
        <ul className="divide-y divide-indigo-300 rounded-lg border border-indigo-300 overflow-hidden">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="p-4 bg-gray-50 transition">
              <p className="text-sm text-gray-900">
                <span className="font-bold">Código:</span> {ticket.ticket_code}
              </p>
              <p className="text-sm text-gray-900">
                <span className="font-bold">Tipo:</span> {ticket.ticket_type?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-900">
                <span className="font-bold">Precio:</span> {parseFloat(ticket.ticket_type?.price).toFixed(2)} €
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No hay tickets asociados a esta reserva.</p>
      )}

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
        {user?.role === 'user' && (
          <>
            <button
              onClick={handleViewPDF}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Descargar entradas en PDF
            </button>

            <button
              onClick={handleDeleteReservation}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Cancelar reserva
            </button>
          </>
        )}

        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
