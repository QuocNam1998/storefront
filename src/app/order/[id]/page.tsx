import { OrderConfirmation } from '@/views/OrderConfirmation'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OrderConfirmation id={id} />
}
