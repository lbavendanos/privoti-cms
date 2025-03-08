'use client'

import { useCallback } from 'react'
import { getCollections } from '@/core/actions/collection'
import { MultipleSelector } from '@/components/ui/multiple-selector'

type Collection = {
  id: string
  title: string
}

type ProductsCollectionsInputProps = {
  value?: Collection[]
  onChange: (value: Collection[]) => void
}

export function ProductsCollectionsInput({
  value: collections,
  onChange,
  ...props
}: ProductsCollectionsInputProps) {
  const handleSearch = useCallback(async (value: string) => {
    const collections = await getCollections({
      search: value,
      fields: 'id,title',
    })

    return collections.map((collection) => ({
      label: collection.title,
      value: collection.id.toString(),
    }))
  }, [])

  return (
    <MultipleSelector
      {...props}
      badgeVariant="secondary"
      placeholder="Winter Collection"
      emptyIndicator="No collections found"
      loadingIndicator={
        <div className="w-full py-6 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      }
      hidePlaceholderWhenSelected={true}
      hideClearAllButton={true}
      triggerSearchOnFocus={true}
      value={collections?.map((collection) => ({
        label: collection.title,
        value: collection.id,
      }))}
      onChange={(newOptions) => {
        onChange?.(
          newOptions.map((option) => ({
            id: option.value,
            title: option.label,
          })),
        )
      }}
      onSearch={handleSearch}
    />
  )
}
