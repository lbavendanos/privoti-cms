import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Pedidos',
}

export default function OrdersPage() {
  return (
    <div className="container my-4 lg:my-6">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <div className="flex h-full flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Pedidos</h1>
            <div className="flex grow flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-white shadow-sm">
              <h3 className="text-2xl font-bold tracking-tight">
                No tienes pedidos
              </h3>
              <p className="text-sm text-muted-foreground">
                Puedes comenzar a vender tan pronto como recibas un pedido.
              </p>
              <Button className="mt-4">Agregar Pedido</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
