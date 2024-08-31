'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Asterisk } from 'lucide-react'
import { PasswordForm } from './password-form'

export function Password() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-12 justify-start"
        aria-label="Abrir password"
        onClick={() => setOpen(true)}
      >
        <Asterisk className="mr-2 h-6 w-6" />
        <span className="text-sm font-medium leading-none">Contraseña</span>
      </Button>
      {open && (
        <div className="absolute right-0 top-0 h-full w-full bg-background p-6">
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-row items-center gap-x-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-fit w-fit p-0"
                onClick={() => setOpen(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold uppercase text-foreground">
                Cambiar contraseña
              </h2>
            </div>
            <PasswordForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
