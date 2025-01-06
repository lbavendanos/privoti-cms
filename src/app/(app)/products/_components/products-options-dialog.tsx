import { useEffect, useState } from 'react'
import { type OptionItem } from './products-options-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { TagInput } from '@/components/ui/tag-input'

type ProductsOptionsDialogProps = {
  value: OptionItem
  onChange: React.Dispatch<React.SetStateAction<OptionItem>>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductsOptionsDialog({
  value: option,
  onChange,
  open,
  onOpenChange,
}: ProductsOptionsDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Option</DialogTitle>
          <DialogDescription>
            Create a new option for your product.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
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
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
