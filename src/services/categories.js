import { API_BASE_URL } from '@/utils/entorn';
import { apiFetch } from './api';

export const getCategories = async () => {
  const res = await apiFetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Error al obtener categorías');
  return res.json();
};

export const createCategory = async (categoryData) => {
  const res = await apiFetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || 'Error al crear categoría');
  }
  return res.json();
};