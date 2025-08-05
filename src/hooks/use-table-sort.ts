import { getRouteApi } from '@tanstack/react-router'
import type { RegisteredRouter, RouteIds } from '@tanstack/react-router'

export function useTableSort<T extends RouteIds<RegisteredRouter['routeTree']>>(
  routeId: T,
) {
  const route = getRouteApi<T>(routeId)
  const navigate = route.useNavigate()
  // @ts-ignore This is a workaround for the type issue with `useSearch`
  const sorting = route.useSearch({ select: (search) => search.order })

  const setSorting = (newSorting: string) => {
    // @ts-ignore This is a workaround for the type issue with `navigate`
    navigate({
      search: (prev) => ({
        ...prev,
        order: newSorting,
      }),
    })
  }

  return { sorting, setSorting }
}
