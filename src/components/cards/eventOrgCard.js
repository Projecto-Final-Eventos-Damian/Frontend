import { API_BASE_URL } from '@/utils/entorn';
import Link from 'next/link';

export default function EventOrgCard({ event, onDelete }) {
  const imageUrl = event.image_url
    ? `${API_BASE_URL}${event.image_url}`
    : `${API_BASE_URL}/public/images/events/default_event.png`;

  return (
    <div className="bg-white shadow-md rounded-2xl border border-gray-200 p-6 flex flex-col gap-6 hover:shadow-lg transition">

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <Link href={`/event/${event.id}`} className="w-full lg:w-1/3">
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-52 object-cover rounded-xl"
          />
        </Link>

        <div className="flex flex-col justify-between flex-1 w-full gap-4">
          <h3 className="text-3xl font-bold text-indigo-700">{event.title}</h3>
          <div className="space-y-1 text-gray-600 text-base">
            <div><span className="font-bold">Categoría:</span> {event.category.name}</div>
            <div><span className="font-bold">Ubicación:</span> {event.location}</div>
            <div><span className="font-bold">Inicio:</span> {new Date(event.start_date_time).toLocaleString()}</div>
            <div><span className="font-bold">Fin:</span> {new Date(event.end_date_time).toLocaleString()}</div>
            <div><span className="font-bold">Capacidad:</span> {event.capacity}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link
          href={`/event/${event.id}`}
          title="Ver"
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 w-full flex justify-center items-center gap-2 transition"
        >
          <i className="bi bi-eye text-lg"></i> Ver
        </Link>
        <Link
          href={`/edit/event/${event.id}`}
          title="Editar"
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2 w-full flex justify-center items-center gap-2 transition"
        >
          <i className="bi bi-pencil text-lg"></i> Editar
        </Link>
        <button
          onClick={() => onDelete(event.id, event.title)}
          title="Eliminar"
          className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 w-full flex justify-center items-center gap-2 transition cursor-pointer"
        >
          <i className="bi bi-trash text-lg"></i> Eliminar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href={`/ticketTypes/${event.id}`}
          title="Ver Tipos de Tickets"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 w-full flex justify-center items-center gap-2 transition"
        >
          <i className="bi bi-ticket-perforated-fill text-lg"></i> Tickets
        </Link>
        <Link
          href={`/reservationEvents/${event.id}`}
          title="Ver Reservas"
          className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 w-full flex justify-center items-center gap-2 transition"
        >
          <i className="bi bi-calendar-check-fill text-lg"></i> Reservas
        </Link>
        <Link
          href={`/eventRatings/${event.id}`}
          title="Ver Ratings"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 w-full flex justify-center items-center gap-2 transition"
        >
          <i className="bi bi-star-fill text-lg"></i> Ratings
        </Link>
      </div>
    </div>
  );
}
