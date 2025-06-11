'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getOrganizerEvents, getReservationTickets, deleteEvent, getReservationsByEventId, notifyEventCancellation } from '@/services';
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
    try {
      const reservations = await getReservationsByEventId(id);
      let confirmDelete = false;
      if (reservations.length > 0) {
        confirmDelete = window.confirm(`Este evento ya tiene reservas. ¿Seguro que quieres eliminarlo junto con todas sus reservas?`);
        if (!confirmDelete) return;
        await notifyEventCancellation(id);
      } else {
        confirmDelete = window.confirm(`¿Seguro que quieres eliminar el evento con id ${id} "${title}"?`);
        if (!confirmDelete) return;
      }
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
      <h1 className="text-3xl font-bold mb-6">
        Bienvenido, {user?.name || user?.email || 'Usuario'}
      </h1>

      {user.role === 'organizer' && (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href="/create/categories"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Crear categoría
          </Link>
          <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
            Ver estadísticas
          </button>
        </div>
      )}

      {user.role === 'organizer' ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">Tus eventos como organizador</h2>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventOrgCard key={event.id} event={event} onDelete={handleDeleteEvent} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-8">No has creado eventos todavía.</p>
          )}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Tus reservas</h2>
          {reservations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {reservations.map(({ reservation, tickets }) => (
                <ReservationCard key={reservation.id} reservation={reservation} tickets={tickets} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-8">No tienes reservas todavía.</p>
          )}
        </>
      )}
    </div>
  );
}