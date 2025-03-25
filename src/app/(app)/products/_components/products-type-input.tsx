'use client'

import { useDebounce } from '@/hooks/use-debounce'
import { getProductTypes } from '@/core/actions/product-type'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { SearchSelect } from '@/components/ui/search-select'

type Type = {
  id: string
  name: string
}

type ProductsTypeInputProps = {
  value?: Type | null
  onChange?: (value: Type | null) => void
}

export function ProductsTypeInput({
  value: currentType,
  onChange,
  ...props
}: ProductsTypeInputProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const { data: types, isFetching } = useQuery({
    queryKey: debouncedSearchTerm
      ? ['product-type-list', { search: debouncedSearchTerm }]
      : ['product-type-list'],
    queryFn: () => getProductTypes({ search: debouncedSearchTerm }),
    placeholderData: keepPreviousData,
  })

  const options = useMemo(
    () =>
      types?.map((type) => ({
        label: type.name,
        value: `${type.id}`,
      })),
    [types],
  )

  return (
    <SearchSelect
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
