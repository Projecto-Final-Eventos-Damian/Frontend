'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/forms/eventForm';
import { createEvent, createTicketType, getCurrentUser } from '@/services';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CreateEventsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(null); // null: cargando, true/false: definido

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login?redirect=/create/events');
    } else {
      getCurrentUser()
        .then((user) => {
          setIsOrganizer(user?.role === 'organizer');
          setAuthorized(true);
        })
        .catch(() => {
          setAuthorized(false);
          setIsOrganizer(false);
          router.replace('/');
        });
    }
  }, [router]);

  const handleCreateEvent = async (formData) => {
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

      router.push('/dashboard');
      toast.success('Evento y tickets creados con éxito');
    } catch (err) {
      toast.error(err.message || 'Error al crear el evento o los tickets');
    }
  };

  if (!authorized || isOrganizer === null) return null;

  return (
    <div className="p-6 max-w-md mx-auto">
      {isOrganizer ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Crear evento</h1>
          <EventForm onSubmit={handleCreateEvent} mode="create" />
        </>
      ) : (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚠️</span>
            <h2 className="font-semibold text-lg">Solo los organizadores pueden crear eventos</h2>
          </div>
          <p className="mb-2">
            Para poder crear un evento, necesitas estar registrado como organizador.
          </p>
          <Link
            href="/login?register=1"
            className="underline text-blue-600 hover:text-blue-800"
          >
            Regístrate aquí como organizador
          </Link>
        </div>
      )}
      <br></br>
      <button
        type="button"
        onClick={() => router.back()}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver
      </button>
    </div>
  );
}
