import { useContext } from "react"

import ToastContext from "src/context/ToastContext"

export default function useToast() {
  return useContext(ToastContext)
}
