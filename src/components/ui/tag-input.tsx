import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { type InputProps } from './input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

type TagInputProps = Omit<InputProps, 'value' | 'onChange'> & {
  value: string[]
  onChange: React.Dispatch<React.SetStateAction<string[]>>
}

export function TagInput({
  value,
  className,
  onChange,
  ...props
}: TagInputProps) {
  const [pendingDataPoint, setPendingDataPoint] = useState('')

  const addPendingDataPoint = () => {
    if (pendingDataPoint) {
      const newDataPoints = new Set([...value, pendingDataPoint])
      onChange(Array.from(newDataPoints))
      setPendingDataPoint('')
    }
  }

  useEffect(() => {
    if (pendingDataPoint.includes(',')) {
      const newDataPoints = new Set([
        ...value,
        ...pendingDataPoint.split(',').map((chunk) => chunk.trim()),
      ])
      onChange(Array.from(newDataPoints))
      setPendingDataPoint('')
    }
  }, [pendingDataPoint, onChange, value])

  return (
    <div
      className={cn(
        'flex min-h-10 w-full flex-wrap gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-neutral-950 has-[:focus-visible]:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:has-[:focus-visible]:ring-neutral-300',
        className,
      )}
    >
      {value.map((item) => (
        <Badge key={item} variant="secondary">
          {item}
          <button
            type="button"
            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={() => {
              onChange(value.filter((i) => i !== item))
            }}
          >
            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
          </button>
        </Badge>
      ))}
      <input
        className="flex-1 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
        value={pendingDataPoint}
        onChange={(e) => setPendingDataPoint(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addPendingDataPoint()
          } else if (
            e.key === 'Backspace' &&
            pendingDataPoint.length === 0 &&
            value.length > 0
          ) {
            e.preventDefault()
            onChange(value.slice(0, -1))
          }
        }}
        {...props}
      />
    </div>
  )
}
