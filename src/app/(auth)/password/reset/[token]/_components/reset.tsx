import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ResetForm } from './reset-form'
import { Suspense } from 'react'

export function Reset() {
  return (
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
        <Suspense fallback={null}>
          <ResetForm />
        </Suspense>
      </CardContent>
    </Card>
  )
}
