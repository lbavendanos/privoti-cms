import { getRouteApi } from '@tanstack/react-router'

const route = getRouteApi('/_authenticated/(app)/products/')

export function useProductTableSort() {
  const navigate = route.useNavigate()
  const sorting = route.useSearch({ select: (search) => search.order })

  const setSorting = (newSorting: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        order: newSorting,
      }),
    })
  }

  return { sorting, setSorting }
}
