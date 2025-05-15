import { API_BASE_URL } from '@/utils/entorn';
import { apiFetch } from './api';

export const getCategories = async () => {
  const res = await apiFetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Error al obtener categorías');
  return res.json();
};
