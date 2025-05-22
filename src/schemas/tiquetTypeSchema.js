import * as yup from 'yup';

export const ticketTypeSchema = yup.object().shape({
  name: yup.string().required('El nombre del ticket es obligatorio'),
  description: yup.string().nullable(),
  price: yup
    .number()
    .typeError('El precio debe ser un número')
    .min(0, 'El precio no puede ser negativo')
    .required('El precio es obligatorio'),
});
