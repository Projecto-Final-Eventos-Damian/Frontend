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

export const updateTicketType = async (ticketId, updatedData) => {
  const res = await apiFetch(`${API_BASE_URL}/ticket-types/${ticketId}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error('Error al actualizar el tipo de ticket');
  return res.json();
};

export const getTicketTypeById = async (ticketId) => {
  const res = await apiFetch(`${API_BASE_URL}/ticket-types/${ticketId}`);
  if (!res.ok) throw new Error('Error al obtener los datos del ticket');
  return res.json();
};

export const getEventTicketTypes = async (eventId) => {
  const res = await apiFetch(`${API_BASE_URL}/ticket-types/event/${eventId}`);
  if (!res.ok) throw new Error('Error al obtener tipos de ticket');
  return res.json();
};