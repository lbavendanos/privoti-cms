import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { LoginForm } from './login-form'
import { AuthLayout } from '@/components/layouts/auth/auth-layout'

export function Login() {
  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <LoginForm />
          <Button variant="link" className="h-fit p-0" asChild>
            <Link to="/password/forgot">Forgot your password?</Link>
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
