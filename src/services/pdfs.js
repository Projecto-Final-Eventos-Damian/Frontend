import { apiFetch } from '@/services/api';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/utils/entorn';

export const downloadReservationPDF = async (reservationId) => {
  try {
    const res = await apiFetch(`${API_BASE_URL}/reservations/${reservationId}/pdf`, {
      method: 'GET',
    });

    if (!res.ok) throw new Error('Error al obtener el PDF');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `reserva_${reservationId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    toast.error(err.message || 'No se pudo descargar el PDF.');
  }
};
