'use client'

import { useDebounce } from '@/hooks/use-debounce'
import { blank, cn, filled } from '@/lib/utils'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from './skeleton'
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
import { CheckIcon, ChevronDownIcon, Loader2, X } from 'lucide-react'

type Option = {
  label: string
  value: string
}

type SearchSelectProps = {
  id?: string
  name?: string
  value?: Option | null
  placeholder?: string
  options?: Option[]
  emptyIndicator?: React.ReactNode
  delay?: number
  onSearch?: (value: string) => Promise<Option[]>
  onChange?: React.Dispatch<React.SetStateAction<Option | null>>
}

export function SearchableSelect({
  id,
  name,
  value: currentOption,
  placeholder,
  options: defaultOptions,
  emptyIndicator,
  delay = 500,
  onSearch,
  onChange,
}: SearchSelectProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [options, setOptions] = useState<Option[]>(defaultOptions ?? [])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const debouncedSearchTerm = useDebounce(searchTerm, delay)

  const handleSelect = useCallback(
    (newValue: string) => {
      const currentValue = currentOption?.value

      if (newValue === currentValue) {
        onChange?.(null)
        setOpen(false)

        return
      }

      const newOption = options.find((o) => o.value === newValue)

      onChange?.(newOption ?? null)
      setOpen(false)
    },
    [currentOption, options, onChange],
  )

  useEffect(() => {
    if (!onSearch) return

    const doSearch = async () => {
      setIsLoading(true)

      const newOptions = await onSearch?.(debouncedSearchTerm)

      setOptions(newOptions ?? [])
      setIsLoading(false)
    }

    void doSearch()
  }, [debouncedSearchTerm, onSearch])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="relative w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]"
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

                  setSearchTerm('')
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
        className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
        align="start"
      >
        <Command shouldFilter={!onSearch}>
          <div className="relative w-full">
            <CommandInput
              placeholder={name ? `Search ${name}` : 'Search...'}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 transform items-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/80" />
              </div>
            )}
          </div>
          <CommandList>
            {isLoading && options.length === 0 && <DefaultLoadingSkeleton />}
            {!isLoading && options.length === 0 && (
              <CommandEmpty>
                {emptyIndicator ?? 'No results found.'}
              </CommandEmpty>
            )}
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
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
