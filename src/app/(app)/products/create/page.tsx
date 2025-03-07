import type { Metadata } from 'next'
import { ProductsForm } from '../_components/products-form'

export const metadata: Metadata = {
  title: 'Create Product',
}

export default function CreateProductPage() {
  return <ProductsForm />
}
