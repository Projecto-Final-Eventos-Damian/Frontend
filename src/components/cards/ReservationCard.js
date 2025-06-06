'use client';

import { useRouter } from 'next/navigation';

export default function ReservationUserCard({ reservation, tickets }) {
  const router = useRouter();

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
      className="cursor-pointer border border-gray-200 rounded-xl shadow-md p-4 hover:shadow-lg transition duration-300 bg-white"
    >
      <h3 className="text-lg font-semibold text-blue-600 mb-1">
        Evento: {reservation.event?.title || 'Título no disponible'}
      </h3>
      <p className="text-sm text-gray-500 mb-2">
        Fecha de reserva: {new Date(reservation.reserved_at).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-500 mb-2 capitalize">
        Estado: <span className="font-medium">{reservation.status}</span>
      </p>
      <div className="mt-2">
        <h4 className="text-sm font-semibold mb-1">Resumen de entradas:</h4>
        <ul className="pl-4 text-sm text-gray-700 list-disc">
          {Object.entries(groupedTickets).map(([type, info]) => (
            <li key={type}>
              {info.count} x {type} por {parseFloat(info.price).toFixed(2)}€ cada una
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
