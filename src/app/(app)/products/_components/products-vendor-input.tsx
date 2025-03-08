'use client'

import { useCallback } from 'react'
import { getVendors } from '@/core/actions/vendor'
import { SearchableSelect } from '@/components/ui/searchable-select'

type Vendor = {
  id: string
  name: string
}

type ProductsVendorInputProps = {
  value?: Vendor | null
  onChange?: (type: Vendor | null) => void
}

export function ProductsVendorInput({
  value: currentVendor,
  onChange,
  ...props
}: ProductsVendorInputProps) {
  const handleSearch = useCallback(async (value: string) => {
    const vendors = await getVendors({ search: value, fields: 'id,name' })

    return vendors.map((vendor) => ({
      label: vendor.name,
      value: vendor.id.toString(),
    }))
  }, [])

  return (
    <SearchableSelect
      {...props}
      emptyIndicator="No vendors found"
      value={
        currentVendor
          ? { label: currentVendor.name, value: currentVendor.id }
          : null
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
