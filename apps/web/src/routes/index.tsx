import { createFileRoute } from '@tanstack/react-router'
import { OfficeHub } from '@/screens/office-hub/office-hub'

export const Route = createFileRoute('/')({
  component: OfficeHub,
})
