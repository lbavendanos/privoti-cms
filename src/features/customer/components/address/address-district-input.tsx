import districts from '../../data/locations/districts.json'
import { ucwords } from '@/lib/utils'
import { useMemo, useState } from 'react'
import { SearchableSelect } from '@/components/ui/searchable-select'

type Districts = typeof districts

type AddressDistrictInputProps = {
  city?: string
  value?: string | null
  onChange?: (districit: string | null) => void
}

export function AddressDistrictInput({
  city,
  value: currentDistrict,
  onChange,
  ...props
}: AddressDistrictInputProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const options = useMemo(
    () =>
      city
        ? districts[city.toLowerCase() as keyof Districts].map((district) => ({
            label: ucwords(district.name),
            value: ucwords(district.name),
          }))
        : [],
    [city],
  )

  return (
    <SearchableSelect
      {...props}
      options={options}
      value={
        currentDistrict
          ? { label: currentDistrict, value: currentDistrict }
          : null
      }
      modal={true}
      shouldFilter={true}
      isLoading={false}
      searchTerm={searchTerm}
      emptyIndicator="No district found"
      onSearchTermChange={setSearchTerm}
      onChange={(newOption) => {
        onChange?.(newOption ? newOption.value : null)
      }}
    />
  )
}
