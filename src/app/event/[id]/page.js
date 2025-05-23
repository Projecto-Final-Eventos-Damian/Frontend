'use client';

import { useEffect, useState } from "react";
import { Dialog } from '@headlessui/react';
import { useParams } from "next/navigation";
import { getEventById, getFollowersCount, getEventTicketTypes } from "@/services";
import { API_BASE_URL } from "@/utils/entorn";
import { useTicketCart } from "@/hook/useTicketCart";
import TicketCartModal from "@/components/ticketCartModal";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { cart, updateQuantity, totalPrice, resetCart } = useTicketCart(ticketTypes);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetCart();
  };

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
        <div className="mt-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Reservar Tickets
          </button>
        </div>
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-2xl font-bold mb-4">Carrito de Tickets</Dialog.Title>
            <TicketCartModal
              eventId={id}
              cart={cart}
              ticketTypes={ticketTypes}
              updateQuantity={updateQuantity}
              totalPrice={totalPrice}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}