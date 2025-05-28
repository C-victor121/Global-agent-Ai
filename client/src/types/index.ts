export interface Todo {
  _id: string
  title: string
  completed: boolean
  createdAt: string
}

export interface TodoFormData {
  title: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface User {
  _id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  // Campos adicionales que puedas tener
  // provider?: string; // Ejemplo: 'google', 'credentials'
  // hashedPassword?: string | null; // Si lo manejas en el frontend, aunque no es común
}

export interface UserFormData {
  _id?: string; // Opcional, útil para saber si estamos editando
  name?: string;
  email?: string;
  password?: string; // Para creación y actualización opcional de contraseña
  role?: string;
}