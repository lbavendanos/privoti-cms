'use client'

import { useCallback, useState } from 'react'
import React from 'react'
import { Input } from './input'
import { Eye, EyeOff } from 'lucide-react'

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ type, ...props }, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const handleToggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev)
  }, [])

  return (
    <div className="relative">
      <Input ref={ref} type={isVisible ? 'text' : 'password'} {...props} />
      <button
        type="button"
        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleToggleVisibility}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        aria-pressed={isVisible}
        aria-controls="password"
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  )
})

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
