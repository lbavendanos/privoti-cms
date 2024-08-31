'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/core/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ResetForm } from './reset-form'

export function Reset() {
  const { check } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (check) router.push('/')
  }, [check, router])

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">
          Crea tu nueva contraseña
        </CardTitle>
        <CardDescription className="text-center">
          Crea una contraseña nueva. Después de crear tu contraseña,
          permanecerás conectado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetForm />
      </CardContent>
    </Card>
  )
}
