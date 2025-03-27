'use client'

import { useDebounce } from '@/hooks/use-debounce'
import { getVendors } from '@/core/actions/vendor'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { SearchableSelect } from '@/components/ui/searchable-select'

type Vendor = {
  id: string
  name: string
}

type ProductsVendorInputProps = {
  value?: Vendor | null
  onChange?: (value: Vendor | null) => void
}

export function ProductsVendorInput({
  value: currentVendor,
  onChange,
  ...props
}: ProductsVendorInputProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const { data: vendors, isFetching } = useQuery({
    queryKey: debouncedSearchTerm
      ? ['product-vendor-list', { q: debouncedSearchTerm }]
      : ['product-vendor-list'],
    queryFn: () => getVendors({ q: debouncedSearchTerm }),
    placeholderData: keepPreviousData,
  })

  const options = useMemo(
    () =>
      vendors?.map((vendor) => ({
        label: vendor.name,
        value: `${vendor.id}`,
      })),
    [vendors],
  )

  return (
    <SearchableSelect
      {...props}
      options={options}
      value={
        currentVendor
          ? { label: currentVendor.name, value: currentVendor.id }
          : null
      }
      shouldFilter={false}
      isLoading={isFetching}
      searchTerm={searchTerm}
      emptyIndicator="No vendors found"
      onSearchTermChange={setSearchTerm}
      onChange={(newOption) => {
        if (newOption) {
          onChange?.({ id: newOption.value, name: newOption.label })
        } else {
          onChange?.(null)
        }
      }}
    />
  )
}
