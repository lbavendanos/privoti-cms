import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { ResetForm } from './reset-form'
import { AuthLayout } from '@/components/layouts/auth/auth-layout'

export function Reset() {
  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">
            Create your new password
          </CardTitle>
          <CardDescription className="text-center">
            Create a new password. After creating your password, you will remain
            logged in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
