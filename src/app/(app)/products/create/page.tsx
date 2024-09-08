import type { Metadata } from 'next'
import { ProductsBreadcrumbList } from '../_components/products-breadcrumb-list'
import { ProductsForm } from '../_components/products-form'

export const metadata: Metadata = {
  title: 'Crear Producto',
}

export default function CreateProductPage() {
  return (
    <div className="container my-4 lg:my-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <div className="flex flex-col gap-4">
            <ProductsBreadcrumbList />
            <ProductsForm />
          </div>
        </div>
      </div>
    </div>
  )
}
