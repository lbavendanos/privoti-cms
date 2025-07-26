import { toast } from './components/ui/toast.tsx'
import { isFetchError } from './lib/fetcher.ts'
import { createRouter } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { StrictMode } from 'react'
import { RouterProvider } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

// This code configures React Query with custom error handling
// for authentication and server errors. It relies on `router`
// to manage redirects, so it must remain here to access
// the current route and navigate appropriately.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // 10 seconds
      retry: false,
    },
    mutations: {
      onError: (error) => {
        if (isFetchError(error)) {
          if (error.status === 401) {
            toast.destructive('Session expired!')

            const redirect = router.history.location.href
            router.navigate({ to: '/login', search: { redirect } })
          } else if (error.status >= 500) {
            toast.destructive(error.message)
          }
        } else {
          toast.destructive(error.message)
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (isFetchError(error)) {
        if (error.status === 401) {
          toast.destructive('Session expired!')

          const redirect = router.history.location.href
          router.navigate({ to: '/login', search: { redirect } })
        }
      }
    },
  }),
})

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
