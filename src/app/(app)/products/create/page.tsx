import type { Metadata } from 'next'
import { ProductsBreadcrumbList } from '../_components/products-breadcrumb-list'
import { ProductsForm } from '../_components/products-form'

export const metadata: Metadata = {
  title: 'Crear Producto',
}

export default function CreateProductPage() {
  return (
    <div className="my-4 flex w-full flex-col gap-6 lg:my-6">
      <ProductsBreadcrumbList />
      <ProductsForm />
    </div>
  )
}
