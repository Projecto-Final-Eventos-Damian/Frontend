'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getOrganizerEvents, deleteEvent } from '@/services';
import EventOrgCard from '@/components/cards/eventOrgCard';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteEvent = async (id, title) => {
    const confirmDelete = window.confirm(`¿Seguro que quieres eliminar el evento con id ${id} "${title}"?`);
    if (!confirmDelete) return;
  
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      alert('Evento eliminado correctamente.');
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar el evento.');
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
        }
      } catch (err) {
        console.error(err);
        setEvents([]);
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
            <button className="ml-2 py-0 px-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300">Crear evento</button>
            <button className="ml-2 py-0 px-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300">Ver estadísticas</button>
          </>
        )}
        {user.role === 'user' && (
          <>
            <button className="ml-2 py-0 px-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300">Ver eventos</button>
            <button className="ml-2 py-0 px-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300">Mis inscripciones</button>
          </>
        )}
      </div><br></br>
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
        <p className="text-gray-600">Eres un usuario registrado. Aquí se podrían mostrar tus inscripciones u otra información.</p>
      )}
    </div>
  );
}
