'use client'

import { CircleUser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Detail } from './detail/detail'
import { Email } from './email/email'
import { Password } from './password/password'
import { AccountLogoutButton } from './account-logout-button'

export function Account() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-fit w-fit p-0"
          aria-label="Abrir cuenta"
        >
          <CircleUser className="h-6 w-6" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>Cuenta</SheetTitle>
            <SheetDescription>
              Usa tu cuenta para acceder a todas las funcionalidades de la app.
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        <div className="flex flex-col gap-y-2">
          <h2 className="text-lg font-semibold uppercase text-foreground">
            Datos personales
          </h2>
          <div className="flex flex-col gap-y-4">
            <p className="text-sm text-muted-foreground">
              Modifica tus datos personales a continuación para que tu cuenta
              esté actualizada.
            </p>
            <div className="flex h-full flex-col gap-y-2">
              <Detail />
              <Email />
              <Password />
            </div>
            <AccountLogoutButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
