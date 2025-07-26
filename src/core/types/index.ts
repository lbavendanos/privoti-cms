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

export type ProductStatus = 'draft' | 'active' | 'archived'

export type Product = {
  id: number
  title: string
  subtitle?: string
  handle: string
  description?: string
  thumbnail?: string
  stock: number
  status: ProductStatus
  tags?: string[]
  metadata?: Record<string, string>
  category_id?: number
  type_id?: number
  vendor_id?: number
  updated_at?: string
  created_at?: string
  category?: ProductCategory
  type?: ProductType
  vendor?: Vendor
  collections?: Collection[]
  media?: ProductMedia[]
  options?: ProductOption[]
  variants?: ProductVariant[]
}

export type ProductMedia = {
  id: number
  url: string
  name: string
  type: string
  rank: number
  product_id: number
  updated_at?: string
  created_at?: string
}

export type ProductOption = {
  id: number
  name: string
  product_id: number
  updated_at?: string
  created_at?: string
  values?: ProductOptionValue[]
}

export type ProductOptionValue = {
  id: number
  value: string
  option_id: number
  updated_at?: string
  created_at?: string
}

export type ProductVariant = {
  id: number
  name: string
  price: number
  quantity: number
  sku?: string
  barcode?: string
  product_id: number
  updated_at?: string
  created_at?: string
  values?: ProductOptionValue[]
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

export type Meta = {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

export type List<T> = {
  data: T[]
  meta: Meta
}
