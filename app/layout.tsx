import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kernel Studio',
  description: 'Digital personas with contradiction-based reasoning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', background: '#fafafa' }}>
          <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '600' }}>Λ Kernel Studio</div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <a href="/settings" style={{ textDecoration: 'none', color: '#111827' }}>Settings</a>
                <a href="/kernels" style={{ textDecoration: 'none', color: '#111827' }}>Kernels</a>
                <a href="/chat" style={{ textDecoration: 'none', color: '#111827' }}>Chat</a>
              </div>
            </div>
          </nav>
          <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
