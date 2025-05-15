import { API_BASE_URL } from '@/utils/entorn';
import { apiFetch } from './api';

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