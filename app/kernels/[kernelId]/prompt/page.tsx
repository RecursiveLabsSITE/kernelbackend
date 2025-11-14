'use client'

import { useState } from 'react'

export default function PromptPage() {
  const [prompt, setPrompt] = useState(
    'You are a digital persona created from biographical data. Respond authentically based on your value tensions and life experiences.'
  )
  const [voicePriority, setVoicePriority] = useState('balanced')

  const handleSave = async () => {
    try {
      alert('Prompt saved!')
    } catch (err) {
      console.error(err)
      alert('Failed to save prompt')
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>System Prompt</h2>

      <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'monospace',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Voice Priority</label>
        <select
          value={voicePriority}
          onChange={(e) => setVoicePriority(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        >
          <option value="balanced">Balanced</option>
          <option value="pole_a">Emphasize Pole A</option>
          <option value="pole_b">Emphasize Pole B</option>
          <option value="contradictory">Contradictory</option>
        </select>
      </div>

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
        Save Prompt
      </button>
    </div>
  )
}
