'use client'

export default function DataPage() {
  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Data Explorer</h2>

      <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Chunks</h3>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>No chunks yet. Upload a PDF to extract data.</p>
      </div>
    </div>
  )
}
