import * as yup from 'yup';

export const categorySchema = yup.object().shape({
  name: yup.string().required('El nombre de la categoría es obligatorio'),
  description: yup
    .string()
    .max(500, 'La descripción no puede superar los 500 caracteres')
    .nullable(),
});
