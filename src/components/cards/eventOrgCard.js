import { API_BASE_URL } from '@/utils/entorn';
import Link from 'next/link';

export default function EventOrgCard({ event, onDelete }) {
  return (
    <div className="bg-white shadow rounded border border-gray-200 p-4 flex flex-col gap-4">

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <Link href={`/event/${event.id}`} className="w-full lg:w-1/3">
          {event.image_url && (
            <img
              src={`${API_BASE_URL}${event.image_url}`}
              alt={event.title}
              className="w-full h-48 object-cover rounded"
            />
          )}
        </Link>

        <div className="flex flex-col justify-between flex-1 w-full">
          <h3 className="text-xl font-bold text-indigo-600">{event.title}</h3>
          <p className="text-gray-700 my-2">{event.description}</p>
          <div>
            <div><strong>Categoría:</strong> {event.category.name}</div>
            <div><strong>Ubicación:</strong> {event.location}</div>
            <div><strong>Inicio:</strong> {new Date(event.start_date_time).toLocaleString()}</div>
            <div><strong>Fin:</strong> {new Date(event.end_date_time).toLocaleString()}</div>
            <div><strong>Capacidad:</strong> {event.capacity}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
        <Link
          href={`/event/${event.id}`}
          title="Ver"
          className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-2 w-full flex justify-center items-center"
          >
        <i className="bi bi-eye text-lg"></i>
        </Link>
        <Link
          href={`/edit/event/${event.id}`}
          title="Editar"
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded px-3 py-2 w-full flex justify-center items-center"
          >
        <i className="bi bi-pencil text-lg"></i>
        </Link>
        <button
          onClick={() => onDelete(event.id, event.title)}
          title="Eliminar"
          className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-2 w-full flex justify-center items-center cursor-pointer"
        >
          <i className="bi bi-trash text-lg"></i>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Link
          href={`/ticketTypes/${event.id}`}
          title="Ver TiquetTypes"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-2 w-full flex justify-center items-center"
          >
        Ver tipos de tiquets
        </Link>
        <Link
          href={`/reservationEvents/${event.id}`}
          title="Ver Reservas"
          className="bg-gray-500 hover:bg-gray-600 text-white rounded px-3 py-2 w-full flex justify-center items-center"
          >
        Reservas
        </Link>
      </div>
    </div>
  );
}