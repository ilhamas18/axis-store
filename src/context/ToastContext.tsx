import React, { useCallback, useState, createContext } from "react";

type ToastFunction = (toas: any, color: any) => void;

const ToastContext = createContext<ToastFunction | null>(null);

export default ToastContext;

export function ToastContextProvider({ children }: any) {
  const [toast, setToast] = useState("");
  const [toastColor, setToastColor] = useState("");

  const addToast: ToastFunction = useCallback(
    (toas, color) => {
      setToast(toas);
      setToastColor(color);
      setTimeout(() => {
        setToast("");
      }, 4000);
    },
    [setToast]
  );

  return (
    <ToastContext.Provider value={addToast}>
      {toast ? (
        <div className={`flex items-center justify-center info-toast ${toast ? "show" : ""}`}>
          <div className="container-sm position-relative">
            <div className={`box ${toastColor}`}>
              <div className="content">{toast}</div>
            </div>
          </div>
        </div>
      ) : null}
      {children}
    </ToastContext.Provider>
  );
}
