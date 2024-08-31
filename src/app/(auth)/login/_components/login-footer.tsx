import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CardDescription } from '@/components/ui/card'

export function LoginFooter() {
  return (
    <CardDescription>
      ¿Ya tiene una cuenta?{' '}
      <Button variant="link" className="h-fit w-fit p-0" asChild>
        <Link href="/login">Inicia sesión</Link>
      </Button>
    </CardDescription>
  )
}
