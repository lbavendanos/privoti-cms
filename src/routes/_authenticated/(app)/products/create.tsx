import { createFileRoute } from '@tanstack/react-router'
import { ProductCreate } from '@/features/product/components/product-create'

export const Route = createFileRoute('/_authenticated/(app)/products/create')({
  component: ProductCreate,
})
