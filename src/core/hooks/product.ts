import { core } from '@/lib/fetcher'
import {
  useMutation,
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import type { List, Product } from '../types'
import type { UseQueryOptions } from '@tanstack/react-query'

export function makeProductsQueryOptions(
  params: Record<string, unknown> = {},
  options?: Omit<UseQueryOptions<List<Product>>, 'queryKey' | 'queryFn'>,
) {
  return queryOptions({
    queryKey: ['product-list', params],
    queryFn: () => core.fetch<List<Product>>('/api/c/products', { params }),
    ...options,
  })
}

export function makeProductQueryOptions(
  id: number,
  options?: Omit<UseQueryOptions<Product>, 'queryKey' | 'queryFn'>,
) {
  return queryOptions({
    queryKey: ['product-detail', { id }],
    queryFn: () =>
      core
        .fetch<{ data: Product }>(`/api/c/products/${id}`)
        .then(({ data: product }) => product),
    ...options,
  })
}

export function useProducts(params: Record<string, unknown> = {}) {
  return useSuspenseQuery(makeProductsQueryOptions(params))
}

export function useProduct(id: number) {
  return useSuspenseQuery(makeProductQueryOptions(id))
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: FormData) => {
      const { data: product } = await core.fetch<{ data: Product }>(
        '/api/c/products',
        {
          method: 'POST',
          body: payload,
        },
      )

      return product
    },
    onSuccess: (product) => {
      queryClient.setQueryData(['product-detail', { id: product.id }], product)
      queryClient.invalidateQueries({ queryKey: ['product-list'] })
    },
  })
}

export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient()
  const params = { _method: 'PUT' }

  return useMutation({
    mutationFn: async (payload: Record<string, unknown> | FormData) =>
      core
        .fetch<{ data: Product }>(`/api/c/products/${id}`, {
          method: 'POST',
          body: payload,
          params,
        })
        .then(({ data }) => data),
    onSuccess: (product) => {
      queryClient.setQueryData(['product-detail', { id }], product)
      queryClient.invalidateQueries({ queryKey: ['product-list'] })
    },
  })
}

export function useUpdateProducts() {
  const queryClient = useQueryClient()
  const params = { _method: 'PUT' }

  return useMutation({
    mutationFn: async (payload: { items: Record<string, unknown>[] }) =>
      core
        .fetch<{ data: Product[] }>('/api/c/products', {
          method: 'POST',
          body: payload,
          params,
        })
        .then(({ data }) => data),
    onSuccess: (products) => {
      products.forEach((product) => {
        queryClient.setQueryData(
          ['product-detail', { id: product.id }],
          product,
        )
      })
      queryClient.invalidateQueries({ queryKey: ['product-list'] })
    },
  })
}

export function useDeleteProduct(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      core.fetch(`/api/c/products/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product-detail', { id }],
      })
      queryClient.invalidateQueries({ queryKey: ['product-list'] })
    },
  })
}

export function useDeleteProducts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: number[]) =>
      core
        .fetch('/api/c/products', {
          method: 'DELETE',
          body: { ids } as unknown as BodyInit,
        })
        .then(() => ids),
    onSuccess: (ids) => {
      ids.forEach((id) => {
        queryClient.invalidateQueries({
          queryKey: ['product-detail', { id }],
        })
      })
      queryClient.invalidateQueries({ queryKey: ['product-list'] })
    },
  })
}
