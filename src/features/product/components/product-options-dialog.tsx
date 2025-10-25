import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { type Option } from './product-options-input'
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MultipleTag } from '@/components/ui/multiple-tag'

const formSchema = z.object({
  uuid: z.string().min(1, {
    message: 'Please provide a valid UUID.',
  }),
  id: z
    .string()
    .min(1, {
      message: 'Please provide a valid ID.',
    })
    .optional(),
  name: z.string().min(1, {
    message: 'Please provide a valid title.',
  }),
  values: z.array(z.string()),
})

type ProductOptionsDialogProps = {
  value: Option
  open: boolean
  onChange: (value: Option) => void
  onOpenChange: (open: boolean) => void
}

export function ProductOptionsDialog({
  value: currentOption,
  open,
  onChange,
  onOpenChange,
}: ProductOptionsDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uuid: currentOption.uuid,
      id: currentOption.id,
      name: currentOption.name,
      values: currentOption.values,
    },
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      onChange(values)
      onOpenChange(false)
    },
    [onChange, onOpenChange],
  )

  useEffect(() => {
    if (open) {
      form.reset({
        uuid: currentOption.uuid,
        id: currentOption.id,
        name: currentOption.name,
        values: currentOption.values,
      })
    }
  }, [currentOption, open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Option</DialogTitle>
          <DialogDescription>
            Create a new option for your product.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.stopPropagation()
              e.preventDefault()

              form.handleSubmit(handleSubmit)(e)
            }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="values"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variations (comma-separated)</FormLabel>
                  <FormControl>
                    <MultipleTag placeholder="Red, Blue, Green" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-y-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
