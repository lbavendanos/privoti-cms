import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function ProductEmpty() {
  return (
    <div className="@container mx-auto my-4 size-full max-w-5xl px-4 lg:my-6">
      <div className="flex h-full flex-col gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <div className="flex grow flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-white p-4 shadow-sm">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no products
          </h3>
          <p className="text-muted-foreground text-sm">
            You can start selling as soon as you add a product.
          </p>
          <Button className="mt-4" asChild>
            <Link from="/products" to="/products/create">
              Add product
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
