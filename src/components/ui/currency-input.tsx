'use client'

import { Input } from '@/components/ui/input'
import { withMask } from 'use-mask-input'

export function CurrencyInput(props: React.ComponentProps<'input'>) {
  return (
    <Input
      {...props}
      ref={withMask('currency', {
        prefix: 'S/.',
        placeholder: '0.00',
        rightAlign: false,
        allowMinus: false,
      })}
      type="text"
      placeholder="S/.0.00"
    />
  )
}
