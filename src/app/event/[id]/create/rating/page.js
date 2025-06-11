'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RatingForm from '@/components/forms/ratingForm';
import { createRating, getEventById } from '@/services';
import { toast } from 'react-hot-toast';

export default function CreateRatingPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [authorized, setAuthorized] = useState(false);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace(`/login?redirect=/event/${eventId}/create/rating`);
    } else {
      setAuthorized(true);
      getEventById(eventId)
        .then(setEvent)
        .catch(() => toast.error('No se pudo cargar el evento'));
    }
  }, [eventId, router]);

  const handleCreateRating = async (data) => {
    try {
      await createRating({ ...data, event_id: eventId });
      toast.success('¡Valoración enviada!');
      router.push('/');
    } catch (err) {
      toast.error(err.message || 'Error al enviar la valoración');
    }
  };

  if (!authorized) return null;

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Cargando evento...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Valora el evento: <span className="text-indigo-600">{event.title}</span>
      </h1>

      <RatingForm onSubmit={handleCreateRating} />
    </div>
  );
}
