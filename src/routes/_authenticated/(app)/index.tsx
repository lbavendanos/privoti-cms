import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard/components/dashboard'

const dashboardSearchSchema = z.object({
  verified: z.boolean().optional(),
})

export const Route = createFileRoute('/_authenticated/(app)/')({
  validateSearch: dashboardSearchSchema,
  component: Dashboard,
})
