import { API_BASE_URL } from '@/utils/entorn';
import { apiFetch } from './api';
import { getCurrentUser } from './auth';

export const createRating = async (ratingData) => {
  const user = await getCurrentUser();
  const res = await apiFetch(`${API_BASE_URL}/ratings`, {
    method: 'POST',
    body: JSON.stringify({
      ...ratingData,
      user_id: user.id,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'Error al enviar la valoración');
  }

  return res.json();
};
