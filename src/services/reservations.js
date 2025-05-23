import { toast } from 'react-hot-toast';
import { apiFetch } from '@/services/api';
import { API_BASE_URL } from '@/utils/entorn';

// cart = { 1: 2, 2: 1 } significa: 2 entradas del tipo 1 y 1 entrada del tipo 2
export const handleReservation = async ({ userId, eventId, cart, onSuccess }) => {
  try {
    const totalTickets = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    if (totalTickets === 0) {
      toast.error('Debes seleccionar al menos un ticket');
      return;
    }

    // 1. Crear reserva
    const reservationRes = await apiFetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        event_id: eventId,
        tickets_number: totalTickets,
        status: 'pending',
      }),
    });

    if (!reservationRes.ok) throw new Error('Error al crear la reserva');
    const reservation = await reservationRes.json();

    // 2. Crear tickets por cada tipo
    for (const [ticketTypeId, quantity] of Object.entries(cart)) {
      for (let i = 0; i < quantity; i++) {
        const ticketRes = await apiFetch(`${API_BASE_URL}/tickets`, {
          method: 'POST',
          body: JSON.stringify({
            reservation_id: reservation.id,
            ticket_type_id: parseInt(ticketTypeId),
            status: 'valid',
          }),
        });

        if (!ticketRes.ok) {
          throw new Error(`Error al crear el ticket tipo ${ticketTypeId}`);
        }
      }
    }

    toast.success('Reserva realizada exitosamente');
    onSuccess?.(reservation);
  } catch (err) {
    toast.error(err.message || 'Error al hacer la reserva');
    console.error(err);
  }
};
