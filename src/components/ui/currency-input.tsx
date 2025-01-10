'use client'

import { Input } from '@/components/ui/input'
import { withMask } from 'use-mask-input'

export function CurrencyInput({
  onChange,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <Input
      {...props}
      ref={withMask('', {
        alias: 'numeric',
        prefix: 'S/ ',
        groupSeparator: ',',
        radixPoint: '.',
        digits: 2,
        digitsOptional: false,
        placeholder: '0.00',
        clearMaskOnLostFocus: false,
        allowMinus: false,
        autoUnmask: true,
        rightAlign: false,
      })}
      type="text"
      placeholder="S/.0.00"
      onChange={(event) => {
        const caret = event.target.selectionStart
        const element = event.target

        window.requestAnimationFrame(() => {
          element.selectionStart = caret
          element.selectionEnd = caret
        })

        onChange?.(event)
      }}
    />
  )
}
