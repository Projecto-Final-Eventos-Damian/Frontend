import * as yup from 'yup';

const now = new Date();

const baseSchema = yup.object().shape({
  title: yup.string().required('El título es obligatorio'),
  description: yup.string().required('La descripción es obligatoria'),
  category_id: yup.string().required('La categoría es obligatoria'),
  capacity: yup
    .number()
    .typeError('La capacidad debe ser un número')
    .min(1, 'Debe haber al menos una persona')
    .required('La capacidad es obligatoria'),
  location: yup.string().required('La ubicación es obligatoria'),
});

export const createEventSchema = baseSchema.shape({
  start_date_time: yup
    .string()
    .required('La fecha de inicio es obligatoria')
    .test(
      'is-future-date',
      'La fecha de inicio no puede ser anterior a hoy',
      (value) => {
        if (!value) return false;
        const inputDate = new Date(value);
        return inputDate >= now;
      }
    ),
  end_date_time: yup
    .string()
    .required('La fecha de fin es obligatoria')
    .test(
      'is-after-start',
      'La fecha de fin debe ser posterior a la fecha de inicio',
      function (value) {
        const { start_date_time } = this.parent;
        if (!value || !start_date_time) return false;
        return new Date(value) > new Date(start_date_time);
      }
    ),
  ticket_types: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('El nombre del ticket es obligatorio'),
        description: yup.string().nullable(),
        price: yup
          .number()
          .typeError('El precio debe ser un número')
          .min(0, 'El precio no puede ser negativo')
          .required('El precio es obligatorio'),
      })
    )
    .min(1, 'Debe haber al menos un tipo de ticket'),
});

export const editEventSchema = baseSchema.shape({
  start_date_time: yup
    .string()
    .required('La fecha de inicio es obligatoria'),
  end_date_time: yup
    .string()
    .required('La fecha de fin es obligatoria')
    .test(
      'is-after-start',
      'La fecha de fin debe ser posterior a la fecha de inicio',
      function (value) {
        const { start_date_time } = this.parent;
        if (!value || !start_date_time) return false;
        return new Date(value) > new Date(start_date_time);
      }
    ),
});
