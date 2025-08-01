import { useDebounce } from '@/hooks/use-debounce'
import { useProductTypes } from '@/core/hooks/product-type'
import { keepPreviousData } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { SearchableSelect } from '@/components/ui/searchable-select'

type Type = {
  id: string
  name: string
}

type ProductTypeInputProps = {
  value?: Type | null
  onChange?: (value: Type | null) => void
}

export function ProductTypeInput({
  value: currentType,
  onChange,
  ...props
}: ProductTypeInputProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const { data, isFetching } = useProductTypes(
    debouncedSearchTerm ? { q: debouncedSearchTerm } : {},
    { placeholderData: keepPreviousData },
  )

  const types = useMemo(() => data?.data, [data])
  const options = useMemo(
    () =>
      types?.map((type) => ({
        label: type.name,
        value: `${type.id}`,
      })),
    [types],
  )

  return (
    <SearchableSelect
      {...props}
      options={options}
      value={
        currentType ? { label: currentType.name, value: currentType.id } : null
      }
      shouldFilter={false}
      isLoading={isFetching}
      searchTerm={searchTerm}
      emptyIndicator="No types found"
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
