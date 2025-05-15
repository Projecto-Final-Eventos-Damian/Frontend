'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EventForm from '@/components/forms/eventForm';
import { getEventById, updateEvent } from '@/services';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [eventData, setEventData] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login?redirect=/editEvent');
    } else {
      setAuthorized(true);
      if (eventId) fetchEvent();
    }
  }, [router, eventId]);

  const fetchEvent = async () => {
    try {
      const data = await getEventById(eventId);
      setEventData({
        ...data,
        start_date_time: data.start_date_time.slice(0, 16),
        end_date_time: data.end_date_time.slice(0, 16),
      });
    } catch (err) {
      setError('Error al cargar evento');
    }
  };

  const handleUpdateEvent = async (formData) => {
    try {
      await updateEvent(eventId, formData);
      setSuccessMessage('Evento actualizado correctamente');
      setError('');
    } catch (err) {
      console.error('Error al actualizar:', err);
      setError(err?.message || 'Error desconocido');
    }
  };

  if (!authorized || !eventData) return null;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Evento</h1>
      <EventForm
        initialData={eventData}
        onSubmit={handleUpdateEvent}
        error={error}
        mode="edit"
      />
      {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
    </div>
  );
}
