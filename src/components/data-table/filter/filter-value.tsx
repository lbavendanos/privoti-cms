import { debounce, formatDate, today } from '@/lib/utils'
import { useCallback, useMemo, useState } from 'react'
import type { Column } from '@tanstack/react-table'
import type { DateRange } from 'react-day-picker'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { CircleXIcon, Ellipsis, SearchIcon } from 'lucide-react'

function useFilterValue<TData, TValue>(
  column: Column<TData>,
): [TValue | undefined, (value: TValue) => void] {
  const filterValue = useMemo(
    () => column.getFilterValue() as TValue | undefined,
    [column],
  )
  const setFilterValue = useMemo(() => column.setFilterValue, [column])

  return [filterValue, setFilterValue]
}

type FilterValueProps<TData> = {
  column: Column<TData>
}

export function FilterValue<TData>({ column }: FilterValueProps<TData>) {
  return (
    <Popover>
      <PopoverAnchor className="h-full" />
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="m-0 block h-full max-w-full shrink truncate rounded-none p-0 px-2 text-xs"
        >
          <FilterValueDisplay column={column} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-fit origin-(--radix-popover-content-transform-origin) p-0"
      >
        <FilterValueController column={column} />
      </PopoverContent>
    </Popover>
  )
}

type FilterValueDisplayProps<TData> = {
  column: Column<TData>
}

export function FilterValueDisplay<TData>({
  column,
}: FilterValueDisplayProps<TData>) {
  const filterValue = column.getFilterValue()
  const variant = column.columnDef.meta?.variant

  switch (variant) {
    case 'text':
      return <span>{filterValue as string}</span>
    case 'number':
      return null
    case 'boolean':
      return null
    case 'select':
      return <span>{(filterValue as string[]).join(', ')}</span>
    case 'date': {
      if ((filterValue as string[]).length === 0)
        return <Ellipsis className="size-4" />

      const [start, end] = filterValue as string[]

      return (
        <span>
          {start ? formatDate(start) : ''}
          {end ? ` - ${formatDate(end)}` : ''}
        </span>
      )
    }
    default:
      return null
  }
}

export function FilterValueController<TData>({
  column,
}: FilterValueProps<TData>) {
  const variant = column.columnDef.meta?.variant

  switch (variant) {
    case 'text':
      return <FilterValueText column={column} />
    case 'number':
      return null
    case 'boolean':
      return null
    case 'select':
      return <FilterValueSelect column={column} />
    case 'date':
      return <FilterValueDate column={column} />
    default:
      return null
  }
}

function FilterValueText<TData>({ column }: FilterValueProps<TData>) {
  const [filterValue, setFilterValue] = useFilterValue<TData, string>(column)
  const [value, setValue] = useState<string>(filterValue ?? '')

  const debouncedOnChange = useMemo(
    () =>
      debounce((newValue: string) => {
        setFilterValue(newValue)
      }, 500),
    [setFilterValue],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      setValue(newValue)
      debouncedOnChange(newValue)
    },
    [debouncedOnChange],
  )

  const handleClear = useCallback(() => {
    setValue('')
    setFilterValue('')
  }, [setFilterValue])

  return (
    <Command>
      <CommandList className="max-h-fit">
        <CommandGroup>
          <CommandItem>
            <div className="relative">
              <Input
                className="peer ps-9 pe-9"
                placeholder={`Search ${(column.columnDef.meta?.label ?? column.id).toLowerCase()}...`}
                value={value}
                onChange={handleChange}
                autoFocus
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <SearchIcon size={16} />
              </div>
              {value && (
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Clear input"
                  onClick={handleClear}
                >
                  <CircleXIcon size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

function FilterValueSelect<TData>({ column }: FilterValueProps<TData>) {
  const [filterValue, setFilterValue] = useFilterValue<TData, string[]>(column)
  const [value, setValue] = useState<string[]>(filterValue ?? [])

  const handleSelect = useCallback(
    (selected: string) => {
      setValue((prevValue) => {
        const isSelected = prevValue.includes(selected)
        const newValue = isSelected
          ? prevValue.filter((v) => v !== selected)
          : [...prevValue, selected]

        setFilterValue(newValue)

        return newValue
      })
    },
    [setFilterValue],
  )

  return (
    <Command loop>
      <CommandInput
        placeholder={`Search ${(column.columnDef.meta?.label ?? column.id).toLowerCase()}...`}
        autoFocus
      />
      <CommandEmpty>No fields found.</CommandEmpty>
      <CommandList>
        <CommandGroup>
          {column.columnDef.meta?.options?.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={handleSelect}
              className="group flex items-center justify-between gap-1.5"
            >
              <div className="flex items-center gap-1.5">
                <Checkbox
                  checked={value.includes(option.value)}
                  className="dark:border-ring mr-1 opacity-0 group-data-[selected=true]:opacity-100 data-[state=checked]:opacity-100"
                />
                {option.icon && (
                  <option.icon strokeWidth={2.25} className="size-4" />
                )}
                <span>{option.label}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

function FilterValueDate<TData>({ column }: FilterValueProps<TData>) {
  const [filterValue, setFilterValue] = useFilterValue<TData, string[]>(column)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: filterValue?.[0] ? new Date(filterValue[0]) : undefined,
    to: filterValue?.[1] ? new Date(filterValue[1]) : undefined,
  })

  const referenceToday = useMemo(() => today(), [])
  const presets = useMemo(
    () => [
      {
        label: 'Today',
        value: { from: referenceToday },
      },
      {
        label: 'Last 7 days',
        value: {
          from: new Date(referenceToday.getTime() - 7 * 24 * 60 * 60 * 1000),
          to: referenceToday,
        },
      },
      {
        label: 'Last 30 days',
        value: {
          from: new Date(referenceToday.getTime() - 30 * 24 * 60 * 60 * 1000),
          to: referenceToday,
        },
      },
      {
        label: 'Last 90 days',
        value: {
          from: new Date(referenceToday.getTime() - 90 * 24 * 60 * 60 * 1000),
          to: referenceToday,
        },
      },
      {
        label: 'Last 12 months',
        value: {
          from: new Date(referenceToday.getTime() - 365 * 24 * 60 * 60 * 1000),
          to: referenceToday,
        },
      },
    ],
    [referenceToday],
  )

  const setRange = useCallback(
    (from?: Date, to?: Date) => {
      setDateRange({ from, to })
      setFilterValue(
        from && to
          ? [from.toISOString(), to.toISOString()]
          : from
            ? [from.toISOString()]
            : [],
      )
    },
    [setFilterValue],
  )

  const handleCalendarSelect = useCallback(
    (newDateRange: DateRange) => {
      const from = newDateRange.from
      const to =
        newDateRange.to && from?.getTime() !== newDateRange.to.getTime()
          ? newDateRange.to
          : undefined

      setRange(from, to)
    },
    [setRange],
  )

  const handlePresetSelect = useCallback(
    (presetValue: { from?: Date; to?: Date }) => {
      setRange(presetValue.from, presetValue.to)
    },
    [setRange],
  )

  return (
    <Command>
      <CommandList className="max-h-fit max-w-[300px] p-4">
        <CommandGroup className="pb-4">
          <Calendar
            className="bg-transparent p-0 [--cell-size:--spacing(9.3)]"
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleCalendarSelect}
            required
            autoFocus
          />
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup>
          <div className="flex flex-wrap gap-2 pt-4">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handlePresetSelect(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
