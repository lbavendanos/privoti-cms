import { capitalize } from '@/lib/utils'
import { memo, useMemo } from 'react'
import { useTableColumns } from '@/hooks/use-table-columns'
import { getCustomerAccountIcon } from '../lib/utils'
import { CUSTOMER_ACCOUNT_LIST } from '../lib/constants'
import type { ColumnDef } from '@tanstack/react-table'
import type { Customer, CustomerAccount } from '@/core/types'
import { CustomerAccountBadge } from '../components/customer-account-badge'
import { CustomerTableRowAction } from '../components/customer-table-row-action'
import { TextIcon, UserIcon } from 'lucide-react'

const MemoizedCustomerTableRowAction = memo(CustomerTableRowAction)

export function useCustomerTableColumns() {
  const { selectedColumn, dateColumns } = useTableColumns<Customer>()
  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      selectedColumn,
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => row.getValue('name'),
        meta: {
          label: 'Name',
          placeholder: 'Search names...',
          variant: 'text',
          icon: TextIcon,
        },
        size: 150,
        enableColumnFilter: true,
        enableSorting: true,
        enableHiding: false,
      },
      {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
        cell: ({ row }) => row.getValue('email'),
        size: 150,
        enableSorting: false,
        enableHiding: true,
      },
      {
        id: 'account',
        header: 'Account',
        accessorKey: 'account',
        cell: ({ row }) => (
          <CustomerAccountBadge
            account={row.getValue<CustomerAccount>('account')}
          />
        ),
        meta: {
          label: 'Account',
          variant: 'select',
          icon: UserIcon,
          options: CUSTOMER_ACCOUNT_LIST.map((account) => ({
            label: capitalize(account),
            value: account,
            icon: getCustomerAccountIcon(account),
          })),
        },
        size: 90,
        enableColumnFilter: true,
        enableSorting: false,
        enableHiding: true,
      },
      {
        id: 'orders',
        header: 'Orders',
        accessorKey: 'orders',
        cell: ({ row }) => row.getValue('orders') ?? '0',
        size: 60,
        enableSorting: false,
        enableHiding: true,
      },
      {
        id: 'spent',
        header: 'Spent',
        accessorKey: 'spent',
        cell: ({ row }) => row.getValue('spent') ?? '0',
        size: 60,
        enableSorting: false,
        enableHiding: true,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <MemoizedCustomerTableRowAction customer={row.original} />
        ),
        size: 60,
        enableHiding: false,
        enableSorting: false,
      },
      ...dateColumns,
    ],
    [selectedColumn, dateColumns],
  )

  return { columns }
}
