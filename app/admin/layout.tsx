import type { Metadata } from 'next'
import AdminShell from '@/components/admin/AdminShell'

export const metadata: Metadata = {
  title: 'Admin · APZ Paintball',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-panel">
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
