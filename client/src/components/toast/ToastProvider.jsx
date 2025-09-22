/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

export const ToastCtx = createContext({ show: () => {} })

let idSeq = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((arr) => arr.filter((t) => t.id !== id))
  }, [])

  const show = useCallback((message, opts = {}) => {
    const id = idSeq++
    const toast = { id, message, type: opts.type || 'info', duration: opts.duration ?? 2000 }
    setToasts((arr) => [...arr, toast])
    if (toast.duration > 0) {
      setTimeout(() => remove(id), toast.duration)
    }
  }, [remove])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed z-[1000] top-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`min-w-[220px] max-w-sm shadow-md rounded-lg border text-sm px-4 py-3 bg-white ${t.type==='success'?'border-green-300':'border-gray-200'}`}>
            <div className="flex items-start gap-2">
              <span>{t.type==='success'?'✅':'ℹ️'}</span>
              <div className="text-gray-800">{t.message}</div>
              <button className="ml-auto text-gray-400 hover:text-gray-600" onClick={() => remove(t.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

ToastProvider.propTypes = {
  children: PropTypes.node,
}

// Note: useToast is exported from a separate file (useToast.js) to keep this file
// exporting only a component for better React Fast Refresh compatibility.
