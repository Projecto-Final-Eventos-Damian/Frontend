import { apiFetch, apiFetchFormData } from './api';
import { API_BASE_URL } from '@/utils/entorn';

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Credenciales incorrectas');
  return res.json();
};

export const getCurrentUser = async () => {
  const res = await apiFetch(`${API_BASE_URL}/user`);
  if (!res.ok) throw new Error('No se pudo obtener el usuario');
  return res.json();
};

export const getFollowersCount = async (organizerId) => {
  const res = await apiFetch(`${API_BASE_URL}/followers/organizer/${organizerId}`);
  console.log("Respuesta de API para seguidores:", res);
  if (!res.ok) {
    throw new Error('No se pudo obtener la cantidad de seguidores');
  }
  const followers = await res.json();
  console.log("Followers recibidos:", followers);
  return followers.length;
};

export const getCategories = async () => {
  const res = await apiFetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Error al obtener categorías');
  return await res.json();
};

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

export const getEventById = async (id) => {
  const res = await apiFetch(`${API_BASE_URL}/events/${id}`);
  if (!res.ok) throw new Error('No se pudo cargar el evento');
  return await res.json();
};

export const getEvents = async () => {
  const res = await apiFetch(`${API_BASE_URL}/events`);
  if (!res.ok) throw new Error('No se pudo cargar los eventos');
  return await res.json();
};

export const getOrganizerEvents = async (organizerId) => {
  const res = await apiFetch(`${API_BASE_URL}/events/organizer/${organizerId}`);
  if (!res.ok) throw new Error('No se pudieron obtener los eventos del organizador');
  return res.json();
};