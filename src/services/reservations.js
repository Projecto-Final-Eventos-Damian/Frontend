import { toast } from 'react-hot-toast';
import { apiFetch } from '@/services/api';
import { API_BASE_URL } from '@/utils/entorn';

export const getReservationTickets = async (userId) => {
  const res = await apiFetch(`${API_BASE_URL}/reservations/user/${userId}/tickets`);
  if (!res.ok) throw new Error('No se pudieron obtener las reservas del usuario');
  return res.json();
};

export const getReservation = async (reservationId) => {
  const res = await apiFetch(`${API_BASE_URL}/reservations/${reservationId}`);
  if (!res.ok) throw new Error('No se pudo obtener la reserva');
  return res.json();
};

export const getReservedTicketsCount = async (eventId) => {
  const res = await apiFetch(`${API_BASE_URL}/reservations/event/${eventId}/reserved-count`);
  if (!res.ok) throw new Error('No se pudo obtener el conteo de reservas');
  return res.json();
};

export const getReservationsTicketsByEventId = async (eventId) => {
  const res = await apiFetch(`${API_BASE_URL}/reservations/event/${eventId}/tickets`);
  if (!res.ok) throw new Error('No se pudieron obtener las reservas');
  return res.json();
};

export const handleReservation = async ({ userId, eventId, cart, onSuccess }) => {
  try {
    const totalTickets = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    if (totalTickets === 0) {
      toast.error('Debes seleccionar al menos un ticket');
      return;
    }

    const reservationRes = await apiFetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        event_id: eventId,
        tickets_number: totalTickets,
        status: 'pending',
      }),
    });

    if (!reservationRes.ok) {
      const errorData = await reservationRes.json();
      throw new Error(errorData.detail || 'Error al crear la reserva');
    }

    const reservation = await reservationRes.json();

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

    const emailRes = await apiFetch(`${API_BASE_URL}/reservations/${reservation.id}/send-confirmation`, {
      method: 'POST',
    });

    if (!emailRes.ok) {
      console.warn('Error al enviar el correo de confirmación');
    }

    toast.success('Reserva realizada exitosamente');
    onSuccess?.(reservation);
  } catch (err) {
    toast.error(err.message || 'Error al hacer la reserva');
    console.error(err);
  }
};
