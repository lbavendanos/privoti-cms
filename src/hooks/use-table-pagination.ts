import { getRouteApi } from '@tanstack/react-router'
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/lib/constants'
import type { RegisteredRouter, RouteIds } from '@tanstack/react-router'
import { useCallback } from 'react'

type Pagination = {
  page: number
  per_page: number
}

export function useTablePagination<
  T extends RouteIds<RegisteredRouter['routeTree']>,
>(routeId: T) {
  const route = getRouteApi<T>(routeId)
  const navigate = route.useNavigate()
  const pagination: Pagination = route.useSearch({
    // @ts-ignore This is a workaround for the type issue with `useSearch`
    select: ({ page, per_page }) => ({
      page: page ?? DEFAULT_PAGE,
      per_page: per_page ?? DEFAULT_PER_PAGE,
    }),
  })

  const setPagination = useCallback(
    (newPagination: Partial<Pagination>) => {
      const updated = {
        page:
          newPagination.page === DEFAULT_PAGE ? undefined : newPagination.page,
        per_page:
          newPagination.per_page === DEFAULT_PER_PAGE
            ? undefined
            : newPagination.per_page,
      }

      // @ts-ignore This is a workaround for the type issue with `navigate`
      navigate({
        search: (prev) => ({
          ...prev,
          ...updated,
        }),
      })
    },
    [navigate],
  )

  return {
    pagination,
    setPagination,
  }
}
