'use client'

import { fetcher } from '@/lib/utils'
import { useCallback } from 'react'
import { MultipleSelector } from '@/components/ui/multiple-selector'
import type { List } from '@/core/types'

type Collection = {
  id: string
  title: string
}

type ProductsCollectionsInputProps = {
  value?: Collection[]
  onChange?: (value: Collection[]) => void
}

export function ProductsCollectionsInput({
  value: collections,
  onChange,
  ...props
}: ProductsCollectionsInputProps) {
  const handleSearch = useCallback(async (value: string) => {
    const { data: collections } = await fetcher<List<Collection>>(
      '/api/collections',
      {
        params: {
          q: value,
          fields: 'id,title',
          name: 'collections',
        },
      },
    )

    return collections.map((collection) => ({
      label: collection.title,
      value: `${collection.id}`,
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
