import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginForm } from './login-form'

export function Login() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">Iniciar sesión</CardTitle>
        <CardDescription className="text-center">
          Introduzca su correo electrónico a continuación para iniciar sesión en
          su cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
