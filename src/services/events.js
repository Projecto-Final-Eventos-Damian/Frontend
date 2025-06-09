import { API_BASE_URL } from '@/utils/entorn';
import { apiFetch, apiFetchFormData } from './api';
import { getCurrentUser } from './auth';

export const createEvent = async (formData) => {
  const user = await getCurrentUser();
  formData.append("organizer_id", user.id);

  const res = await apiFetchFormData(`${API_BASE_URL}/events`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'Error al crear el evento');
  }

  return res.json();
};

export const updateEvent = async (id, formData) => {
  const user = await getCurrentUser();
  formData.append("organizer_id", user.id);

  const res = await apiFetchFormData(`${API_BASE_URL}/events/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'Error al actualizar el evento');
  }

  return res.json();
};

export const deleteEvent = async (id) => {
  const res = await apiFetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'Error al eliminar el evento');
  }
  return true;
};

export const getEventById = async (id) => {
  const res = await apiFetch(`${API_BASE_URL}/events/${id}`);
  if (!res.ok) throw new Error('No se pudo cargar el evento');
  return res.json();
};

export const getEvents = async () => {
  const res = await apiFetch(`${API_BASE_URL}/events`);
  if (!res.ok) throw new Error('No se pudo cargar los eventos');
  return res.json();
};

export const getOpenEvents = async () => {
  const res = await apiFetch(`${API_BASE_URL}/events/open`);
  if (!res.ok) throw new Error('No se pudo cargar los eventos');
  return res.json();
};

export const getOrganizerEvents = async (organizerId) => {
  const res = await apiFetch(`${API_BASE_URL}/events/organizer/${organizerId}`);
  if (!res.ok) throw new Error('No se pudieron obtener los eventos del organizador');
  return res.json();
};

export const notifyEventCancellation = async (eventId) => {
  const res = await apiFetch(`${API_BASE_URL}/reservations/event/${eventId}/notify-cancellation`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('No se pudieron enviar las notificaciones de cancelación');
  return res.json();
};