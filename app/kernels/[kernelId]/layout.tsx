'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function KernelLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const kernelId = params.kernelId as string

  const tabs = [
    { name: 'Overview', href: `/kernels/${kernelId}/overview` },
    { name: 'Ingest', href: `/kernels/${kernelId}/ingest` },
    { name: 'Data', href: `/kernels/${kernelId}/data` },
    { name: 'Contradictions', href: `/kernels/${kernelId}/contradictions` },
    { name: 'Graph', href: `/kernels/${kernelId}/graph` },
    { name: 'Prompt', href: `/kernels/${kernelId}/prompt` },
  ]

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/kernels" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to Kernels
        </Link>
      </div>

      <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto' }}>
          {tabs.map((tab) => (
            <Link key={tab.name} href={tab.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '12px 0',
                  borderBottom: '2px solid transparent',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#111827'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#6b7280'
                }}
              >
                {tab.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {children}
    </div>
  )
}
