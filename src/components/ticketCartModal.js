'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { handleReservation } from '@/services/reservations';
import { getCurrentUser } from '@/services';
import { useAuth } from '@/hook/authContext';
import TicketCart from './ticketCart';

export default function TicketCartModal({
  eventId,
  cart,
  ticketTypes,
  updateQuantity,
  totalPrice,
  onClose,
}) {
  const { isAuthenticated } = useAuth();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser().then((user) => setUserId(user.id)).catch(() => {
        toast.error('Error al obtener el usuario');
      });
    }
  }, [isAuthenticated]);

  const handleClick = async () => {
    if (!userId) {
      toast.error('Debes iniciar sesión para reservar');
      return;
    }

    try {
      await handleReservation({
        userId,
        eventId,
        cart,
        onSuccess: () => {
          console.log('Reserva realizada con éxito');
          onClose();
        },
      });
    } catch (err) {
      toast.error(err.message || 'Error al hacer la reserva');
    }
  };

  return (
    <>
      <TicketCart
        ticketTypes={ticketTypes}
        cart={cart}
        updateQuantity={updateQuantity}
        totalPrice={totalPrice}
      />

      <div className="mt-6 flex justify-between">
        <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 transition"
        >
            Volver
        </button>
        <button
            onClick={handleClick}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
            Confirmar Reserva
        </button>
      </div>
    </>
  );
}
