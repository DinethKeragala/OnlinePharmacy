import PropTypes from 'prop-types'
import { useState } from 'react'

export default function UploadModal({ open, onClose, onCreated, createPrescription }) {
  const [form, setForm] = useState({ name: '', doctor: '', rxNumber: '', prescribedAt: '', refillsLeft: 0, note: '' })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const submit = async () => {
    setLoading(true); setError('')
    try {
      const payload = {
        ...form,
        refillsLeft: Number(form.refillsLeft || 0),
        status: 'pending',
        image: file || undefined,
      }
      const created = await createPrescription(payload)
      onCreated?.(created)
      onClose()
      setForm({ name: '', doctor: '', rxNumber: '', prescribedAt: '', refillsLeft: 0, note: '' })
      setFile(null)
    } catch (e) {
      setError(e.message || 'Failed to upload prescription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="font-semibold text-gray-900">Upload Your Prescription</div>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Easy Prescription Refills</h3>
              <p className="mt-3 text-gray-600">Upload your prescription and get your medications delivered to your doorstep. Our licensed pharmacists ensure accuracy and safety.</p>
              <ul className="mt-4 space-y-3 text-gray-700">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Quick Processing — processed within minutes of upload</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Secure & Confidential — your data is private</li>
              </ul>
            </div>
            <div>
              <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-6 text-center">
                <div className="text-5xl text-blue-400">☁️</div>
                <p className="mt-2 text-gray-700">Drag and drop your prescription here or</p>
                <label className="mt-2 inline-block text-blue-600 font-medium hover:underline cursor-pointer">
                  <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
                  browse files
                </label>
                {file && <div className="mt-2 text-xs text-gray-600">Selected: {file.name}</div>}
                <p className="mt-2 text-xs text-gray-500">Supported formats: JPG, PNG, PDF (Max size: 10MB)</p>
              </div>
              {error && <div className="mt-4 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}
              <div className="mt-4 grid grid-cols-1 gap-3">
                <input className="w-full rounded-lg border-gray-300" placeholder="Medicine Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
                <input className="w-full rounded-lg border-gray-300" placeholder="Prescribing Doctor" value={form.doctor} onChange={e=>setForm(f=>({...f,doctor:e.target.value}))} />
                <input className="w-full rounded-lg border-gray-300" placeholder="RX Number" value={form.rxNumber} onChange={e=>setForm(f=>({...f,rxNumber:e.target.value}))} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" className="w-full rounded-lg border-gray-300" placeholder="Prescribed At" value={form.prescribedAt} onChange={e=>setForm(f=>({...f,prescribedAt:e.target.value}))} />
                  <input type="number" min="0" className="w-full rounded-lg border-gray-300" placeholder="Refills Left" value={form.refillsLeft} onChange={e=>setForm(f=>({...f,refillsLeft:e.target.value}))} />
                </div>
                <input className="w-full rounded-lg border-gray-300" placeholder="Note (optional)" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} />
                <p className="text-xs text-gray-500">Tip: Newly uploaded prescriptions start as Pending while our pharmacists verify details.</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border text-gray-700">Cancel</button>
            <button onClick={submit} disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">{loading ? 'Uploading…' : 'Upload Prescription'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

UploadModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func,
  createPrescription: PropTypes.func.isRequired,
}
