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

export interface ForgotFormProps
  extends React.ComponentPropsWithoutRef<'form'> {}

export function ForgotForm(props: ForgotFormProps) {
  const { sendResetEmail } = useAuth()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleSubmit = useCallback(
    (data: FormValues) => {
      startTransition(async () => {
        const { error } = await sendResetEmail(data)

        if (error) {
          toast({
            variant: 'destructive',
            description: error,
          })

          return
        }

        toast({
          title:
            'Se envió un correo electrónico de restablecimiento de contraseña.',
          description:
            'Verifique su correo electrónico para continuar con el proceso de restablecimiento de contraseña.',
        })

        form.reset()
      })
    },
    [form, sendResetEmail, toast],
  )

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
        {...props}
      >
        <div className="w-full space-y-2">
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
        </div>
        <Button
          type="submit"
          className="mt-2 w-full"
          aria-disabled={isPending}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar correo electrónico
        </Button>
      </form>
    </Form>
  )
}
