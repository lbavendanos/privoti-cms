'use client'

import { useCallback } from 'react'
import { getProductTypes } from '@/core/actions/product-type'
import { SearchableSelect } from '@/components/ui/searchable-select'

type Type = {
  id: string
  name: string
}

type ProductsTypeInputProps = {
  value?: Type | null
  onChange?: (type: Type | null) => void
}

export function ProductsTypeInput({
  value: currentType,
  onChange,
  ...props
}: ProductsTypeInputProps) {
  const handleSearch = useCallback(async (value: string) => {
    const types = await getProductTypes({ search: value, fields: 'id,name' })

    return types.map((type) => ({
      label: type.name,
      value: type.id.toString(),
    }))
  }, [])

  return (
    <SearchableSelect
      {...props}
      emptyIndicator="No types found"
      value={
        currentType ? { label: currentType.name, value: currentType.id } : null
      }
      onChange={(newOption) => {
        if (newOption) {
          onChange?.({ id: newOption.value, name: newOption.label })
        } else {
          onChange?.(null)
        }
      }}
      onSearch={handleSearch}
    />
  )
}
