'use client'

import { cn } from '@/lib/utils'
import { useCallback, useState } from 'react'
import { type InputProps } from './input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

type MultipleTagProps = Omit<InputProps, 'value' | 'onChange'> & {
  value: string[]
  onChange: React.Dispatch<React.SetStateAction<string[]>>
}

export function MultipleTag({
  value: currentTags,
  className,
  placeholder,
  onChange,
  onBlur,
  ...props
}: MultipleTagProps) {
  const [pendingDataPoint, setPendingDataPoint] = useState('')

  const addPendingDataPoint = useCallback(() => {
    if (pendingDataPoint) {
      const newDataPoints = new Set([...currentTags, pendingDataPoint])

      onChange(Array.from(newDataPoints))
      setPendingDataPoint('')
    }
  }, [pendingDataPoint, currentTags, onChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        addPendingDataPoint()
      } else if (
        e.key === 'Backspace' &&
        pendingDataPoint.length === 0 &&
        currentTags.length > 0
      ) {
        e.preventDefault()
        onChange(currentTags.slice(0, -1))
      }
    },
    [pendingDataPoint, currentTags, onChange, addPendingDataPoint],
  )

  return (
    <div
      className={cn(
        'flex min-h-10 w-full flex-wrap gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-neutral-950 has-[:focus-visible]:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:has-[:focus-visible]:ring-neutral-300',
        className,
      )}
    >
      {currentTags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
          <button
            type="button"
            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={() => {
              onChange(currentTags.filter((t) => t !== tag))
            }}
          >
            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
          </button>
        </Badge>
      ))}
      <input
        className="flex-1 text-base outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 md:text-sm"
        value={pendingDataPoint}
        placeholder={currentTags.length === 0 ? placeholder : ''}
        onChange={(e) => setPendingDataPoint(e.target.value)}
        onBlur={(e) => {
          addPendingDataPoint()
          onBlur?.(e)
        }}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  )
}
