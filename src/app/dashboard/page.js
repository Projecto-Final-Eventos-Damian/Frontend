'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getOrganizerEvents, getReservationTickets, deleteEvent, getReservationsByEventId, notifyEventCancellation } from '@/services';
import { toast } from 'react-hot-toast';
import EventOrgCard from '@/components/cards/eventOrgCard';
import ReservationCard from '@/components/cards/ReservationCard';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros para eventos
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [startDate, setStartDate] = useState('');
  const [showFinished, setShowFinished] = useState('todos');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterKey, setFilterKey] = useState(0);

  // Filtros para reservas
  const [reservationSearch, setReservationSearch] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [reservationSortOrder, setReservationSortOrder] = useState('asc');
  const [reservationFilterKey, setReservationFilterKey] = useState(0);

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
          setFilteredEvents(organizerEvents);
        } else if (userData.role === 'user') {
          const userReservations = await getReservationTickets(userData.id);
          setReservations(userReservations);
          setFilteredReservations(userReservations);
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

  // Filtro dinámico para eventos
  useEffect(() => {
    let filtered = [...events];

    if (searchTerm.trim()) {
      filtered = filtered.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter(event => event.category.name === selectedCategory);
    }

    if (startDate) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.start_date_time).toISOString().split('T')[0];
        return eventDate === startDate;
      });
    }

    if (showFinished !== 'todos') {
      filtered = filtered.filter(event => {
        const eventFinished = new Date(event.end_date_time) < new Date();
        return showFinished === 'finalizados' ? eventFinished : !eventFinished;
      });
    }

    filtered.sort((a, b) => {
      return sortOrder === 'asc'
        ? new Date(a.start_date_time) - new Date(b.start_date_time)
        : new Date(b.start_date_time) - new Date(a.start_date_time);
    });

    setFilteredEvents(filtered);
    setFilterKey(prev => prev + 1);
  }, [searchTerm, selectedCategory, startDate, showFinished, sortOrder, events]);

  // Filtro dinámico para reservas
  useEffect(() => {
    let filtered = [...reservations];

    if (reservationSearch.trim()) {
      filtered = filtered.filter(({ reservation }) =>
        reservation.event.title.toLowerCase().includes(reservationSearch.toLowerCase())
      );
    }

    if (reservationDate) {
      filtered = filtered.filter(({ reservation }) => {
        const resDate = new Date(reservation.reserved_at).toISOString().split('T')[0];
        return resDate === reservationDate;
      });
    }

    filtered.sort((a, b) => {
      return reservationSortOrder === 'asc'
        ? new Date(a.reservation.reserved_at) - new Date(b.reservation.reserved_at)
        : new Date(b.reservation.reserved_at) - new Date(a.reservation.reserved_at);
    });

    setFilteredReservations(filtered);
    setReservationFilterKey(prev => prev + 1);
  }, [reservationSearch, reservationDate, reservationSortOrder, reservations]);

  if (loading) return <p className="p-4">Cargando datos...</p>;

  const categories = ['Todas', ...new Set(events.map(event => event.category.name))];

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

      {user.role === 'organizer' && (
        <>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-indigo-300 rounded-lg p-2 w-full lg:w-2/4 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-indigo-300 rounded-lg p-2 w-full lg:w-1/4 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={showFinished}
              onChange={(e) => setShowFinished(e.target.value)}
              className="border border-indigo-300 rounded-lg p-2 w-full lg:w-1/4 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="todos">Todos</option>
              <option value="finalizados">Finalizados</option>
              <option value="abiertos">Abiertos</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-indigo-300 rounded-lg p-2 w-full lg:w-1/4 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Tus eventos como organizador</h2>

          {filteredEvents.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={filterKey}
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <EventOrgCard event={event} onDelete={handleDeleteEvent} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className="text-center text-gray-600 mt-8">No se encontraron eventos con estos filtros.</p>
          )}
        </>
      )}

      {user.role === 'user' && (
        <>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar por nombre del evento..."
              value={reservationSearch}
              onChange={(e) => setReservationSearch(e.target.value)}
              className="border border-indigo-300 rounded-lg p-2 w-full lg:w-2/4 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              className="border border-indigo-300 rounded-lg p-2 w-full lg:w-1/4 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              onClick={() => setReservationSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              {reservationSortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Tus reservas</h2>

          {filteredReservations.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={reservationFilterKey}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredReservations.map(({ reservation, tickets }, index) => (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ReservationCard reservation={reservation} tickets={tickets} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className="text-center text-gray-600 mt-8">No se encontraron reservas con estos filtros.</p>
          )}
        </>
      )}
    </div>
  );
}