import { createFileRoute } from '@tanstack/react-router'
import { TransferNeg } from '@/screens/transfer-neg/transfer-neg'

export const Route = createFileRoute('/transfer-verhandlung')({
  component: TransferNeg,
})
