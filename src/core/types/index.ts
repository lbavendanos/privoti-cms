export type User = {
  id: number
  name: string
  email: string
  avatar?: string
  phone?: string
  dob?: string
  email_verified_at?: string
  updated_at?: string
  created_at?: string
}

export type Collection = {
  id: number
  title: string
  handle: string
  description?: string
  updated_at?: string
  created_at?: string
}

export type ProductCategory = {
  id: number
  name: string
  handle: string
  description?: string
  is_active: boolean
  is_public: boolean
  rank: number
  parent_id?: number
  updated_at?: string
  created_at?: string
}

export type ProductType = {
  id: number
  name: string
  updated_at?: string
  created_at?: string
}

export type Vendor = {
  id: number
  name: string
  updated_at?: string
  created_at?: string
}
