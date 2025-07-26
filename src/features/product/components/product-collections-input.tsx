import { core } from '@/lib/fetcher'
import { useCallback } from 'react'
import { MultipleSelector } from '@/components/ui/multiple-selector'
import type { List } from '@/core/types'

type Collection = {
  id: string
  title: string
}

type ProductCollectionsInputProps = {
  value?: Collection[]
  onChange?: (value: Collection[]) => void
}

export function ProductCollectionsInput({
  value: collections,
  onChange,
  ...props
}: ProductCollectionsInputProps) {
  const handleSearch = useCallback(async (value: string) => {
    const { data: collections } = await core.fetch<List<Collection>>(
      '/api/c/collections',
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
        <div className="text-muted-foreground w-full py-6 text-center text-sm">
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
