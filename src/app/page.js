'use client';

import { useEffect, useState } from "react";
import EventCard from "@/components/cards/eventCard";
import { getOpenEvents } from "@/services";
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [categories, setCategories] = useState([]);
  const [filterKey, setFilterKey] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getOpenEvents();
        setEvents(data);
        setFilteredEvents(data);
        const uniqueCategories = ['Todas', ...new Set(data.map(event => event.category.name))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error:", err);
        setEvents([]);
        setFilteredEvents([]);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || event.category.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredEvents(filtered);
    setFilterKey(prev => prev + 1);
  }, [searchTerm, selectedCategory, events]);

  if (!events) {
    return <p className="p-4">Cargando eventos...</p>;
  }

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-2xl font-bold mb-6">Eventos</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar eventos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-indigo-300 rounded-lg p-2 w-full sm:w-1/2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-indigo-300 rounded-lg p-2 w-full sm:w-1/4 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-gray-600">No se encontraron eventos.</p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={filterKey}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}