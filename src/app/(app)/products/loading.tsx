import { LoaderCircle } from 'lucide-react'

export default function EditProductLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <LoaderCircle
        className="animate-spin text-muted-foreground"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
    </div>
  )
}
