'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEventById, getFollowersCount, getEventTicketTypes } from "@/services";
import { API_BASE_URL } from "@/utils/entorn";
import { useTicketCart } from "@/hook/useTicketCart";
import TicketCart from "@/components/ticketCart";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);

  const { cart, updateQuantity, totalPrice } = useTicketCart(ticketTypes);

  useEffect(() => {
    if (id) {
      getEventById(id)
        .then((eventData) => {
          setEvent(eventData);
          getFollowersCount(eventData.organizer.id)
            .then(setFollowersCount)
            .catch(console.error);
        })
        .catch(console.error);

      getEventTicketTypes(id)
        .then(setTicketTypes)
        .catch(console.error);
    }
  }, [id]);

  if (!event) return <div>Cargando evento...</div>;

  return (
    <div className="p-6">
      <img
        src={`${API_BASE_URL}${event.image_url}`}
        alt={event.title}
        className="mt-4 max-w-md"
      />
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="mt-4 text-lg">{event.description}</p>

      <div className="mt-6 p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-2">Organizado por</h2>
        <p>
          {event.organizer.name} con {followersCount} <strong>followers</strong>{" "}
          <button className="ml-2 py-0 px-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300">+</button>
        </p>
      </div>

      <p><strong>Ubicación:</strong> {event.location}</p>
      <p><strong>Inicio:</strong> {new Date(event.start_date_time).toLocaleString()}</p>
      <p><strong>Fin:</strong> {new Date(event.end_date_time).toLocaleString()}</p>
      <p><strong>Capacidad:</strong> {event.capacity}</p>

      {ticketTypes.length > 0 && (
        <TicketCart
          ticketTypes={ticketTypes}
          cart={cart}
          updateQuantity={updateQuantity}
          totalPrice={totalPrice}
        />
      )}
    </div>
  );
}
