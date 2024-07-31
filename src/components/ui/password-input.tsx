'use client'

import * as React from 'react'
import { useCallback, useRef, useState } from 'react'
import useMergedRef from '@react-hook/merged-ref'

import type { InputProps } from './input'

import { Input } from './input'
import { Eye, EyeOff } from 'lucide-react'

export interface PasswordInputProps extends InputProps {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ type, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const mergedRefs = useMergedRef(ref, inputRef)
    const [show, setShow] = useState(false)

    const handleToggle = useCallback(() => {
      setShow((prev) => !prev)
      inputRef.current?.focus()
    }, [])

    return (
      <div className="relative">
        <Input type={show ? 'text' : 'password'} ref={mergedRefs} {...props} />
        {inputRef.current?.value && (
          <button
            type="button"
            className="absolute right-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform"
            onClick={handleToggle}
            tabIndex={-1}
          >
            {show ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
