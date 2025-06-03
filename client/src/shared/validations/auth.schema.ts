import { z } from 'zod';

// Mensajes de error personalizados en español
const errorMessages = {
  required: 'Este campo es requerido',
  email: 'Correo electrónico inválido',
  minLength: (field: string, length: number) => `${field} debe tener al menos ${length} caracteres`,
  maxLength: (field: string, length: number) => `${field} no puede tener más de ${length} caracteres`,
  passwordMatch: 'Las contraseñas no coinciden'
};

// Esquema base para el correo electrónico
const emailSchema = z.string({
  required_error: errorMessages.required
}).email(errorMessages.email);

// Esquema base para la contraseña
const passwordSchema = z.string({
  required_error: errorMessages.required
}).min(8, errorMessages.minLength('La contraseña', 8));

// Esquema para el inicio de sesión
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

// Esquema para el registro
export const registerSchema = z.object({
  name: z.string({
    required_error: errorMessages.required
  }).min(2, errorMessages.minLength('El nombre', 2))
    .max(50, errorMessages.maxLength('El nombre', 50)),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: errorMessages.passwordMatch,
  path: ['confirmPassword']
});

// Esquema para recuperación de contraseña
export const forgotPasswordSchema = z.object({
  email: emailSchema
});

// Tipos inferidos de los esquemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;