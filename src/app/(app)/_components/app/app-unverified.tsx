'use client'

import { useCallback, useTransition } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/core/auth'
import { Button } from '@/components/ui/button'
import { AccountLogoutButton } from './header/account/account-logout-button'
import { Loader2 } from 'lucide-react'

function AppResendEmailButton() {
  const { sendEmailVerificationNotification } = useAuth()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const handleResendEmail = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      startTransition(async () => {
        const { error } = await sendEmailVerificationNotification()

        if (error) {
          toast({
            variant: 'destructive',
            description: error,
          })

          return
        }

        toast({
          description:
            'Se ha enviado un nuevo enlace de verificación a la dirección de correo electrónico que proporcionó durante el registro.',
        })
      })
    },
    [sendEmailVerificationNotification, toast],
  )

  return (
    <Button
      type="button"
      variant="default"
      size="lg"
      className="w-full"
      aria-disabled={isPending}
      disabled={isPending}
      onClick={handleResendEmail}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Reenviar correo de verificación
    </Button>
  )
}

export function AppUnverified() {
  return (
    <main className="flex grow flex-col justify-center">
      <section className="container h-full">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4 xl:col-span-4 xl:col-start-5">
            <div className="flex flex-col gap-4">
              <h1 className="text-center text-3xl font-bold tracking-tight lg:text-4xl">
                Gracias por registrarte!
              </h1>
              <p className="text-center text-base text-muted-foreground lg:text-lg">
                Antes de comenzar, ¿podría verificar su dirección de correo
                electrónico haciendo clic en el enlace que le acabamos de enviar
                por correo electrónico? Si no recibió el correo electrónico, con
                gusto le enviaremos otro.
              </p>
              <div className="space-y-2">
                <AppResendEmailButton />
                <AccountLogoutButton />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
