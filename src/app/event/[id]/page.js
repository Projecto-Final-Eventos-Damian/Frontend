'use client';

import { useEffect, useState } from "react";
import { useAuth } from '@/hook/authContext';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import { useParams } from "next/navigation";
import { getEventById, getEventTicketTypes, getReservedTicketsCount } from "@/services";
import { API_BASE_URL } from "@/utils/entorn";
import { useTicketCart } from "@/hook/useTicketCart";
import TicketCartModal from "@/components/cart/ticketCartModal";
import OrganizerInfoEvent from "@/components/organizerInfoEvent";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [reservedCount, setReservedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { cart, updateQuantity, totalPrice, resetCart } = useTicketCart(ticketTypes);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetCart();
  };

  useEffect(() => {
    if (id) {
      getEventById(id)
        .then((eventData) => setEvent(eventData))
        .catch(console.error);

      getEventTicketTypes(id)
        .then(setTicketTypes)
        .catch(console.error);

      getReservedTicketsCount(id)
        .then(setReservedCount)
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
      <OrganizerInfoEvent organizer={event.organizer} eventId={id} />
      <p><strong>Ubicación:</strong> {event.location}</p>
      <p><strong>Inicio:</strong> {new Date(event.start_date_time).toLocaleString()}</p>
      <p><strong>Fin:</strong> {new Date(event.end_date_time).toLocaleString()}</p>
      <p><strong>Plazas disponibles:</strong> {event.capacity - reservedCount} / {event.capacity}</p>

      {ticketTypes.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => {
              if (!isAuthenticated) {
                router.push(`/login?redirect=/event/${id}`);
              } else {
                setIsModalOpen(true);
              }
            }}
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