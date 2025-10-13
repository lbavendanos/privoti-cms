import { Spinner } from './ui/spinner'

export function Loading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Spinner className="text-muted-foreground" />
    </div>
  )
}
