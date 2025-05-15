import { API_BASE_URL } from '@/utils/entorn';
import { apiFetch } from './api';

export const createTicketType = async (ticket) => {
  const res = await apiFetch(`${API_BASE_URL}/ticket-types`, {
    method: 'POST',
    body: JSON.stringify(ticket),
  });
  if (!res.ok) throw new Error('Error al crear un tipo de entrada');
  return res.json();
};
