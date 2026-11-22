import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Không tìm thấy trang</h1>
      <p className="mt-4 max-w-md text-lg">Đường dẫn có thể đã cũ hoặc bị gõ sai.</p>
      <Button asChild size="xl" className="mt-8">
        <Link to="/">Về trang chủ</Link>
      </Button>
    </div>
  )
}
