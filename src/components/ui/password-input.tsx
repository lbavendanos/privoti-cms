import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Input } from './input'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

function PasswordInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  return (
    <div className="relative">
      <Input
        {...props}
        className={cn('pe-9', className)}
        type={isVisible ? 'text' : 'password'}
      />
      <button
        type="button"
        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        onClick={toggleVisibility}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        aria-pressed={isVisible}
        aria-controls="password"
      >
        {isVisible ? (
          <EyeOffIcon size={16} aria-hidden="true" />
        ) : (
          <EyeIcon size={16} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}

export { PasswordInput }
