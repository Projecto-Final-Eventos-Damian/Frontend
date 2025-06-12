import { API_BASE_URL } from '@/utils/entorn';
import Link from "next/link";

export default function EventCard({ event }) {
  const imageUrl = event.image_url
    ? `${API_BASE_URL}${event.image_url}`
    : `${API_BASE_URL}/public/images/events/default_event.png`;

  const isFinished = new Date(event.end_date_time) < new Date();

  return (
    <Link href={`/event/${event.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer">
        
        <div className={`relative overflow-hidden ${isFinished ? 'overlay-finalizado' : ''}`}>
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
            {event.title}
          </h3>

          <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full w-fit">
            {event.category.name}
          </span>

          <div className="text-gray-500 text-sm mt-2 space-y-1">
            <div><strong>📍 Ubicación:</strong> {event.location}</div>
            <div><strong>🗓️ Inicio:</strong> {new Date(event.start_date_time).toLocaleString()}</div>
            <div><strong>⏳ Fin:</strong> {new Date(event.end_date_time).toLocaleString()}</div>
            <div><strong>👥 Capacidad:</strong> {event.capacity}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}