import { withMask } from 'use-mask-input'
import { Input } from './input'

const MASKS = {
  PE: '999 999 999',
  US: '(999) 999-9999',
}

export type CountryCode = keyof typeof MASKS

type PhneInputProps = React.ComponentProps<'input'> & {
  countryCode: CountryCode
}

export function PhoneInput({ countryCode, ...props }: PhneInputProps) {
  return (
    <Input
      {...props}
      ref={withMask('', {
        alias: 'phone',
        mask: MASKS[countryCode],
        placeholder: '',
        showMaskOnHover: false,
        autoUnmask: true,
      })}
    />
  )
}
