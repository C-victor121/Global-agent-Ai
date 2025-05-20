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