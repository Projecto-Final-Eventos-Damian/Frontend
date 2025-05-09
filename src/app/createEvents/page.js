'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/forms/eventForm';
import { createEvent } from '@/services/petitions';

export default function CreateEventsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login?redirect=/createEvents');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleCreateEvent = async (eventData) => {
    setError('');
    setSuccessMessage('');
    try {
      await createEvent(eventData);
      setSuccessMessage('Evento creado con éxito');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!authorized) return null;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bienvenido a la creación de eventos</h1>
      <EventForm onSubmit={handleCreateEvent} error={error} />
      {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
    </div>
  );
}
