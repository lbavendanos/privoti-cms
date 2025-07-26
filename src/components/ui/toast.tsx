import { toast as sonnerToast } from 'sonner'
import type { ExternalToast, ToastT } from 'sonner'

type titleT = (() => React.ReactNode) | React.ReactNode

const createToast =
  (
    type: 'success' | 'info' | 'warning' | 'error' | undefined,
    classNames: Record<string, string>,
  ) =>
  (
    message: titleT | React.ReactNode,
    data?: ExternalToast,
  ): string | number => {
    return sonnerToast(message, {
      ...data,
      type,
      classNames,
    } as ToastT)
  }

const toast = Object.assign(sonnerToast, {
  success: createToast('success', { icon: '!text-emerald-500' }),
  info: createToast('info', { icon: '!text-blue-500' }),
  warning: createToast('warning', { icon: '!text-amber-500' }),
  error: createToast('error', { icon: '!text-destructive' }),
  destructive: (
    message: titleT | React.ReactNode,
    data?: ExternalToast,
  ): string | number => {
    return sonnerToast(message, {
      ...data,
      classNames: {
        toast: '!border-destructive !bg-destructive',
        title: '!text-white',
        description: '!text-white',
      },
    })
  },
})

export { toast }
