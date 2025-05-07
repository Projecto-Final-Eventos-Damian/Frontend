"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEventById } from "@/services/petitions";
import { API_BASE_URL } from "@/utils/entorn";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      getEventById(id)
        .then(setEvent)
        .catch((e) => {
          console.error("Error al cargar el evento:", e);
          setError(e.message);
        });
    }
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Cargando evento...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <img
        src={`${API_BASE_URL}${event.image_url}`}
        alt={event.title}
        className="mt-4 max-w-md"
      />
      <p className="mt-4 text-lg">{event.description}</p>
      <p>
        <strong>Ubicación:</strong> {event.location}
      </p>
      <p>
        <strong>Inicio:</strong>{" "}
        {new Date(event.start_date_time).toLocaleString()}
      </p>
      <p>
        <strong>Fin:</strong>{" "}
        {new Date(event.end_date_time).toLocaleString()}
      </p>
      <p>
        <strong>Capacidad:</strong> {event.capacity}
      </p>
    </div>
  );
}
