'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getOrganizerEvents, getReservationTickets, deleteEvent } from '@/services';
import { toast } from 'react-hot-toast';
import EventOrgCard from '@/components/cards/eventOrgCard';
import ReservationCard from '@/components/cards/ReservationCard';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteEvent = async (id, title) => {
    const confirmDelete = window.confirm(`¿Seguro que quieres eliminar el evento con id ${id} "${title}"?`);
    if (!confirmDelete) return;

    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success('Evento eliminado correctamente.');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo eliminar el evento.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login?redirect=/dashboard');
        return;
      }
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        if (userData.role === 'organizer') {
          const organizerEvents = await getOrganizerEvents(userData.id);
          setEvents(organizerEvents);
        } else if (userData.role === 'user') {
          const userReservations = await getReservationTickets(userData.id);
          setReservations(userReservations);
        }
      } catch (err) {
        console.error(err);
        setEvents([]);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  if (loading) return <p className="p-4">Cargando datos...</p>;

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenido, {user?.name || user?.email || 'Usuario'}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {user.role === 'organizer' && (
          <>
            <Link
              href="/create/categories"
              className="ml-2 py-0 px-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer flex justify-center"
            >
              Crear categoría
            </Link>
            <button className="ml-2 py-0 px-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer">
              Ver estadísticas
            </button>
          </>
        )}
        {user.role === 'user' && (
          <>
            <button className="ml-2 py-0 px-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer">
              Ver eventos
            </button>
            <button className="ml-2 py-0 px-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer">
              Mis inscripciones
            </button>
          </>
        )}
      </div><br />

      {user.role === 'organizer' ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Tus eventos como organizador</h2>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {events.map((event) => (
                <EventOrgCard key={event.id} event={event} onDelete={handleDeleteEvent} />
              ))}
            </div>
          ) : (
            <p>No has creado eventos todavía.</p>
          )}
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Tus reservas</h2>
          {reservations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {reservations.map(({ reservation, tickets }) => (
                <ReservationCard key={reservation.id} reservation={reservation} tickets={tickets} />
              ))}
            </div>
          ) : (
            <p>No tienes reservas todavía.</p>
          )}
        </>
      )}
    </div>
  );
}