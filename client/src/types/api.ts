// Tipos para las respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Tipos para errores de API
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

// Tipos para paginación
export interface PaginationInfo {
  current: number;
  total: number;
  count: number;
  limit?: number;
}

// Tipos para respuestas paginadas
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Tipos para filtros comunes
export interface BaseFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Tipos para respuestas de autenticación
export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  token?: string;
}

// Tipos para respuestas de usuario
export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  googleId?: string;
  facebookId?: string;
  twilioPhoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}