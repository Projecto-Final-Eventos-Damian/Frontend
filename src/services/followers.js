import { apiFetch } from './api';
import { API_BASE_URL } from '@/utils/entorn';

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

export const followOrganizer = async ({ user_id, organizer_id }) => {
  const res = await apiFetch(`${API_BASE_URL}/followers`, {
    method: 'POST',
    body: JSON.stringify({ user_id, organizer_id }),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || 'Error al seguir al organizador');
  }
  return res.json();
};

export const unfollowOrganizer = async ({ user_id, organizer_id }) => {
  const res = await apiFetch(`${API_BASE_URL}/followers/${user_id}/${organizer_id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || 'Error al dejar de seguir');
  }
  return res.json();
};

export const checkFollowStatus = async (userId, organizerId) => {
  const res = await apiFetch(`${API_BASE_URL}/followers/check/${userId}/${organizerId}`);
  if (!res.ok) throw new Error("No se pudo comprobar el seguimiento");
  return res.json();
};
