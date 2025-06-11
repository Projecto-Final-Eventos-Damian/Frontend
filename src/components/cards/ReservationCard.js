'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hook/authContext';

export default function ReservationUserCard({ reservation, tickets }) {
  const router = useRouter();
  const { user } = useAuth();

  const groupedTickets = tickets.reduce((acc, ticket) => {
    const key = ticket.ticket_type.name;
    if (!acc[key]) {
      acc[key] = {
        count: 0,
        price: ticket.ticket_type.price,
      };
    }
    acc[key].count += 1;
    return acc;
  }, {});

  const handleClick = () => {
    router.push(`/reservation/${reservation.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer border border-gray-300 rounded-2xl shadow p-5 hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 bg-white"
    >
      <h3 className="text-xl font-bold text-indigo-700 mb-2">
        {reservation.event?.title || 'Evento sin título'}
      </h3>

      {user?.role === 'organizer' && reservation.user && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Reservado por:</span> {reservation.user.name}
        </p>
      )}

      <p className="text-sm text-gray-600 mb-4">
        <span className="font-medium">Fecha de reserva:</span> {new Date(reservation.reserved_at).toLocaleDateString()}
      </p>

      <div className="bg-gray-50 p-3 rounded-lg border border-indigo-400">
        <h4 className="text-sm font-semibold mb-2 text-gray-700">Resumen de entradas:</h4>
        <ul className="pl-5 text-sm text-gray-700 list-disc space-y-1">
          {Object.entries(groupedTickets).map(([type, info]) => (
            <li key={type}>
              {info.count} x {type} — {parseFloat(info.price).toFixed(2)}€ cada una
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
