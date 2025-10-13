import { Button } from '@/components/ui/button'
import { Spinner } from './spinner'

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
      {loading && <Spinner />}
      {children}
    </Button>
  )
}

export { LoadingButton }
