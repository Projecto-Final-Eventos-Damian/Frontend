'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/forms/eventForm';
import { createEvent, createTicketType } from '@/services';

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

  const handleCreateEvent = async (formData) => {
    setError('');
    setSuccessMessage('');
  
    try {
      const ticketTypesJSON = formData.get('ticket_types');
      const ticketTypes = JSON.parse(ticketTypesJSON);
      formData.delete('ticket_types');
      const event = await createEvent(formData);
      const eventId = event.id;
      await Promise.all(
        ticketTypes.map((ticket) =>
          createTicketType({ ...ticket, event_id: eventId })
        )
      );
      setSuccessMessage('Evento y tickets creados con éxito');
    } catch (err) {
      setError(err.message || 'Error al crear el evento o los tickets');
    }
  };

  if (!authorized) return null;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bienvenido a la creación de eventos</h1>
      <EventForm onSubmit={handleCreateEvent} error={error} mode="create" />
      {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
    </div>
  );
}
