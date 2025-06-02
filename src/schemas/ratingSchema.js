import * as yup from 'yup';

export const ratingSchema = yup.object().shape({
  rating: yup
    .number()
    .required('La puntuación es obligatoria')
    .min(1, 'Debes seleccionar al menos una estrella')
    .max(5, 'Máximo 5 estrellas'),
  review: yup.string().nullable().max(500, 'Máximo 500 caracteres'),
});