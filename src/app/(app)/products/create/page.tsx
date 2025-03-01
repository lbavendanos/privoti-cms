import { getSessionToken } from '@/lib/session'
import { getAllProductTypes } from '@/core/actions/product-type'
import type { Metadata } from 'next'
import { ProductsForm } from '../_components/products-form'

export const metadata: Metadata = {
  title: 'Create Product',
}

export default async function CreateProductPage() {
  const token = await getSessionToken()
  const typesPromise = getAllProductTypes(token!)

  return <ProductsForm typesPromise={typesPromise} />
}
