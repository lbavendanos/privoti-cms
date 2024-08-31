'use client'

import { useState } from 'react'
import { useAuth } from '@/core/auth'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User } from 'lucide-react'
import { DetailForm } from './detail-form'

export function Detail() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-12 justify-start"
        aria-label="Abrir información personal"
        onClick={() => setOpen(true)}
      >
        <User className="mr-2 h-6 w-6" />
        <div className="flex flex-col items-start gap-y-1">
          <span className="text-sm font-medium leading-none">
            Información personal
          </span>
          <span className="text-xs leading-none text-muted-foreground">
            {user?.first_name} {user?.last_name}
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
                Editar información personal
              </h2>
            </div>
            <DetailForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
