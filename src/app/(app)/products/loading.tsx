import { LoaderCircle } from 'lucide-react'

export default function EditProductLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <LoaderCircle
        className="text-muted-foreground animate-spin"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
    </div>
  )
}
