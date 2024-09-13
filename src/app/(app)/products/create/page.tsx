import type { Metadata } from 'next'
import { ProductsBreadcrumbList } from '../_components/products-breadcrumb-list'
import { ProductsForm } from '../_components/products-form'

export const metadata: Metadata = {
  title: 'Crear Producto',
}

export default function CreateProductPage() {
  return (
    <div className="my-4 flex w-full flex-col gap-6 lg:my-6">
      <div className="container">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <ProductsBreadcrumbList />
          </div>
        </div>
      </div>
      <ProductsForm />
    </div>
  )
}
