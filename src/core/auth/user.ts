import type { ApiError } from '@/lib/http'

export interface User {
  id: number
  first_name: string
  last_name: string
  dob?: string
  phone?: string
  email: string
  email_verified_at?: string
  updated_at?: string
  created_at?: string
}

export type UserResponse = { user?: User } & ApiError
