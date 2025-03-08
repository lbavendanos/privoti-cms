'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getProductCategories } from '@/core/actions/product-category'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Category {
  id: number
  name: string
  parent_id: number | null
}

interface CategorySelectorProps {
  value: { label: string; value: string } | null
  onChange: (value: { label: string; value: string } | null) => void
}

export function ProductsCategoryInput({
  value,
  onChange,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [currentParent, setCurrentParent] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)

  useEffect(() => {
    if (!categoriesLoaded) {
      setLoading(true)
      getProductCategories({ all: '1', fields: 'id,name,parent_id' })
        .then((data) => {
          setCategories(data)
          setCategoriesLoaded(true)
          setLoading(false)

          if (value) {
            const categoryId = parseInt(value.value, 10)
            const parentPath = getParentPath(categoryId, data)
            setCurrentParent(
              parentPath.length > 0 ? parentPath[parentPath.length - 1] : null,
            )
          }
        })
        .catch(() => setLoading(false))
    }
  }, [categoriesLoaded, value])

  function getChildren(parentId: number | null) {
    return categories.filter((cat) => cat.parent_id === parentId)
  }

  function hasChildren(categoryId: number) {
    return categories.some((cat) => cat.parent_id === categoryId)
  }

  function getParent(categoryId: number) {
    return categories.find((cat) => cat.id === categoryId)?.parent_id ?? null
  }

  function getParentPath(
    categoryId: number,
    categoryList: Category[],
  ): number[] {
    const path: number[] = []
    let current = categoryId
    while (current !== null) {
      const parent = categoryList.find((cat) => cat.id === current)?.parent_id
      if (parent !== null) {
        path.unshift(parent)
        current = parent
      } else {
        break
      }
    }
    return path
  }

  const filteredCategories = searchTerm
    ? categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : getChildren(currentParent)

  const handleSelectCategory = (category: Category) => {
    if (value && value.value === String(category.id)) {
      onChange(null)
    } else {
      onChange({ label: category.name, value: String(category.id) })
    }
    setIsOpen(false)
  }

  const handleNavigateToSubcategory = (categoryId: number) => {
    setCurrentParent(categoryId)
    setSearchTerm('')
  }

  const handleGoBack = () => {
    setCurrentParent(getParent(currentParent!))
  }

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
        <Button variant="outline">
          {value ? value.label : 'Selecciona una categoría'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Buscar categoría..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {currentParent !== null && !searchTerm && (
                <CommandItem onSelect={handleGoBack}>🔙 Volver</CommandItem>
              )}

              <CommandGroup>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <CommandItem
                      key={String(category.id)}
                      value={String(category.id)}
                      className="flex justify-between"
                      onSelect={() => handleSelectCategory(category)}
                    >
                      <span>{category.name}</span>
                      {hasChildren(category.id) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNavigateToSubcategory(category.id)
                          }}
                        >
                          ➡
                        </Button>
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
