import { getRouteApi } from '@tanstack/react-router'
import { clearEmptyFields } from '@/lib/utils'

const route = getRouteApi('/_authenticated/(app)/customers/')

export function useCustomerTableFilters() {
  const navigate = route.useNavigate()
  const filters = route.useSearch({
    select: ({ name, created_at, updated_at }) => ({
      name,
      created_at,
      updated_at,
    }),
  })

  const setFilters = (newFilters: Partial<typeof filters>) => {
    navigate({
      search: (prev) => clearEmptyFields({ ...prev, ...newFilters }),
    })
  }

  const clearFilters = () => navigate({ search: {} })

  return { filters, setFilters, clearFilters }
}
