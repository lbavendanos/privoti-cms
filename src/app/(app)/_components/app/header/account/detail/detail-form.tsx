'use client'

import isMobilePhone from 'validator/es/lib/isMobilePhone'
import { z } from 'zod'
import { useCallback, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/core/auth'
import { useToast } from '@/components/ui/use-toast'
import { NAME_REGEX } from '@/lib/regex'
import { Button } from '@/components/ui/button'
import { DateInput } from '@/components/ui/date-input'
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
  first_name: z
    .string({
      required_error: 'El nombre es requerido.',
      invalid_type_error: 'El nombre debe ser una cadena.',
    })
    .trim()
    .min(1, { message: 'Debes introducir un nombre' })
    .regex(NAME_REGEX, {
      message: 'El nombre es incorrecto.',
    }),
  last_name: z
    .string({
      required_error: 'El apellido es requerido.',
      invalid_type_error: 'El apellido debe ser una cadena.',
    })
    .trim()
    .min(1, { message: 'Debes introducir un apellido' })
    .regex(NAME_REGEX, {
      message: 'El apellido es incorrecto.',
    }),
  phone: z
    .string({
      required_error: 'El celular es requerido.',
      invalid_type_error: 'El celular debe ser una cadena.',
    })
    .trim()
    .optional()
    .superRefine((value, ctx) => {
      if (
        value &&
        !isMobilePhone(value, process.env.NEXT_PUBLIC_APP_LOCALE as any)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El celular es incorrecto.',
        })
      }
    }),
  dob: z.coerce
    .date({
      required_error: 'La fecha de nacimiento es requerida.',
      invalid_type_error: 'La fecha de nacimiento debe ser una fecha.',
    })
    .min(new Date('1900-01-01'), {
      message: 'La fecha de nacimiento es incorrecta.',
    })
    .max(new Date(), { message: 'La fecha de nacimiento es incorrecta.' })
    .optional()
    .or(z.string().trim().optional())
    .superRefine((value, ctx) => {
      if (value instanceof Date) {
        // Check if your are of legal age
        const legalAge = new Date()
        legalAge.setFullYear(legalAge.getFullYear() - 18)

        if (value > legalAge) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'El consumidor está por debajo de la edad mínima de acceso. Tiene que tener por lo menos 18 años',
          })
        }
      }
    }),
})

type FormValues = z.infer<typeof FormSchema>

interface DetailFormProps {
  onSuccess?: () => void
}

export function DetailForm({ onSuccess }: DetailFormProps) {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
      dob: user?.dob || '',
    },
  })

  const handleSubmit = useCallback(
    (data: FormValues) => {
      startTransition(async () => {
        const { error } = await updateUser({
          ...data,
          dob:
            data.dob instanceof Date
              ? data.dob.toISOString().slice(0, 10)
              : data.dob,
        })

        if (error) {
          toast({
            variant: 'destructive',
            description: error,
          })

          return
        }

        toast({ description: 'Su perfil ha sido actualizado correctamente.' })
        onSuccess?.()
      })
    },
    [updateUser, toast, onSuccess],
  )

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre *</FormLabel>
              <FormControl>
                <Input type="text" autoComplete="given-name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido *</FormLabel>
              <FormControl>
                <Input type="text" autoComplete="family-name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <Input type="tel" autoComplete="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field: { value, ...field } }) => (
            <FormItem>
              <FormLabel>Fecha de nacimiento</FormLabel>
              <FormControl>
                <DateInput
                  autoComplete="bday"
                  value={value as string}
                  {...field}
                />
              </FormControl>
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
