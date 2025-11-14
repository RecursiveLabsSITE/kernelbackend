'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Kernel {
  id: string
  name: string
  description: string
  status: string
  created_at: string
}

interface Contradiction {
  id: string
  pole_a: string
  pole_b: string
  scar_valence: number
  life_phase: string
  refusal_flag: boolean
}

export default function OverviewPage() {
  const params = useParams()
  const kernelId = params.kernelId as string
  const [kernel, setKernel] = useState<Kernel | null>(null)
  const [contradictions, setContradictions] = useState<Contradiction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [kernelId])

  async function loadData() {
    try {
      const [kernelRes, contradictionsRes] = await Promise.all([
        fetch(`/api/kernels/${kernelId}`),
        fetch(`/api/kernels/${kernelId}/contradictions`),
      ])

      if (kernelRes.ok) {
        const k = await kernelRes.json()
        setKernel(k)
      }

      if (contradictionsRes.ok) {
        const c = await contradictionsRes.json()
        setContradictions(c)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!kernel) return <div>Kernel not found</div>

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>{kernel.name}</h1>
      <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>{kernel.description}</p>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>Contradictions</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>{contradictions.length}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>Deep Memories</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>0</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>Clusters</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>0</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>Status</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', textTransform: 'capitalize' }}>{kernel.status}</div>
        </div>
      </div>

      {/* Contradictions Section */}
      <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Value Tensions</h2>
        {contradictions.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No contradictions yet</p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {contradictions.map((c) => (
              <div key={c.id} style={{ padding: '16px', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626' }}>{c.pole_a}</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>↔</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb' }}>{c.pole_b}</span>
                  </div>
                  {c.refusal_flag && (
                    <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 8px', background: '#fee2e2', color: '#991b1b', borderRadius: '4px' }}>
                      Refusal
                    </span>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#6b7280' }}>Scar Valence:</span>
                    <span style={{ fontWeight: '600', marginLeft: '4px', color: '#111827' }}>{(c.scar_valence * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Phase:</span>
                    <span style={{ fontWeight: '600', marginLeft: '4px', color: '#111827', textTransform: 'capitalize' }}>{c.life_phase}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
