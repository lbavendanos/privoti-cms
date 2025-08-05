import { core } from '@/lib/fetcher'
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import type { Customer, List } from '../types'
import type { UseQueryOptions } from '@tanstack/react-query'

export function makeCustomersQueryOptions(
  params: Record<string, unknown> = {},
  options?: Omit<UseQueryOptions<List<Customer>>, 'queryKey' | 'queryFn'>,
) {
  return queryOptions({
    queryKey: ['customer-list', params],
    queryFn: () => core.fetch<List<Customer>>('/api/c/customers', { params }),
    ...options,
  })
}

export function makeCustomerQueryOptions(
  id: string,
  options?: Omit<UseQueryOptions<Customer>, 'queryKey' | 'queryFn'>,
) {
  return queryOptions({
    queryKey: ['customer-detail', { id }],
    queryFn: () =>
      core
        .fetch<{ data: Customer }>(`/api/c/customers/${id}`)
        .then(({ data: customer }) => customer),
    ...options,
  })
}

export function useCustomers(
  params: Record<string, unknown> = {},
  options?: Omit<UseQueryOptions<List<Customer>>, 'queryKey' | 'queryFn'>,
) {
  return useSuspenseQuery(makeCustomersQueryOptions(params, options))
}

export function useCustomer(id: string) {
  return useSuspenseQuery(makeCustomerQueryOptions(id))
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data: customer } = await core.fetch<{ data: Customer }>(
        '/api/c/customers',
        {
          method: 'POST',
          body: payload,
        },
      )

      return customer
    },
    onSuccess: (customer) => {
      queryClient.setQueryData(
        ['customer-detail', { id: `${customer.id}` }],
        customer,
      )
      queryClient.invalidateQueries({ queryKey: ['customer-list'] })
    },
  })
}

export function useUpdateCustomers() {
  const queryClient = useQueryClient()
  const params = { _method: 'PUT' }

  return useMutation({
    mutationFn: async (payload: { items: Record<string, unknown>[] }) =>
      core
        .fetch<{ data: Customer[] }>('/api/c/customers', {
          method: 'POST',
          body: payload,
          params,
        })
        .then(({ data }) => data),
    onSuccess: (customers) => {
      customers.forEach((customer) => {
        queryClient.setQueryData(
          ['customer-detail', { id: customer.id }],
          customer,
        )
      })
      queryClient.invalidateQueries({ queryKey: ['customer-list'] })
    },
  })
}

export function useDeleteCustomer(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      core.fetch(`/api/c/customers/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customer-detail', { id: `${id}` }],
      })
      queryClient.invalidateQueries({ queryKey: ['customer-list'] })
    },
  })
}

export function useDeleteCustomers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: number[] | string[]) =>
      core
        .fetch('/api/c/customers', {
          method: 'DELETE',
          body: { ids } as unknown as BodyInit,
        })
        .then(() => ids),
    onSuccess: (ids) => {
      ids.forEach((id) => {
        queryClient.invalidateQueries({
          queryKey: ['customer-detail', { id: `${id}` }],
        })
      })
      queryClient.invalidateQueries({ queryKey: ['customer-list'] })
    },
  })
}
