'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getOrganizerEvents } from '@/services/petitions';
import EventCard from '@/components/cards/eventCard';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {user.role === 'organizer' ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Tus eventos como organizador</h2>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
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
