import { blank, cn, filled } from '@/lib/utils'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from './skeleton'
import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandInput,
  CommandEmpty,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CheckIcon, ChevronDownIcon, Loader2, X } from 'lucide-react'

type Option = {
  label: string
  value: string
}

type SearchableSelectProps = {
  id?: string
  name?: string
  options?: Option[]
  value?: Option | null
  placeholder?: string
  shouldFilter?: boolean
  isLoading?: boolean
  searchTerm?: string
  emptyIndicator?: React.ReactNode
  onSearchTermChange?: (value: string) => void
  onChange?: (option: Option | null) => void
}

export function SearchableSelect({
  id,
  name,
  options,
  value: currentOption,
  placeholder,
  shouldFilter,
  isLoading,
  searchTerm,
  emptyIndicator,
  onSearchTermChange,
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = useState<boolean>(false)

  const handleSelect = useCallback(
    (newValue: string) => {
      const currentValue = currentOption?.value

      if (newValue === currentValue) {
        onChange?.(null)
        setOpen(false)

        return
      }

      const newOption = options?.find((o) => o.value === newValue)

      onChange?.(newOption ?? null)
      setOpen(false)
    },
    [currentOption, options, onChange],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="border-input bg-background hover:bg-background w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
        >
          <span
            className={cn(
              'truncate',
              blank(currentOption) && 'text-muted-foreground',
            )}
          >
            {filled(currentOption)
              ? currentOption?.label
              : (placeholder ?? `Select ${name}`)}
          </span>
          <div className="flex shrink-0 gap-x-2">
            {filled(currentOption) && (
              <span
                onClick={(e) => {
                  e.preventDefault()

                  onSearchTermChange?.('')
                  onChange?.(null)
                }}
              >
                <X size={16} className="text-muted-foreground/80" />
              </span>
            )}
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80"
              aria-hidden="true"
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
        align="start"
      >
        <Command shouldFilter={shouldFilter}>
          <div className="relative w-full">
            <CommandInput
              placeholder={name ? `Search ${name}` : 'Search...'}
              value={searchTerm}
              onValueChange={onSearchTermChange}
            />
            {isLoading && (
              <div className="absolute top-1/2 right-3 flex -translate-y-1/2 transform items-center">
                <Loader2 className="text-muted-foreground/80 h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          <CommandList>
            {isLoading && options?.length === 0 && <DefaultLoadingSkeleton />}
            {!isLoading && options?.length === 0 && (
              <CommandEmpty>
                {emptyIndicator ?? 'No results found.'}
              </CommandEmpty>
            )}
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                  onSelect={handleSelect}
                >
                  {option.label}
                  {currentOption?.value === option.value && (
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

function DefaultLoadingSkeleton() {
  return (
    <CommandGroup>
      {[1, 2, 3].map((i) => (
        <CommandItem key={i} disabled>
          <div className="flex w-full items-center">
            <Skeleton className="h-4 w-full" />
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
