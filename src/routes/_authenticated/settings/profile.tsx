import { createFileRoute } from '@tanstack/react-router'
import { Profile } from '@/features/settings/profile/components/profile'

export const Route = createFileRoute('/_authenticated/settings/profile')({
  component: Profile,
})
