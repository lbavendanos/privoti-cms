'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useEffect, useState } from 'react'

const categories = [
  { id: 1, name: 'Electrónica', parent_id: null },
  { id: 2, name: 'Teléfonos', parent_id: 1 },
  { id: 3, name: 'Laptops', parent_id: 1 },
  { id: 4, name: 'Accesorios', parent_id: 1 },
  { id: 5, name: 'Samsung', parent_id: 2 },
  { id: 6, name: 'iPhone', parent_id: 2 },
  { id: 7, name: 'Galaxy S24', parent_id: 5 },
  { id: 8, name: 'Galaxy A54', parent_id: 5 },
  { id: 9, name: 'iPhone 15', parent_id: 6 },
  { id: 10, name: 'iPhone 14', parent_id: 6 },
  { id: 11, name: 'MacBook', parent_id: 3 },
  { id: 12, name: 'Windows Laptop', parent_id: 3 },
  { id: 13, name: 'MacBook Air', parent_id: 11 },
  { id: 14, name: 'MacBook Pro', parent_id: 11 },
  { id: 15, name: 'Dell XPS', parent_id: 12 },
  { id: 16, name: 'Lenovo ThinkPad', parent_id: 12 },
  { id: 17, name: 'Hogar', parent_id: null },
  { id: 18, name: 'Muebles', parent_id: 17 },
  { id: 19, name: 'Decoración', parent_id: 17 },
  { id: 20, name: 'Sofás', parent_id: 18 },
  { id: 21, name: 'Mesas', parent_id: 18 },
  { id: 22, name: 'Lámparas', parent_id: 19 },
  { id: 23, name: 'Cuadros', parent_id: 19 },
  { id: 24, name: 'Seccionales', parent_id: 20 },
  { id: 25, name: 'Reclinables', parent_id: 20 },
  { id: 26, name: 'Escritorios', parent_id: 21 },
  { id: 27, name: 'Comedores', parent_id: 21 },
]

// Función para obtener los hijos de una categoría
function getChildren(parentId: number | null) {
  return categories.filter((cat) => cat.parent_id === parentId)
}

// Función para verificar si una categoría tiene hijos
function hasChildren(categoryId: number) {
  return categories.some((cat) => cat.parent_id === categoryId)
}

// Función para obtener el padre inmediato de una categoría
function getParent(categoryId: number) {
  const category = categories.find((cat) => cat.id === categoryId)
  return category?.parent_id ?? null
}

function getParentPath(categoryId: number): number[] {
  const path: number[] = []
  let current = categoryId
  while (current !== null) {
    const parent = getParent(current)
    if (parent !== null) {
      path.unshift(parent)
      current = parent
    } else {
      break
    }
  }
  return path
}

interface Category {
  label: string
  value: string
}

interface CategorySelectorProps {
  value: Category | null
  onChange: (value: Category) => void
}

export function ProductsCategoryInput({
  value,
  onChange,
}: CategorySelectorProps) {
  const [currentParent, setCurrentParent] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen && value) {
      const categoryId = parseInt(value.value, 10)
      const parentPath = getParentPath(categoryId)
      setCurrentParent(
        parentPath.length > 0 ? parentPath[parentPath.length - 1] : null,
      )
    }
  }, [isOpen, value])

  const filteredCategories = searchTerm
    ? categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : getChildren(currentParent)

  const handleSelectCategory = (category: { id: number; name: string }) => {
    onChange({ label: category.name, value: String(category.id) })
    setIsOpen(false)
  }

  const handleNavigateToSubcategory = (categoryId: number) => {
    setCurrentParent(categoryId)
    setSearchTerm('') // Limpiar búsqueda
  }

  const handleGoBack = () => {
    setCurrentParent(getParent(currentParent!))
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          {value ? value.label : 'Selecciona una categoría'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2">
        <Command>
          <CommandInput
            placeholder="Buscar categoría..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {currentParent !== null && !searchTerm && (
              <CommandItem onSelect={handleGoBack}>🔙 Volver</CommandItem>
            )}

            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <CommandItem key={category.id} className="flex justify-between">
                  <span onClick={() => handleSelectCategory(category)}>
                    {category.name}
                  </span>
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
              <CommandItem disabled>No se encontraron categorías</CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
