'use client'

import { useState } from 'react'
import { useAuth } from '@/core/auth'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail } from 'lucide-react'
import { EmailForm } from './email-form'

export function Email() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-12 justify-start"
        aria-label="Abrir correo electrónico"
        onClick={() => setOpen(true)}
      >
        <Mail className="mr-2 h-6 w-6" />
        <div className="flex flex-col items-start gap-y-1">
          <span className="text-sm font-medium leading-none">
            Correo electrónico
          </span>
          <span className="text-xs leading-none text-muted-foreground">
            {user?.email}
          </span>
        </div>
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
                Cambiar correo electrónico
              </h2>
            </div>
            <EmailForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
