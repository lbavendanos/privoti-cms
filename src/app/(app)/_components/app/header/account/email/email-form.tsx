'use client'

import { z } from 'zod'
import { useCallback, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/core/auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

const FormSchema = z.object({
  email: z
    .string({
      required_error: 'El email es requerido.',
      invalid_type_error: 'El email debe ser una cadena.',
    })
    .trim()
    .toLowerCase()
    .min(1, { message: 'Debes introducir un email' })
    .email({ message: 'Email inválido.' }),
})

type FormValues = z.infer<typeof FormSchema>

interface EmailFormProps {
  onSuccess?: () => void
}

export function EmailForm({ onSuccess }: EmailFormProps) {
  const { user, sendEmailChangeVerificationNotification } = useAuth()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: user?.email || '',
    },
  })

  const handleSubmit = useCallback(
    (data: FormValues) => {
      if (data.email === user?.email) {
        onSuccess?.()
        return
      }

      startTransition(async () => {
        const { error } = await sendEmailChangeVerificationNotification(data)

        if (error) {
          toast({
            variant: 'destructive',
            description: error,
          })

          return
        }

        toast({
          title: 'Se envió un correo electrónico de confirmación.',
          description:
            'Verifique su bandeja de entrada para confirmar su nueva dirección de correo electrónico.',
        })
        onSuccess?.()
      })
    },
    [user, sendEmailChangeVerificationNotification, toast, onSuccess],
  )

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="m@ejemplo.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Una vez que cambie su dirección de correo electrónico, se le
                enviará un correo de confirmación a su nueva dirección de correo
                electrónico para verificarla.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mb-6 mt-2 w-full"
          aria-disabled={isPending}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar
        </Button>
      </form>
    </Form>
  )
}
