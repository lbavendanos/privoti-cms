import { useRef } from 'react'
import { createRoot } from 'react-dom/client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'

export function usePrompt() {
  const currentPromptPromise = useRef<Promise<boolean> | null>(null)

  const prompt = async (
    props: Omit<UsePromptProps, 'open'>,
  ): Promise<boolean> => {
    if (currentPromptPromise.current) {
      return currentPromptPromise.current
    }

    const promptPromise = new Promise<boolean>((resolve) => {
      let open = true
      const mountRoot = createRoot(document.createElement('div'))

      const onCancel = () => {
        open = false
        mountRoot.unmount()
        resolve(false)
        currentPromptPromise.current = null

        // TEMP FIX for Radix issue with dropdowns persisting pointer-events: none on body after closing
        document.body.style.pointerEvents = 'auto'
      }

      const onConfirm = () => {
        open = false
        resolve(true)
        mountRoot.unmount()
        currentPromptPromise.current = null

        // TEMP FIX for Radix issue with dropdowns persisting pointer-events: none on body after closing
        document.body.style.pointerEvents = 'auto'
      }

      const render = () => {
        mountRoot.render(
          <RenderPrompt
            open={open}
            onConfirm={onConfirm}
            onCancel={onCancel}
            {...props}
          />,
        )
      }

      render()
    })

    currentPromptPromise.current = promptPromise
    return promptPromise
  }

  return prompt
}

type UsePromptProps = {
  open: boolean
  title: React.ReactNode
  description: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

function RenderPrompt({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: UsePromptProps) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
