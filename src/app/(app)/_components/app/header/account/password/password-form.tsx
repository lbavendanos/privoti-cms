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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/ui/password-input'
import { Loader2 } from 'lucide-react'

const FormSchema = z.object({
  current_password: z
    .string({
      required_error: 'La contraseña es requerida.',
      invalid_type_error: 'La contraseña debe ser una cadena.',
    })
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
  password: z
    .string({
      required_error: 'La contraseña es requerida.',
      invalid_type_error: 'La contraseña debe ser una cadena.',
    })
    .optional(),
})

type FormValues = z.infer<typeof FormSchema>

interface PasswordFormProps {
  onSuccess?: () => void
}

export function PasswordForm({ onSuccess }: PasswordFormProps) {
  const { updatePassword } = useAuth()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      current_password: '',
      password: '',
    },
  })

  const handleSubmit = useCallback(
    (data: FormValues) => {
      startTransition(async () => {
        const { error } = await updatePassword(data)

        if (error) {
          toast({
            variant: 'destructive',
            description: error,
          })

          return
        }

        toast({
          description: 'Tu contraseña se ha cambiado correctamente.',
        })
        onSuccess?.()
      })
    },
    [updatePassword, toast, onSuccess],
  )

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña antigua *</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="********"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña *</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="********"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-2 w-full"
          aria-disabled={isPending}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Cambiar contraseña
        </Button>
      </form>
    </Form>
  )
}
