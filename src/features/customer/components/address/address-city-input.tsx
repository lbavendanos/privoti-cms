import cities from '../../data/locations/cities.json'
import { ucwords } from '@/lib/utils'
import { useMemo, useState } from 'react'
import { SearchableSelect } from '@/components/ui/searchable-select'

type Cities = typeof cities

type AddressCityInputProps = {
  state?: string
  value?: string | null
  onChange?: (city: string | null) => void
}

export function AddressCityInput({
  state,
  value: currentCity,
  onChange,
  ...props
}: AddressCityInputProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const options = useMemo(
    () =>
      state
        ? cities[state.toLowerCase() as keyof Cities].map((city) => ({
            label: ucwords(city.name),
            value: ucwords(city.name),
          }))
        : [],
    [state],
  )

  return (
    <SearchableSelect
      {...props}
      options={options}
      value={currentCity ? { label: currentCity, value: currentCity } : null}
      modal={true}
      shouldFilter={true}
      isLoading={false}
      searchTerm={searchTerm}
      emptyIndicator="No city found"
      onSearchTermChange={setSearchTerm}
      onChange={(newOption) => {
        onChange?.(newOption ? newOption.value : null)
      }}
    />
  )
}
