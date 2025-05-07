import { API_BASE_URL } from '@/utils/entorn';
import Link from "next/link";

export default function EventCard({ event }) {
  return (
    <div className="bg-white shadow rounded p-4 border border-gray-200">
      <Link href={`/event/${event.id}`}>
        <h3 className="text-xl font-bold text-indigo-600">{event.title}</h3>
      </Link>
      <p className="text-gray-700 mb-2">{event.description}</p>
      
      <div className="text-sm text-gray-600 mb-1">
        <strong>Ubicación:</strong> {event.location}
      </div>
      
      <div className="text-sm text-gray-600 mb-1">
        <strong>Inicio:</strong> {new Date(event.start_date_time).toLocaleString()}
      </div>
      
      <div className="text-sm text-gray-600 mb-1">
        <strong>Fin:</strong> {new Date(event.end_date_time).toLocaleString()}
      </div>
      
      <div className="text-sm text-gray-600 mb-1">
        <strong>Capacidad:</strong> {event.capacity}
      </div>
      
      <Link href={`/event/${event.id}`}>
        {event.image_url && (
          <img
            src={`${API_BASE_URL}${event.image_url}`}
            alt={event.title}
            className="w-full h-48 object-cover rounded mt-3"
          />
        )}
      </Link>
    </div>
  );
}
  