import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Introduce un correo válido')
    .required('El correo es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
});