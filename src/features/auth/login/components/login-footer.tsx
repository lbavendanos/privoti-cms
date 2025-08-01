import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { CardDescription } from '@/components/ui/card'

export function LoginFooter() {
  return (
    <CardDescription>
      Already have an account?{' '}
      <Button variant="link" className="h-fit w-fit p-0" asChild>
        <Link to="/login">Login</Link>
      </Button>
    </CardDescription>
  )
}
