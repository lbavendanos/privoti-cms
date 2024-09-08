import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Productos',
}

export default function ProductsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Productos</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed bg-white shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            No tienes productos
          </h3>
          <p className="text-sm text-muted-foreground">
            Puedes comenzar a vender tan pronto como agregues un producto.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/products/create">Agregar Producto</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
