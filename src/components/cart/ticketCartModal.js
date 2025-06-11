'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { handleReservation } from '@/services/reservations';
import { getCurrentUser } from '@/services';
import { useAuth } from '@/hook/authContext';
import { useRouter } from 'next/navigation';
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser().then((user) => setUserId(user.id)).catch(() => {
        toast.error('Error al obtener el usuario');
      });
    }
  }, [isAuthenticated]);

  const handleClick = async () => {
    if (isLoading) return;
  
    if (!userId) {
      toast.error('Debes iniciar sesión para reservar');
      return;
    }
  
    try {
      setIsLoading(true);
      await handleReservation({
        userId,
        eventId,
        cart,
        onSuccess: () => {
          toast.success('Reserva realizada exitosamente', { duration: 1500 });
          setTimeout(() => {
            toast.success('Correo mandado con los datos de la reserva y las entradas', {
              duration: 3500,
            });
          }, 1700);
          onClose();
          router.push('/dashboard');
        },
      });
    } catch (err) {
      toast.error(err.message || 'Error al hacer la reserva');
    } finally {
      setIsLoading(false);
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

      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 transition w-full sm:w-auto"
        >
          Volver
        </button>
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`px-4 py-2 font-semibold rounded-full transition w-full sm:w-auto ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isLoading ? 'Procesando...' : 'Confirmar Reserva'}
        </button>
      </div>
    </>
  );
}
