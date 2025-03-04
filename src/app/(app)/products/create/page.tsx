import { getSessionToken } from '@/lib/session'
import { getAllProductCategories } from '@/core/actions/product-category'
import { getAllProductTypes } from '@/core/actions/product-type'
import { getAllVendors } from '@/core/actions/vendor'
import type { Metadata } from 'next'
import { ProductsForm } from '../_components/products-form'

export const metadata: Metadata = {
  title: 'Create Product',
}

export default async function CreateProductPage() {
  const token = await getSessionToken()
  const categoriesPromise = getAllProductCategories(token!)
  const typesPromise = getAllProductTypes(token!)
  const vendorsPromise = getAllVendors(token!)

  return (
    <ProductsForm
      categoriesPromise={categoriesPromise}
      typesPromise={typesPromise}
      vendorsPromise={vendorsPromise}
    />
  )
}
