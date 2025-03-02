import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

type Option = {
  label: string
  value: string
}

type SearchSelectProps = {
  id?: string
  placeholder?: string
  empty?: string
  options?: Option[]
  value?: string
  commandInputProps?: { placeholder?: string }
  emptyIndicator?: React.ReactNode
  onChange?: React.Dispatch<React.SetStateAction<string>>
}

export function SearchSelect({
  id,
  placeholder,
  value,
  options = [],
  emptyIndicator,
  commandInputProps,
  onChange,
}: SearchSelectProps) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]"
        >
          <span className={cn('truncate', !value && 'text-muted-foreground')}>
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
          </span>
          <ChevronDownIcon
            size={16}
            className="shrink-0 text-muted-foreground/80"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
        align="start"
      >
        <Command>
          <CommandInput {...commandInputProps} />
          <CommandList>
            <CommandEmpty>{emptyIndicator}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange?.(option.value)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  {value === option.value && (
                    <CheckIcon size={16} className="ml-auto" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
