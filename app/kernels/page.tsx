'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Kernel {
  id: string
  name: string
  description: string
  status: string
  created_at: string
}

// Default team ID (UUID v4)
const DEFAULT_TEAM_ID = '550e8400-e29b-41d4-a716-446655440001'

export default function KernelsPage() {
  const [kernels, setKernels] = useState<Kernel[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newKernel, setNewKernel] = useState({ name: '', description: '' })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadKernels()
  }, [])

  async function loadKernels() {
    try {
      setError(null)
      const res = await fetch('/api/kernels')
      if (res.ok) {
        const data = await res.json()
        setKernels(data)
      } else {
        const errorData = await res.json()
        setError(`Failed to load kernels: ${errorData.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('Error loading kernels:', err)
      setError(`Error loading kernels: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateKernel() {
    if (!newKernel.name.trim()) {
      alert('Please enter a kernel name')
      return
    }

    try {
      setError(null)
      const res = await fetch('/api/kernels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKernel.name,
          description: newKernel.description,
          team_id: DEFAULT_TEAM_ID,
        }),
      })

      if (res.ok) {
        const created = await res.json()
        setKernels([...kernels, created])
        setNewKernel({ name: '', description: '' })
        setShowCreateForm(false)
      } else {
        const errorData = await res.json()
        setError(`Failed to create kernel: ${errorData.error || 'Unknown error'}`)
        console.error('Error response:', errorData)
      }
    } catch (err) {
      console.error('Error creating kernel:', err)
      setError(`Error creating kernel: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  if (loading) return <div style={{ padding: '24px' }}>Loading kernels...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Kernels</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '10px 20px',
            background: '#111827',
            color: '#fff',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          {showCreateForm ? 'Cancel' : '+ Create Kernel'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', borderRadius: '8px', padding: '16px', marginBottom: '24px', border: '1px solid #fecaca', color: '#991b1b' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>{error}</p>
        </div>
      )}

      {showCreateForm && (
        <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Create New Kernel</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Name</label>
              <input
                type="text"
                value={newKernel.name}
                onChange={(e) => setNewKernel({ ...newKernel, name: e.target.value })}
                placeholder="e.g., Leonardo da Vinci"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Description</label>
              <input
                type="text"
                value={newKernel.description}
                onChange={(e) => setNewKernel({ ...newKernel, description: e.target.value })}
                placeholder="Brief description"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
          <button
            onClick={handleCreateKernel}
            style={{
              padding: '10px 20px',
              background: '#111827',
              color: '#fff',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            Create Kernel
          </button>
        </div>
      )}

      {kernels.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '8px', padding: '48px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>No kernels yet. Create one to get started!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {kernels.map((kernel) => (
            <Link key={kernel.id} href={`/kernels/${kernel.id}/overview`}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  e.currentTarget.style.borderColor = '#d1d5db'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>{kernel.name}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>{kernel.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '4px 8px',
                      background: '#f3f4f6',
                      borderRadius: '4px',
                      color: '#374151',
                    }}
                  >
                    {kernel.status}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {new Date(kernel.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
