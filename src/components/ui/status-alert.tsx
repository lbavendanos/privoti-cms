import { cn } from '@/lib/utils'
import {
  InfoIcon,
  TriangleAlert,
  CircleCheckIcon,
  CircleAlertIcon,
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
  const getIcon = () => {
    const iconProps = {
      className: 'mt-0.5 shrink-0',
      size: 16,
      'aria-hidden': true,
    }

    switch (variant) {
      case 'info':
        return (
          <InfoIcon
            {...iconProps}
            className={`${iconProps.className} text-blue-500`}
          />
        )
      case 'success':
        return (
          <CircleCheckIcon
            {...iconProps}
            className={`${iconProps.className} text-emerald-500`}
          />
        )
      case 'warning':
        return (
          <TriangleAlert
            {...iconProps}
            className={`${iconProps.className} text-amber-500`}
          />
        )
      case 'error':
        return (
          <CircleAlertIcon
            {...iconProps}
            className={`${iconProps.className} text-red-500`}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        'flex gap-3 rounded-md border px-4 py-3',
        variant === 'info' && 'border-blue-500/50 text-blue-600',
        variant === 'success' && 'border-emerald-500/50 text-emerald-600',
        variant === 'warning' && 'border-amber-500/50 text-amber-600',
        variant === 'error' && 'border-red-500/50 text-red-600',
        className,
      )}
    >
      {getIcon()}
      <div className="grow space-y-1">
        {title && (
          <h5 className="font-medium leading-none tracking-tight">{title}</h5>
        )}
        {description && (
          <p className="text-sm leading-relaxed">{description}</p>
        )}
        {list && (
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
