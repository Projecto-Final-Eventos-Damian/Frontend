'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EventForm from '@/components/forms/eventForm';
import { getEventById, updateEvent } from '@/services';
import { toast } from 'react-hot-toast';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [eventData, setEventData] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login?redirect=/edit/event');
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
      toast.error('Error al cargar evento');
    }
  };

  const handleUpdateEvent = async (formData) => {
    try {
      await updateEvent(eventId, formData);
      router.push('/dashboard');
      toast.success('Evento actualizado correctamente');
    } catch (err) {
      console.error('Error al actualizar:', err);
      toast.error(err?.message || 'Error desconocido');
    }
  };

  if (!authorized || !eventData) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow-md rounded-2xl">
        <EventForm
          initialData={eventData}s
          onSubmit={handleUpdateEvent}
          mode="edit"
        />
      </div>
      <button
        type="button"
        onClick={() => router.back()}
        className="w-full py-3 bg-blue-500 text-white text-lg font-semibold rounded-2xl hover:bg-blue-600 transition-colors"
      >
        Volver
      </button>
    </div>
  );
}