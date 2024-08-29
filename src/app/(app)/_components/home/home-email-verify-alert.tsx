'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function HomeEmailVerifyAlert() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)

  const handleClick = useCallback(() => {
    router.replace('/')
    setOpen(false)
  }, [router])

  useEffect(() => {
    searchParams.has('verified') && setOpen(true)
  }, [searchParams])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¡Verificación de correo electronico exitosa!
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se ha verficado tu correo electronico correctamente y ya puedes
            disfrutar de todas las funcionalidades de la plataforma.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClick}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
