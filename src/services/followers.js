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