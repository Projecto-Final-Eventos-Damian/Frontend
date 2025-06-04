import { API_BASE_URL } from '@/utils/entorn';
import { apiFetch, apiFetchFormData } from './api';

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al registrarse');
  }

  return res.json();
};

export const registerUser = async (name, email, password, role) => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al registrarse');
  }

  return res.json();
};

export const getCurrentUser = async () => {
  const res = await apiFetch(`${API_BASE_URL}/user`);
  if (!res.ok) throw new Error('No se pudo obtener el usuario');
  return res.json();
};

export const updateUser = async (formData) => {
  const user = await getCurrentUser();
  const res = await apiFetchFormData(`${API_BASE_URL}/users/${user.id}`, {
    method: 'PATCH',
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'Error al actualizar perfil');
  }

  return res.json();
};

export const deleteUserImage = async () => {
  const user = await getCurrentUser();

  const res = await apiFetch(`${API_BASE_URL}/users/${user.id}/image`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'No se pudo eliminar la imagen');
  }

  return res.json();
};
