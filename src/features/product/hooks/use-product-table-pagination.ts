import { getRouteApi } from '@tanstack/react-router'
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/lib/constants'

const route = getRouteApi('/_authenticated/(app)/products/')

export function useProductTablePagination() {
  const navigate = route.useNavigate()
  const pagination = route.useSearch({
    select: ({ page, per_page }) => ({
      page: page ?? DEFAULT_PAGE,
      per_page: per_page ?? DEFAULT_PER_PAGE,
    }),
  })

  const setPagination = (newPagination: Partial<typeof pagination>) => {
    if (newPagination.page === DEFAULT_PAGE) {
      newPagination.page = undefined
    }

    if (newPagination.per_page === DEFAULT_PER_PAGE) {
      newPagination.per_page = undefined
    }

    navigate({
      search: (prev) => ({
        ...prev,
        ...newPagination,
      }),
    })
  }

  return {
    pagination,
    setPagination,
  }
}
