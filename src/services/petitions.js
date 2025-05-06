import { apiFetch, apiFetchFormData } from './api';
import { API_BASE_URL } from '@/utils/entorn';

export const loginUser = async (email, password) => {
  const res = await fetch(API_BASE_URL+'/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Credenciales incorrectas');
  return res.json();
};

export const getCurrentUser = async () => {
  const res = await apiFetch(API_BASE_URL+'/user');
  if (!res.ok) throw new Error('No se pudo obtener el usuario');
  return res.json();
};

export const createEvent = async (formData) => {
  const user = await getCurrentUser();

  formData.append("organizer_id", user.id);

  const res = await apiFetchFormData(API_BASE_URL+'/events', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'Error al crear el evento');
  }

  return res.json();
};

export const getCategories = async () => {
  const res = await apiFetch(API_BASE_URL+'/categories');
  if (!res.ok) throw new Error('Error al obtener categorías');
  return await res.json();
};