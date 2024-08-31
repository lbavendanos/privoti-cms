'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/core/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ForgotForm } from './forgot-form'
import { LoginFooter } from '@/app/(auth)/login/_components/login-footer'

export function Forgot() {
  const { check } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (check) router.push('/')
  }, [check, router])

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">
          ¿Olvidaste tu contraseña?
        </CardTitle>
        <CardDescription className="text-center">
          Proporciona la dirección de correo electrónico de tu cuenta para
          recibir un correo electrónico y restablecer tu contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotForm />
      </CardContent>
      <CardFooter className="flex-col justify-center gap-1">
        <LoginFooter />
      </CardFooter>
    </Card>
  )
}
