import { apiFetch } from './api';

export const loginUser = async (email, password) => {
  const res = await fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Credenciales incorrectas');
  return res.json();
};

export const getCurrentUser = async () => {
    const res = await apiFetch('http://localhost:8000/user');
    if (!res.ok) throw new Error('No se pudo obtener el usuario');
    return res.json();
};

export const createEvent = async (eventData) => {
    const user = await getCurrentUser();
  
    const res = await apiFetch('http://localhost:8000/events', {
      method: 'POST',
      body: JSON.stringify({
        ...eventData,
        organizer_id: user.id,
      }),
    });
  
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || 'Error al crear el evento');
    }
  
    return res;
};

export const getCategories = async () => {
    const res = await apiFetch('http://localhost:8000/categories');
    if (!res.ok) throw new Error('Error al obtener categorías');
    return await res.json();
};