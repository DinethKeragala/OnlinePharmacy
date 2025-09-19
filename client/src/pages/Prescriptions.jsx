import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import { FaClipboardList, FaClock, FaUpload, FaSyncAlt } from 'react-icons/fa'
import { fetchPrescriptions, requestRefill, createPrescription } from '../services/prescriptions'

function formatDate(d) {
  if (!d) return ''
  try { return new Date(d).toISOString().slice(0,10) } catch { return '' }
}

function StatCard({ icon: Icon, title, value, subtitle, action }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Icon /></div>
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{value}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
      </div>
      {action}
    </div>
  )
}

function StatusPill({ text, color = 'green' }) {
  const palette = {
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700',
    gray: 'bg-gray-100 text-gray-700',
  }[color]
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${palette}`}>{text}</span>
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium border-b-2 ${active ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
    >
      {children}
    </button>
  )
}

function UploadModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', doctor: '', rxNumber: '', prescribedAt: '', refillsLeft: 0, note: '' })
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
      }
      const created = await createPrescription(payload)
      onCreated?.(created)
      onClose()
      setForm({ name: '', doctor: '', rxNumber: '', prescribedAt: '', refillsLeft: 0, note: '' })
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
                <button className="mt-2 text-blue-600 font-medium hover:underline">browse files</button>
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

const Prescriptions = () => {
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Prescriptions', path: null },
  ]

  const [tab, setTab] = useState('active')
  const [openUpload, setOpenUpload] = useState(false)
  const [active, setActive] = useState([])
  const [pending, setPending] = useState([])
  const [expired, setExpired] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([
      fetchPrescriptions('active'),
      fetchPrescriptions('pending'),
      fetchPrescriptions('expired'),
    ]).then(([a,p,e])=>{
      if (!mounted) return
      setActive(a)
      setPending(p)
      setExpired(e)
    }).catch(err=>{
      if (!mounted) return
      setError(err.message || 'Failed to load prescriptions')
    }).finally(()=>{
      if (mounted) setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  const { list } = useMemo(() => {
    if (tab === 'active') return { list: active }
    if (tab === 'pending') return { list: pending }
    return { list: expired }
  }, [tab, active, pending, expired])

  return (
    <div>
      <PageHeader title="Prescriptions" breadcrumbs={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={FaClipboardList} title="Active Prescriptions" value={active.length} subtitle="Currently active medications" />
          <StatCard icon={FaClock} title="Pending Refills" value={pending.length} subtitle="Awaiting approval" />
          <StatCard
            icon={FaUpload}
            title="Upload New"
            value=""
            subtitle=" "
            action={
              <button onClick={() => setOpenUpload(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white">
                <FaUpload /> Upload Prescription
              </button>
            }
          />
        </div>

        {/* Tabs */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-4 border-b flex gap-6">
            <TabButton active={tab === 'active'} onClick={() => setTab('active')}>Active Prescriptions</TabButton>
            <TabButton active={tab === 'pending'} onClick={() => setTab('pending')}>Pending</TabButton>
            <TabButton active={tab === 'expired'} onClick={() => setTab('expired')}>Expired</TabButton>
          </div>

          <div className="p-4 space-y-6">
            {error && <div className="rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{error} — Please sign in to manage prescriptions.</div>}
            {loading && <div className="text-gray-600">Loading prescriptions…</div>}
            {!loading && list.length === 0 && (
              <div className="text-gray-600">No {tab} prescriptions found.</div>
            )}
            {!loading && tab === 'active' && list.map((rx) => (
              <div key={rx._id} className="flex items-start justify-between gap-4 p-4 rounded-xl border bg-white">
                <div>
                  <div className="font-semibold text-gray-900">{rx.name} <StatusPill text="Active" color="green" /></div>
                  <div className="mt-1 text-sm text-gray-600">Prescription # {rx.rxNumber} &nbsp; Prescribed by &nbsp; {rx.doctor} &nbsp; on &nbsp; {formatDate(rx.prescribedAt)}</div>
                  <div className="mt-3 text-sm text-gray-700">Next refill available on &nbsp; <span className="font-medium">{formatDate(rx.nextRefillAt)}</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-16 rounded-lg bg-blue-50 text-blue-700 flex flex-col items-center justify-center text-sm">
                    <div className="text-xs text-gray-600">Refills Left</div>
                    <div className="text-xl font-bold">{rx.refillsLeft ?? 0}</div>
                  </div>
                  <button onClick={() => requestRefill(rx._id).then(updated=>{
                    setActive(curr => curr.map(it => it._id === updated._id ? updated : it))
                  }).catch(err=>setError(err.message))} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"><FaSyncAlt /> Request Refill</button>
                  <button className="text-blue-600 font-medium">View Details →</button>
                </div>
              </div>
            ))}

            {!loading && tab === 'pending' && list.map((rx) => (
              <div key={rx._id} className="flex items-start justify-between gap-4 p-4 rounded-xl border bg-white">
                <div>
                  <div className="font-semibold text-gray-900">{rx.name} <StatusPill text="Pending" color="yellow" /></div>
                  <div className="mt-1 text-sm text-gray-600">Prescription # {rx.rxNumber} &nbsp; Prescribed by &nbsp; {rx.doctor} &nbsp; on &nbsp; {formatDate(rx.prescribedAt)}</div>
                  <div className="mt-3 text-sm text-yellow-700">{rx.note}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-blue-600 font-medium">View Details →</button>
                </div>
              </div>
            ))}

            {!loading && tab === 'expired' && list.map((rx) => (
              <div key={rx._id} className="flex items-start justify-between gap-4 p-4 rounded-xl border bg-white">
                <div>
                  <div className="font-semibold text-gray-900">{rx.name} <StatusPill text="Expired" color="red" /></div>
                  <div className="mt-1 text-sm text-gray-600">Prescription # {rx.rxNumber} &nbsp; Prescribed by &nbsp; {rx.doctor} &nbsp; on &nbsp; {formatDate(rx.prescribedAt)}</div>
                  <div className="mt-3 text-sm text-red-700">Expired on &nbsp; <span className="font-medium">{formatDate(rx.expiredAt)}</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-800">Contact Doctor</button>
                  <button className="text-blue-600 font-medium">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <UploadModal open={openUpload} onClose={() => setOpenUpload(false)} onCreated={(created)=>{
        if (created.status === 'active') setActive(a => [created, ...a])
        else if (created.status === 'pending') setPending(p => [created, ...p])
        else setExpired(e => [created, ...e])
      }} />
    </div>
  )
}

export default Prescriptions