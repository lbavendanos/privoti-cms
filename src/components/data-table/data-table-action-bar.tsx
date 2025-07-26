import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { useCallback, useEffect } from 'react'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AnimatePresence } from 'motion/react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { LoaderIcon, X } from 'lucide-react'

interface DataTableActionBarProps<TData>
  extends React.ComponentProps<typeof motion.div> {
  table: Table<TData>
}

function DataTableActionBar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableActionBarProps<TData>) {
  const isVisible = table.getFilteredSelectedRowModel().rows.length > 0

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        table.toggleAllRowsSelected(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [table])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="toolbar"
          aria-orientation="horizontal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={cn(
            'bg-background text-foreground fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit flex-wrap items-center justify-center gap-2 rounded-md border p-2 shadow-sm',
            className,
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface DataTableActionBarActionProps
  extends React.ComponentProps<typeof Button> {
  tooltip?: string
  isPending?: boolean
}

function DataTableActionBarAction({
  size = 'sm',
  tooltip,
  isPending,
  disabled,
  className,
  children,
  ...props
}: DataTableActionBarActionProps) {
  const trigger = (
    <Button
      variant="secondary"
      size={size}
      className={cn(
        'border-secondary bg-secondary/50 hover:bg-secondary/70 gap-1.5 border [&>svg]:size-3.5',
        size === 'icon' ? 'size-7' : 'h-7',
        className,
      )}
      disabled={disabled || isPending}
      {...props}
    >
      {isPending ? <LoaderIcon className="animate-spin" /> : children}
    </Button>
  )

  if (!tooltip) return trigger

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent
        sideOffset={6}
        className="bg-accent text-foreground border font-semibold dark:bg-zinc-900 [&>span]:hidden"
      >
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}

interface DataTableActionBarSelectionProps<TData> {
  table: Table<TData>
}

function DataTableActionBarSelection<TData>({
  table,
}: DataTableActionBarSelectionProps<TData>) {
  const onClearSelection = useCallback(() => {
    table.toggleAllRowsSelected(false)
  }, [table])

  return (
    <div className="flex h-7 items-center rounded-md border pr-1 pl-2.5">
      <span className="text-xs whitespace-nowrap">
        {table.getFilteredSelectedRowModel().rows.length} selected
      </span>
      <Separator
        orientation="vertical"
        className="mr-1 ml-2 data-[orientation=vertical]:h-4"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-5"
            onClick={onClearSelection}
          >
            <X className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          sideOffset={10}
          className="bg-accent text-foreground flex items-center gap-2 border px-2 py-1 font-semibold dark:bg-zinc-900 [&>span]:hidden"
        >
          <p>Clear selection</p>
          <kbd className="bg-background text-foreground rounded border px-1.5 py-px font-mono text-[0.7rem] font-normal shadow-xs select-none">
            <abbr title="Escape" className="no-underline">
              Esc
            </abbr>
          </kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
}
