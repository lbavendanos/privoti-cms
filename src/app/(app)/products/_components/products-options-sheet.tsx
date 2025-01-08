import { useEffect, useState } from 'react'
import { type OptionItem } from './products-options-input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { TagInput } from '@/components/ui/tag-input'

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
  const [id, setId] = useState(option.id)
  const [title, setTitle] = useState(option.name)
  const [variants, setVariants] = useState(option.values)

  const handleSave = () => {
    onChange({ id, name: title, values: variants })
    onOpenChange(false)
  }

  useEffect(() => {
    setId(option.id)
    setTitle(option.name)
    setVariants(option.values)
  }, [option])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create Option</SheetTitle>
          <SheetDescription>
            Create a new option for your product.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="optionTitle">Option title</Label>
            <Input
              id="optionTitle"
              name="optionTitle"
              type="text"
              placeholder="Size, Color, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="optionVariants">Variations (comma-separated)</Label>
            <TagInput
              id="optionVariants"
              name="optionVariants"
              placeholder="Add variant"
              value={variants}
              onChange={setVariants}
            />
          </div>
        </div>
        <SheetFooter>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
