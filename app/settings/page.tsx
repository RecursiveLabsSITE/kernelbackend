'use client'

import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    embedding_model: 'BGE-M3',
    language_model: 'GPT-4',
    retrieval_weights: {
      pair: 0.32,
      single: 0.12,
      cluster: 0.16,
      scar_phase: 0.14,
      bias: 0.10,
      refusal: 0.10,
      mask: 0.06,
    },
    safety_level: 'CLEAR',
  })

  const [team, setTeam] = useState({ name: "Ryan's Team", description: 'Main team' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleWeightChange = (key: string, value: number) => {
    setSettings({
      ...settings,
      retrieval_weights: {
        ...settings.retrieval_weights,
        [key]: value,
      },
    })
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        alert('Settings saved!')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to save settings')
    }
  }

  if (loading) return <div style={{ padding: '24px' }}>Loading...</div>

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Settings</h1>

      {/* Teams Section */}
      <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Teams & Organization</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Team Name</label>
            <input
              type="text"
              value={team.name}
              onChange={(e) => setTeam({ ...team, name: e.target.value })}
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
              value={team.description}
              onChange={(e) => setTeam({ ...team, description: e.target.value })}
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
      </div>

      {/* Models Configuration */}
      <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Models Configuration</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Embedding Model</label>
            <input
              type="text"
              value={settings.embedding_model}
              onChange={(e) => setSettings({ ...settings, embedding_model: e.target.value })}
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
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Language Model</label>
            <input
              type="text"
              value={settings.language_model}
              onChange={(e) => setSettings({ ...settings, language_model: e.target.value })}
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
      </div>

      {/* Retrieval Weights */}
      <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Retrieval Weights</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {Object.entries(settings.retrieval_weights).map(([key, value]: [string, any]) => (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', textTransform: 'capitalize' }}>
                  {key.replace('_', ' ')}
                </label>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{(value * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={value * 100}
                onChange={(e) => handleWeightChange(key, parseFloat(e.target.value) / 100)}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Safety Settings */}
      <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Safety Settings</h2>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>CLEAR Strictness</label>
          <select
            value={settings.safety_level}
            onChange={(e) => setSettings({ ...settings, safety_level: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          >
            <option>CLEAR</option>
            <option>MODERATE</option>
            <option>PERMISSIVE</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{
          padding: '12px 24px',
          background: '#111827',
          color: '#fff',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
        }}
      >
        Save Settings
      </button>
    </div>
  )
}
