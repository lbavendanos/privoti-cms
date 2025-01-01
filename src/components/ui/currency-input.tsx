'use client'

import { Input } from '@/components/ui/input'
import { withMask } from 'use-mask-input'

export function CurrencyInput(props: React.ComponentProps<'input'>) {
  return (
    <div className="relative">
      <Input
        {...props}
        ref={withMask('currency', {
          prefix: 'S/.',
          placeholder: '0.00',
          rightAlign: false,
        })}
        type="text"
        className="peer pe-12"
        placeholder="S/.0.00"
      />
      <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
        PEN
      </span>
    </div>
  )
}
