'use client';

import { useEffect, useState } from "react";
import EventCard from "@/components/cards/eventCard";
import { getEvents } from "@/services";

export default function Home() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents()
        setEvents(data);
      } catch (err) {
        console.error("Error:", err);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  if (!events) {
    return <p className="p-4">Cargando eventos...</p>;
  }

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-2xl font-bold mb-6">Eventos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
