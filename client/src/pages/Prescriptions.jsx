import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import PageHeader from '../components/common/PageHeader'
import { FaClipboardList, FaClock, FaUpload, FaSyncAlt } from 'react-icons/fa'
import { fetchPrescriptions, requestRefill, createPrescription } from '../services/prescriptions'
import StatCard from '../components/prescriptions/StatCard'
import StatusPill from '../components/prescriptions/StatusPill'
import UploadModal from '../components/prescriptions/UploadModal'
import TabButton from '../components/prescriptions/TabButton'

function formatDate(d) {
  if (!d) return ''
  try { return new Date(d).toISOString().slice(0,10) } catch { return '' }
}

// TabButton moved to components/prescriptions/TabButton

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
    const load = async () => {
      setLoading(true)
      try {
        const [a, p, e] = await Promise.all([
          fetchPrescriptions('active'),
          fetchPrescriptions('pending'),
          fetchPrescriptions('expired'),
        ])
        if (!mounted) return
        setActive(a)
        setPending(p)
        setExpired(e)
      } catch (err) {
        if (!mounted) return
        setError(err.message || 'Failed to load prescriptions')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleRequestRefill = async (id) => {
    try {
      const updated = await requestRefill(id)
      setActive(curr => curr.map(it => (it._id === updated._id ? updated : it)))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCreatedPrescription = (created) => {
    if (created.status === 'active') {
      setActive(a => [created, ...a])
    } else if (created.status === 'pending') {
      setPending(p => [created, ...p])
    } else {
      setExpired(e => [created, ...e])
    }
  }

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
          <StatCard icon={<FaClipboardList />} title="Active Prescriptions" value={active.length} subtitle="Currently active medications" />
          <StatCard icon={<FaClock />} title="Pending Refills" value={pending.length} subtitle="Awaiting approval" />
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
                  <button onClick={() => handleRequestRefill(rx._id)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"><FaSyncAlt /> Request Refill</button>
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

      <UploadModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onCreated={handleCreatedPrescription}
        createPrescription={createPrescription}
      />
    </div>
  )
}

export default Prescriptions