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
  const [isOrganizer, setIsOrganizer] = useState(null);

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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {isOrganizer ? (
        <>
          <div className="bg-white shadow-md rounded-2xl">
            <EventForm onSubmit={handleCreateEvent} mode="create" />
          </div>
        </>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-2xl shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <h2 className="text-xl font-semibold">Solo organizadores pueden crear eventos</h2>
          </div>
          <p className="text-gray-700">
            Para crear un evento, debes estar registrado como organizador.
          </p>
          <Link
            href="/login?register=1"
            className="text-blue-600 hover:underline font-medium"
          >
            Regístrate aquí como organizador
          </Link>
        </div>
      )}

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