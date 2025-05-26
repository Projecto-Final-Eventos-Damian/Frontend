import { apiFetch } from '@/services/api';
import { API_BASE_URL } from '@/utils/entorn';

export const getTicketsByReservation = async (reservationId) => {
    const res = await apiFetch(`${API_BASE_URL}/tickets/reservation/${reservationId}`);
    if (!res.ok) throw new Error('No se pudieron obtener los tickets');
    return res.json();
  };