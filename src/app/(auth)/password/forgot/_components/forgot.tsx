import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { ForgotForm } from './forgot-form'
import { LoginFooter } from '@/app/(auth)/login/_components/login-footer'

export function Forgot() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">
          Forgot your password?
        </CardTitle>
        <CardDescription className="text-center">
          Please provide your account email address to receive an email to reset
          your password.
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
