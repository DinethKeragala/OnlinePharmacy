import { useContext } from 'react'
import { ToastCtx } from './ToastProvider'

export function useToast() {
  return useContext(ToastCtx)
}

export default useToast
