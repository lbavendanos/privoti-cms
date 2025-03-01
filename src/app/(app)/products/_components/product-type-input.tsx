'use client'

import { use } from 'react'
import { type ProductType } from '@/core/types'
import { SearchSelect } from '@/components/ui/search-select'

type ProductTypeInputProps = {
  typesPromise: Promise<ProductType[]>
  id?: string
  value?: string
  onChange: React.Dispatch<React.SetStateAction<string>>
}

export function ProductTypeInput({
  typesPromise,
  id,
  value,
  onChange,
}: ProductTypeInputProps) {
  const types = use(typesPromise)

  return (
    <SearchSelect
      options={types.map((type) => ({
        label: type.name,
        value: type.id.toString(),
      }))}
      id={id}
      value={value}
      placeholder="Select type"
      search={{ placeholder: 'Search type', empty: 'No type found' }}
      onChange={onChange}
    />
  )
}
