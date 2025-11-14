'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Contradiction {
  id: string
  pole_a: string
  pole_b: string
  scar_valence: number
  life_phase: string
  refusal_flag: boolean
}

export default function ContradictionsPage() {
  const params = useParams()
  const kernelId = params.kernelId as string
  const [contradictions, setContradictions] = useState<Contradiction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newContradiction, setNewContradiction] = useState({
    pole_a: '',
    pole_b: '',
    scar_valence: 0.5,
    life_phase: 'early_life',
    refusal_flag: false,
  })

  useEffect(() => {
    loadContradictions()
  }, [kernelId])

  async function loadContradictions() {
    try {
      const res = await fetch(`/api/kernels/${kernelId}/contradictions`)
      if (res.ok) {
        const data = await res.json()
        setContradictions(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    if (!newContradiction.pole_a.trim() || !newContradiction.pole_b.trim()) {
      alert('Please fill in both poles')
      return
    }

    try {
      const res = await fetch(`/api/kernels/${kernelId}/contradictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContradiction),
      })

      if (res.ok) {
        const created = await res.json()
        setContradictions([...contradictions, created])
        setNewContradiction({
          pole_a: '',
          pole_b: '',
          scar_valence: 0.5,
          life_phase: 'early_life',
          refusal_flag: false,
        })
        setShowForm(false)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to create contradiction')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Value Tensions</h2>
        <button
          onClick={() => setShowForm(!showForm)}
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
          {showForm ? 'Cancel' : '+ Add Tension'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Pole A</label>
              <input
                type="text"
                value={newContradiction.pole_a}
                onChange={(e) => setNewContradiction({ ...newContradiction, pole_a: e.target.value })}
                placeholder="e.g., Duty"
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
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Pole B</label>
              <input
                type="text"
                value={newContradiction.pole_b}
                onChange={(e) => setNewContradiction({ ...newContradiction, pole_b: e.target.value })}
                placeholder="e.g., Desire"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Scar Valence</label>
              <input
                type="range"
                min="0"
                max="100"
                value={newContradiction.scar_valence * 100}
                onChange={(e) => setNewContradiction({ ...newContradiction, scar_valence: parseFloat(e.target.value) / 100 })}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>{(newContradiction.scar_valence * 100).toFixed(0)}%</span>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Life Phase</label>
              <select
                value={newContradiction.life_phase}
                onChange={(e) => setNewContradiction({ ...newContradiction, life_phase: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="early_life">Early Life</option>
                <option value="rise">Rise</option>
                <option value="reign">Reign</option>
                <option value="decline">Decline</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newContradiction.refusal_flag}
                  onChange={(e) => setNewContradiction({ ...newContradiction, refusal_flag: e.target.checked })}
                />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Refusal Flag</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleCreate}
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
            Create Tension
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gap: '16px' }}>
        {contradictions.map((c) => (
          <div key={c.id} style={{ background: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626' }}>{c.pole_a}</span>
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>↔</span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#2563eb' }}>{c.pole_b}</span>
              </div>
              {c.refusal_flag && (
                <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 8px', background: '#fee2e2', color: '#991b1b', borderRadius: '4px' }}>
                  Refusal
                </span>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '14px' }}>
              <div>
                <span style={{ color: '#6b7280' }}>Scar Valence:</span>
                <span style={{ fontWeight: '600', marginLeft: '8px', color: '#111827' }}>{(c.scar_valence * 100).toFixed(0)}%</span>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>Phase:</span>
                <span style={{ fontWeight: '600', marginLeft: '8px', color: '#111827', textTransform: 'capitalize' }}>{c.life_phase}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
