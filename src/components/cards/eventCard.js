import { API_BASE_URL } from '@/utils/entorn';
import Link from "next/link";

export default function EventCard({ event }) {
  return (
    <Link href={`/event/${event.id}`}>
      <div className="bg-white shadow rounded p-4 border border-gray-200">
        <h3 className="text-xl font-bold text-indigo-600">{event.title}</h3>
      
        {event.image_url && (
          <img
            src={`${API_BASE_URL}${event.image_url}`}
            alt={event.title}
            className="w-full h-48 object-cover rounded mt-3"
          />
        )}

        <p className="text-gray-700 mb-2">{event.description}</p>
        
        <div className="text-sm text-gray-600 mb-1">
          <strong>Categoría:</strong> {event.category.name}
        </div>

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
      </div>
    </Link>
  );
}
  