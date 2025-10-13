import states from '../../data/locations/states.json'
import { ucwords } from '@/lib/utils'
import { useMemo, useState } from 'react'
import { SearchableSelect } from '@/components/ui/searchable-select'

type AddressStateInputProps = {
  value?: string | null
  onChange?: (state: string | null) => void
}

export function AddressStateInput({
  value: currentState,
  onChange,
  ...props
}: AddressStateInputProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const options = useMemo(
    () =>
      states.map((state) => ({
        label: ucwords(state.name),
        value: ucwords(state.name),
      })),
    [],
  )

  return (
    <SearchableSelect
      {...props}
      options={options}
      value={currentState ? { label: currentState, value: currentState } : null}
      modal={true}
      shouldFilter={true}
      isLoading={false}
      searchTerm={searchTerm}
      emptyIndicator="No state found"
      onSearchTermChange={setSearchTerm}
      onChange={(newOption) => {
        onChange?.(newOption ? newOption.value : null)
      }}
    />
  )
}
