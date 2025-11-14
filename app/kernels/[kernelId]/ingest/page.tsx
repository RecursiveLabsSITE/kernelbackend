'use client'

import { useState } from 'react'

export default function IngestPage() {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      // TODO: Implement file upload to backend
      alert('File upload feature coming soon!')
    } catch (err) {
      console.error(err)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Ingest PDF</h2>

      <div style={{ background: '#fff', borderRadius: '8px', padding: '40px', border: '2px dashed #d1d5db', textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Upload PDF</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Drag and drop your PDF here or click to browse</p>
        </div>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <button
            onClick={() => document.getElementById('file-input')?.click()}
            disabled={uploading}
            style={{
              padding: '10px 20px',
              background: '#111827',
              color: '#fff',
              borderRadius: '6px',
              border: 'none',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: uploading ? 0.6 : 1,
            }}
          >
            {uploading ? 'Uploading...' : 'Select PDF'}
          </button>
        </label>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Processing Batches</h3>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>No batches yet. Upload a PDF to get started.</p>
      </div>
    </div>
  )
}
