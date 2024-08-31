'use client'

import { z } from 'zod'
import { useCallback, useTransition } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
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
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Loader2 } from 'lucide-react'

const FormSchema = z
  .object({
    email: z
      .string({
        required_error: 'El email es requerido.',
        invalid_type_error: 'El email debe ser una cadena.',
      })
      .trim()
      .toLowerCase()
      .min(1, { message: 'Debes introducir un email' })
      .email({ message: 'Email inválido.' }),
    password: z
      .string({
        required_error: 'La contraseña es requerida.',
        invalid_type_error: 'La contraseña debe ser una cadena.',
      })
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
    password_confirmation: z
      .string({
        required_error: 'La contraseña es requerida.',
        invalid_type_error: 'La contraseña debe ser una cadena.',
      })
      .optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden.',
    path: ['password_confirmation'],
  })

type FormValues = z.infer<typeof FormSchema>

export interface ResetFormProps
  extends React.ComponentPropsWithoutRef<'form'> {}

export function ResetForm(props: ResetFormProps) {
  const { resetPassword } = useAuth()
  const { toast } = useToast()

  const router = useRouter()
  const params = useParams<{ token: string }>()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: searchParams?.get('email') || '',
      password: '',
      password_confirmation: '',
    },
  })

  const handleSubmit = useCallback(
    (data: FormValues) => {
      startTransition(async () => {
        const { error } = await resetPassword({
          ...data,
          token: params.token,
        })

        if (error) {
          toast({
            variant: 'destructive',
            description: error,
          })

          return
        }

        toast({
          description: 'Tu contraseña se ha restablecido correctamente.',
        })

        form.reset()
        router.push('/')
      })
    },
    [form, router, params, resetPassword, toast],
  )

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
        {...props}
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña *</FormLabel>
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
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña *</FormLabel>
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
          Restablecer contraseña
        </Button>
      </form>
    </Form>
  )
}
