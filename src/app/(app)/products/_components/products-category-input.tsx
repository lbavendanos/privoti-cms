'use client'

import { blank, cn, filled } from '@/lib/utils'
import { getProductCategories } from '@/core/actions/product-category'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2,
  X,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  parent_id: string | null
}

interface ProductsCategoryInputProps {
  id?: string
  value?: Category | null
  onChange?: React.Dispatch<React.SetStateAction<Category | null>>
}

export function ProductsCategoryInput({
  id,
  value: currentCategory,
  onChange,
}: ProductsCategoryInputProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [currentParent, setCurrentParent] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!categoriesLoaded) {
      setIsLoading(true)

      getProductCategories({ all: '1', fields: 'id,name,parent_id' })
        .then((data) => {
          const categoryList = data.map((c) => ({
            id: c.id.toString(),
            name: c.name,
            parent_id: c.parent_id ? c.parent_id.toString() : null,
          }))

          setCategories(categoryList)
          setCategoriesLoaded(true)
          setIsLoading(false)

          if (currentCategory) {
            setCurrentParent(currentCategory.parent_id)

            // const categoryId = currentCategory.id
            // const parentPath = getParentPath(categoryId, categoryList)
            //
            // console.log(parentPath)
            //
            // setCurrentParent(
            //   parentPath.length > 0 ? parentPath[parentPath.length - 1] : null,
            // )
          }
        })
        .catch(() => setIsLoading(false))
    }
  }, [categoriesLoaded, currentCategory])

  const getChildren = useCallback(
    (parentId: string | null) => {
      return categories.filter((c) => c.parent_id === parentId)
    },
    [categories],
  )

  const hasChildren = useCallback(
    (categoryId: string) => {
      return categories.some((c) => c.parent_id === categoryId)
    },
    [categories],
  )

  const getParent = useCallback(
    (categoryId: string) => {
      return categories.find((c) => c.id === categoryId)?.parent_id ?? null
    },
    [categories],
  )

  const getParentName = useCallback(
    (categoryId: string) => {
      return categories.find((c) => c.id === categoryId)?.name ?? ''
    },
    [categories],
  )

  // function getParentPath(
  //   categoryId: string,
  //   categoryList: Category[],
  // ): string[] {
  //   const path: string[] = []
  //
  //   let current = categoryId
  //
  //   while (current !== null) {
  //     const parent = categoryList.find((cat) => cat.id === current)?.parent_id
  //
  //     if (parent !== null) {
  //       path.unshift(parent)
  //       current = parent
  //     } else {
  //       break
  //     }
  //   }
  //
  //   return path
  // }

  const filteredCategories = useMemo(
    () =>
      searchTerm
        ? categories.filter((c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : getChildren(currentParent),
    [currentParent, categories, searchTerm, getChildren],
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

  const handleNavigateToSubcategory = useCallback((categoryId: string) => {
    setCurrentParent(categoryId)
    setSearchTerm('')
  }, [])

  const handleGoBack = useCallback(() => {
    setCurrentParent(getParent(currentParent!))
  }, [currentParent, getParent])

  // useEffect(() => {
  //   if (isOpen) {
  //     if (value) {
  //       // Si hay una categoría seleccionada, restablecemos la jerarquía de navegación a su ubicación
  //       const categoryId = parseInt(value.value, 10)
  //       const parentPath = getParentPath(categoryId, categories)
  //       setCurrentParent(
  //         parentPath.length > 0 ? parentPath[parentPath.length - 1] : null,
  //       )
  //       setSearchTerm('')
  //     }
  //   }
  // }, [isOpen, value, categories])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="relative w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]"
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
        className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
        align="start"
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search category"
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {currentParent !== null && !searchTerm && (
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
                      <span>{getParentName(currentParent)}</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}
              <CommandGroup>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.id}
                      className="cursor-pointer p-0"
                      onSelect={() => handleSelectCategory(category)}
                    >
                      {currentCategory &&
                        currentCategory.id === category.id && (
                          <CheckIcon size={16} className="absolute left-2" />
                        )}
                      <span className="flex-1 py-1.5 pl-8">
                        {category.name}
                      </span>
                      {hasChildren(category.id) && (
                        <span
                          className="ml-auto px-2 py-1.5"
                          onClick={(e) => {
                            e.stopPropagation()

                            handleNavigateToSubcategory(category.id)
                          }}
                        >
                          <ChevronRightIcon
                            size={16}
                            className="text-muted-foreground/80"
                          />
                        </span>
                      )}
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem disabled>
                    No se encontraron categorías
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  )
}
