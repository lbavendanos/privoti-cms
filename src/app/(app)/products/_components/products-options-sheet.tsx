import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type OptionItem } from './products-options-input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MultipleTag } from '@/components/ui/multiple-tag'

const formSchema = z.object({
  id: z.string().min(1, {
    message: 'Please provide a valid ID.',
  }),
  name: z.string().nonempty({
    message: 'Please provide a valid title.',
  }),
  values: z.array(z.string()).nonempty({
    message: 'Please provide at least one variant.',
  }),
})

type ProductsOptionsSheetProps = {
  value: OptionItem
  onChange: React.Dispatch<React.SetStateAction<OptionItem>>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductsOptionsSheet({
  value: option,
  open,
  onChange,
  onOpenChange,
}: ProductsOptionsSheetProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: option.id,
      name: option.name,
      values: option.values,
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onChange(values)
    onOpenChange(false)
  }

  useEffect(() => {
    form.reset({
      id: option.id,
      name: option.name,
      values: option.values,
    })
  }, [option, form])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create Option</SheetTitle>
          <SheetDescription>
            Create a new option for your product.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4 py-4">
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
            </div>
            <SheetFooter className="gap-y-2">
              <SheetClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Save</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
