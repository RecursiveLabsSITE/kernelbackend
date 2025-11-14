'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function KernelDetailPage() {
  const params = useParams()
  const kernelId = params?.kernelId as string
  const [kernel, setKernel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!kernelId) return
    loadKernel()
  }, [kernelId])

  async function loadKernel() {
    try {
      const res = await fetch(`/api/kernels/${kernelId}`)
      const data = await res.json()
      if (data.error) {
        setKernel(null)
      } else {
        setKernel(data)
      }
    } catch (err) {
      console.error(err)
      setKernel(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading kernel...</div>
  if (!kernel) return <div style={{ padding: '20px' }}>Kernel not found</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link href="/kernels" style={{ color: '#6b7280', textDecoration: 'none' }}>← Back</Link>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>{kernel.name}</h1>
      </div>

      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
        {['overview', 'ingest', 'contradictions', 'graph', 'prompt'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 16px',
              background: activeTab === tab ? '#111827' : 'transparent',
              color: activeTab === tab ? '#fff' : '#6b7280',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontSize: '14px',
              fontWeight: activeTab === tab ? '600' : '400'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Overview</h2>
          <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
            <p><strong>Name:</strong> {kernel.name}</p>
            <p><strong>Status:</strong> {kernel.status}</p>
            <p><strong>Description:</strong> {kernel.description || 'N/A'}</p>
            <p><strong>Created:</strong> {new Date(kernel.created_at).toLocaleString()}</p>
          </div>
        </div>
      )}

      {activeTab === 'ingest' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Ingest</h2>
          <p style={{ color: '#6b7280' }}>Upload PDFs to create processing batches</p>
        </div>
      )}

      {activeTab === 'contradictions' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Contradictions</h2>
          <p style={{ color: '#6b7280' }}>Value tensions and conflicts</p>
        </div>
      )}

      {activeTab === 'graph' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Graph Brain</h2>
          <p style={{ color: '#6b7280' }}>Pole network visualization</p>
        </div>
      )}

      {activeTab === 'prompt' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Prompt</h2>
          <p style={{ color: '#6b7280' }}>System prompt configuration</p>
        </div>
      )}
    </div>
  )
}
