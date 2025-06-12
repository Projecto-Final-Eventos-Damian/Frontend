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
    
    if (id) {
      getReservedTicketsCount(id)
      .then(setReservedCount)
      .catch(console.error);
    }
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
  
  const availableSpots = event.capacity - reservedCount;
  const isFinished = new Date(event.end_date_time) < new Date();

  return (
    <div className="min-h-screen bg-teal-200 py-10 px-4 sm:px-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-indigo-300">
        <div className={`relative ${isFinished ? 'overlay-finalizado' : ''}`}>
          {event.image_url && (
            <img
              src={`${API_BASE_URL}${event.image_url}`}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg mb-6 transition-transform"
            />
          )}
        </div>

        <h1 className="text-4xl font-bold text-indigo-600 mb-4">{event.title}</h1>

        <p className="text-gray-700 mb-6">{event.description}</p>

        <OrganizerInfoEvent organizer={event.organizer} eventId={id} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-gray-700">
          <div className="p-4 bg-gray-100 border border-indigo-300 rounded-lg shadow">
            <strong>Inicio</strong>
            <p>{new Date(event.start_date_time).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-100 border border-indigo-300 rounded-lg shadow">
            <strong>Fin</strong>
            <p>{new Date(event.end_date_time).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-100 border border-indigo-300 rounded-lg shadow">
            <strong>Ubicación</strong>
            <p>{event.location}</p>
          </div>
          <div className="p-4 bg-gray-100 border border-indigo-300 rounded-lg shadow">
            <strong>Plazas disponibles</strong>
            <p>{availableSpots} / {event.capacity}</p>
          </div>
        </div>

        {ticketTypes.length > 0 && (
          <div className="mt-8 flex justify-center">
            {availableSpots <= 0 ? (
              <span className="text-red-600 font-semibold text-xl">Entradas Agotadas</span>
            ) : (
              new Date() < new Date(event.end_date_time) && user?.role !== 'organizer' && (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      router.push(`/login?redirect=/event/${id}`);
                    } else {
                      setIsModalOpen(true);
                    }
                  }}
                  className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-transform hover:scale-105"
                >
                  Reservar Tickets
                </button>
              )
            )}
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

        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 transition"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}