import { core } from '@/lib/fetcher'
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { CustomerAddress, List } from '../types'

export function makeCustomerAddressesQueryOptions(
  customerId: number,
  options?: Omit<
    UseQueryOptions<List<CustomerAddress>>,
    'queryKey' | 'queryFn'
  >,
) {
  return queryOptions({
    queryKey: ['customer-address-list', { customerId }],
    queryFn: () =>
      core.fetch<List<CustomerAddress>>(
        `/api/c/customers/${customerId}/addresses`,
      ),
    ...options,
  })
}

export function makeCustomerAddressQueryOptions(
  customerId: number,
  addressId: number,
  options?: Omit<UseQueryOptions<CustomerAddress>, 'queryKey' | 'queryFn'>,
) {
  return queryOptions({
    queryKey: ['customer-address-detail', { addressId, customerId }],
    queryFn: () =>
      core
        .fetch<{
          data: CustomerAddress
        }>(`/api/c/customers/${customerId}/addresses${addressId}`)
        .then(({ data: address }) => address),
    ...options,
  })
}

export function useCustomerAddresses(
  customerId: number,
  options?: Omit<
    UseQueryOptions<List<CustomerAddress>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useSuspenseQuery(
    makeCustomerAddressesQueryOptions(customerId, options),
  )
}

export function useCustomerAddress(customerId: number, addressId: number) {
  return useSuspenseQuery(
    makeCustomerAddressQueryOptions(customerId, addressId),
  )
}

export function useCreateCustomerAddress(customerId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data: address } = await core.fetch<{ data: CustomerAddress }>(
        `/api/c/customers/${customerId}/addresses`,
        {
          method: 'POST',
          body: payload,
        },
      )

      return address
    },
    onSuccess: (address) => {
      queryClient.setQueryData(
        ['customer-address-detail', { address: address.id, customerId }],
        address,
      )
      queryClient.invalidateQueries({
        queryKey: ['customer-address-list', { customerId }],
      })
    },
  })
}

export function useCreateCustomerAddressOptimistic(customerId: number) {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      core
        .fetch<{ data: CustomerAddress }>(
          `/api/c/customers/${customerId}/addresses`,
          {
            method: 'POST',
            body: payload,
          },
        )
        .then(({ data }) => data),
    onMutate: async (payload, context) => {
      await context.client.cancelQueries({
        queryKey: ['customer-address-list', { customerId }],
      })

      const previousAddressList = context.client.getQueryData<
        List<CustomerAddress>
      >(['customer-address-list', { customerId }])

      context.client.setQueryData(
        ['customer-address-list', { customerId }],
        (oldList: List<CustomerAddress>) => ({
          ...oldList,
          data: [...oldList.data, { id: -1, ...payload } as CustomerAddress],
        }),
      )

      return { previousAddressList }
    },
    onError: (_, __, onMutateResult, context) => {
      context.client.setQueryData(
        ['customer-address-list', { customerId }],
        onMutateResult?.previousAddressList,
      )
    },
    onSettled: (_, __, ___, ____, context) =>
      context.client.invalidateQueries({
        queryKey: ['customer-address-list', { customerId }],
      }),
  })
}

export function useUpdateCustomerAddressOptimistic(
  customerId: number,
  addressId: number,
) {
  const params = { _method: 'PUT' }

  return useMutation({
    mutationFn: (payload: Record<string, unknown> | FormData) =>
      core
        .fetch<{ data: CustomerAddress }>(
          `/api/c/customers/${customerId}/addresses/${addressId}`,
          {
            method: 'POST',
            body: payload,
            params,
          },
        )
        .then(({ data }) => data),
    onMutate: async (payload, context) => {
      await context.client.cancelQueries({
        queryKey: ['customer-address-list', { customerId }],
      })

      const previousAddressList = context.client.getQueryData<
        List<CustomerAddress>
      >(['customer-address-list', { customerId }])

      context.client.setQueryData(
        ['customer-address-list', { customerId }],
        (oldList: List<CustomerAddress>) => ({
          ...oldList,
          data: oldList.data.map((address) =>
            address.id === addressId ? { ...address, ...payload } : address,
          ),
        }),
      )

      return { previousAddressList }
    },
    onError: (_, __, onMutateResult, context) => {
      context.client.setQueryData(
        ['customer-address-list', { customerId }],
        onMutateResult?.previousAddressList,
      )
    },
    onSettled: (_, __, ___, ____, context) =>
      context.client.invalidateQueries({
        queryKey: ['customer-address-list', { customerId }],
      }),
  })
}

export function useUpdateCustomerAddressDefaultOptimistic(
  customerId: number,
  addressId: number,
) {
  const payload = { default: true }
  const params = { _method: 'PUT' }

  return useMutation({
    mutationFn: () =>
      core
        .fetch<{ data: CustomerAddress }>(
          `/api/c/customers/${customerId}/addresses/${addressId}`,
          {
            method: 'POST',
            body: payload,
            params,
          },
        )
        .then(({ data }) => data),
    onMutate: async (_, context) => {
      await context.client.cancelQueries({
        queryKey: ['customer-address-list', { customerId }],
      })

      const previousAddressList = context.client.getQueryData<
        List<CustomerAddress>
      >(['customer-address-list', { customerId }])

      context.client.setQueryData(
        ['customer-address-list', { customerId }],
        (oldList: List<CustomerAddress>) => ({
          ...oldList,
          data: oldList.data.map((address) => ({
            ...address,
            default: address.id === addressId,
          })),
        }),
      )

      return { previousAddressList }
    },
    onError: (_, __, onMutateResult, context) => {
      context.client.setQueryData(
        ['customer-address-list', { customerId }],
        onMutateResult?.previousAddressList,
      )
    },
    onSettled: (_, __, ___, ____, context) =>
      context.client.invalidateQueries({
        queryKey: ['customer-address-list', { customerId }],
      }),
  })
}

export function useDeleteCustomerAddressOptimistic(
  customerId: number,
  addressId: number,
) {
  return useMutation({
    mutationFn: () =>
      core.fetch(`/api/c/customers/${customerId}/addresses/${addressId}`, {
        method: 'DELETE',
      }),
    onMutate: async (_, context) => {
      await context.client.cancelQueries({
        queryKey: ['customer-address-list', { customerId }],
      })

      const previousAddressList = context.client.getQueryData<
        List<CustomerAddress>
      >(['customer-address-list', { customerId }])

      context.client.setQueryData(
        ['customer-address-list', { customerId }],
        (oldList: List<CustomerAddress>) => ({
          ...oldList,
          data: oldList.data.filter((address) => address.id !== addressId),
        }),
      )

      return { previousAddressList }
    },
    onError: (_, __, onMutateResult, context) => {
      context.client.setQueryData(
        ['customer-address-list', { customerId }],
        onMutateResult?.previousAddressList,
      )
    },
    onSettled: (_, __, ___, ____, context) =>
      context.client.invalidateQueries({
        queryKey: ['customer-address-list', { customerId }],
      }),
  })
}
