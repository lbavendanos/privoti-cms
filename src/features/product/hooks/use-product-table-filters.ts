import { getRouteApi } from '@tanstack/react-router'

const route = getRouteApi('/_authenticated/(app)/products/')

function cleanEmptyParams<T extends Record<string, unknown>>(search: T) {
  const newSearch = { ...search }

  Object.keys(newSearch).forEach((key) => {
    const value = newSearch[key]

    if (
      value === undefined ||
      value === '' ||
      (typeof value === 'number' && isNaN(value)) ||
      (Array.isArray(value) && value.length === 0)
    )
      delete newSearch[key]
  })

  return newSearch
}

export function useProductTableFilters() {
  const navigate = route.useNavigate()
  const filters = route.useSearch({
    select: ({ title, status, type, vendor, created_at, updated_at }) => ({
      title,
      status,
      type,
      vendor,
      created_at,
      updated_at,
    }),
  })

  const setFilters = (newFilters: Partial<typeof filters>) => {
    navigate({
      search: (prev) => cleanEmptyParams({ ...prev, ...newFilters }),
    })
  }

  const clearFilters = () => navigate({ search: {} })

  return { filters, setFilters, clearFilters }
}
