import { blank, cn, filled } from '@/lib/utils'
import { useProductCategories } from '@/core/hooks/product-category'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Command,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  X,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  parentId: string | null
  parentName?: string
}

interface ProductCategoryInputProps {
  id?: string
  value?: Category | null
  onChange?: (category: Category | null) => void
}

const params = { all: '1', fields: 'id,name,parent_id' }

export function ProductCategoryInput({
  id,
  value: currentCategory,
  onChange,
}: ProductCategoryInputProps) {
  const { data, isLoading } = useProductCategories(params)

  const [currentParent, setCurrentParent] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [isOpen, setIsOpen] = useState(false)

  const categories: Category[] = useMemo(
    () =>
      data?.data.map((c) => ({
        id: `${c.id}`,
        name: c.name,
        parentId: c.parent_id ? `${c.parent_id}` : null,
      })) ?? [],
    [data],
  )

  const findCategory = useCallback(
    (categoryId: string) => {
      return categories.find((c) => c.id === categoryId)
    },
    [categories],
  )

  const hasChildren = useCallback(
    (category: Category) => {
      return categories.some((c) => c.parentId === category.id)
    },
    [categories],
  )

  const getChildren = useCallback(
    (category: Category | null) => {
      const parentId = category?.id ?? null

      return categories.filter((c) => c.parentId === parentId)
    },
    [categories],
  )

  const handleSelectCategory = useCallback(
    (newCategory: Category) => {
      if (currentCategory && currentCategory.id === newCategory.id) {
        onChange?.(null)
      } else {
        onChange?.(newCategory)
      }

      setIsOpen(false)
    },
    [currentCategory, onChange],
  )

  const handleNavigateToSubcategory = useCallback((category: Category) => {
    setCurrentParent(category)
    setSearchTerm('')
  }, [])

  const handleGoBack = useCallback(() => {
    if (currentParent) {
      const parent = findCategory(currentParent.parentId!)

      setCurrentParent(parent!)
    }
  }, [currentParent, findCategory])

  const filteredCategories = useMemo(
    () =>
      searchTerm
        ? categories
            .filter((c) =>
              c.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((c) => ({
              ...c,
              parentName: findCategory(c.parentId!)?.name,
            }))
        : getChildren(currentParent),
    [currentParent, categories, searchTerm, getChildren, findCategory],
  )

  useEffect(() => {
    if (!isLoading && currentCategory) {
      const parent = findCategory(currentCategory.parentId!) ?? null

      setCurrentParent(parent)
    }
  }, [isLoading, currentCategory, findCategory])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="border-input bg-background hover:bg-background relative w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
        >
          <span
            className={cn(
              'truncate',
              blank(currentCategory) && 'text-muted-foreground',
            )}
          >
            {filled(currentCategory)
              ? currentCategory?.name
              : 'Select category'}
          </span>
          <div className="flex shrink-0 gap-x-2">
            {filled(currentCategory) && (
              <span
                onClick={(e) => {
                  e.preventDefault()

                  setSearchTerm('')
                  onChange?.(null)
                }}
              >
                <X size={16} className="text-muted-foreground/80" />
              </span>
            )}
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80"
              aria-hidden="true"
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search category"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {isLoading && filteredCategories.length === 0 && (
              <DefaultLoadingSkeleton />
            )}
            {!isLoading && filteredCategories.length === 0 && (
              <CommandEmpty>No categories found.</CommandEmpty>
            )}
            {filled(currentParent) && !searchTerm && (
              <>
                <CommandGroup>
                  <CommandItem
                    className="cursor-pointer"
                    onSelect={handleGoBack}
                  >
                    <ChevronLeftIcon
                      size={16}
                      className="text-muted-foreground/80"
                    />
                    <span>{currentParent?.name}</span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            <CommandGroup>
              {filteredCategories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id}
                  className="cursor-pointer p-0"
                  onSelect={() => handleSelectCategory(category)}
                >
                  {currentCategory && currentCategory.id === category.id && (
                    <CheckIcon size={16} className="absolute left-2" />
                  )}
                  <span className="flex-1 py-1.5 pl-8">{category.name}</span>
                  {hasChildren(category) ? (
                    <span
                      className="ml-auto px-2 py-1.5"
                      onClick={(e) => {
                        e.stopPropagation()

                        handleNavigateToSubcategory(category)
                      }}
                    >
                      <ChevronRightIcon
                        size={16}
                        className="text-muted-foreground/80"
                      />
                    </span>
                  ) : (
                    <>
                      {category.parentName && (
                        <span className="text-muted-foreground/80 ml-auto truncate px-2 py-1.5 text-xs">
                          {category.parentName}
                        </span>
                      )}
                    </>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function DefaultLoadingSkeleton() {
  return (
    <CommandGroup>
      {[1, 2, 3].map((i) => (
        <CommandItem key={i} disabled>
          <div className="flex w-full items-center">
            <Skeleton className="h-4 w-full" />
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
