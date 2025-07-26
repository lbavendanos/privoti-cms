import { useVendors } from '@/core/hooks/vendor'
import { useDebounce } from '@/hooks/use-debounce'
import { keepPreviousData } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { SearchableSelect } from '@/components/ui/searchable-select'

type Vendor = {
  id: string
  name: string
}

type ProductVendorInputProps = {
  value?: Vendor | null
  onChange?: (value: Vendor | null) => void
}

export function ProductVendorInput({
  value: currentVendor,
  onChange,
  ...props
}: ProductVendorInputProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const { data, isFetching } = useVendors(
    debouncedSearchTerm ? { q: debouncedSearchTerm } : {},
    { placeholderData: keepPreviousData },
  )

  const vendors = useMemo(() => data?.data, [data])
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
