import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  name: yup.string().required('El nombre es obligatorio'),
  email: yup
    .string()
    .email('Introduce un correo válido')
    .required('El correo es obligatorio'),
  password: yup
    .string()
    .min(4, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Debes confirmar la contraseña'),
  role: yup
    .string()
    .oneOf(['user', 'organizer'], 'Rol inválido')
    .required('El rol es obligatorio'),
});
