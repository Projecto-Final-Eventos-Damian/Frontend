'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEventById, getEventRatings } from '@/services';
import RatingCard from '@/components/cards/ratingCard';

export default function EventRatingsPage() {
  const params = useParams();
  const eventId = params.id;
  const router = useRouter();

  const [eventTitle, setEventTitle] = useState('');
  const [ratings, setRatings] = useState([]);
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

        const eventRatings = await getEventRatings(eventId);
        setRatings(eventRatings);
      } catch (err) {
        console.error('Error al obtener ratings del evento:', err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId, router]);

  if (loading) return <p className="p-4">Cargando ratings...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Valoraciones del Evento: {eventTitle}
      </h1>

      {ratings.length === 0 ? (
        <p>No hay valoraciones asociadas a este evento.</p>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <RatingCard key={rating.id} rating={rating} />
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