import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Clientes',
}

export default function ClientsPage() {
  return (
    <div className="container my-4 lg:my-6">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <div className="flex h-full flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Clientes</h1>
            <div className="flex grow flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-white shadow-sm">
              <h3 className="text-2xl font-bold tracking-tight">
                No tienes clientes
              </h3>
              <p className="text-sm text-muted-foreground">
                Puedes comenzar a vender tan pronto como agregues un cliente.
              </p>
              <Button className="mt-4">Agregar Cliente</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
