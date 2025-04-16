import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from './alert'
import {
  InfoIcon,
  TriangleAlert,
  CircleCheckIcon,
  AlertCircleIcon,
} from 'lucide-react'

type CustomAlertProps = {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  description?: string
  list?: string[]
  className?: string
}

export function StatusAlert({
  variant,
  title,
  description,
  list,
  className,
}: CustomAlertProps) {
  return (
    <Alert
      className={cn(
        variant === 'info' &&
          'bg-card border-blue-500 text-blue-500 *:data-[slot=alert-description]:text-blue-500/90 [&>svg]:text-current',
        variant === 'success' &&
          'bg-card border-emerald-500 text-emerald-500 *:data-[slot=alert-description]:text-emerald-500/90 [&>svg]:text-current',
        variant === 'warning' &&
          'bg-card border-amber-500 text-amber-500 *:data-[slot=alert-description]:text-amber-500/90 [&>svg]:text-current',
        variant === 'error' &&
          'text-destructive border-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current',
        className,
      )}
    >
      {variant === 'info' && <InfoIcon />}
      {variant === 'success' && <CircleCheckIcon />}
      {variant === 'warning' && <TriangleAlert />}
      {variant === 'error' && <AlertCircleIcon />}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>
        {description && <p>{description}</p>}
        {list && (
          <ul className="list-inside list-disc text-sm">
            {list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  )
}
