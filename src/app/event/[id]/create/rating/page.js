'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RatingForm from '@/components/forms/ratingForm';
import { createRating } from '@/services';
import { toast } from 'react-hot-toast';

export default function CreateRatingPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace(`/login?redirect=/event/${eventId}/create/rating`);
    } else {
      setAuthorized(true);
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

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Valora el evento</h1>
      <RatingForm onSubmit={handleCreateRating} />
    </div>
  );
}