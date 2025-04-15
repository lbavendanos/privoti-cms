import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean
}

function LoadingButton({
  loading,
  disabled,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={loading || disabled}>
      {loading && (
        <LoaderCircle
          className="-ms-1 animate-spin"
          size={16}
          aria-hidden="true"
        />
      )}
      {children}
    </Button>
  )
}

export { LoadingButton }
