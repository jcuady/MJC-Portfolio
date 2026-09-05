import { createContext, useCallback, useContext, useMemo, useState } from "react";
import CertModal from "../components/CertModal.jsx";

const CertViewerContext = createContext(null);

export function CertViewerProvider({ children }) {
  const [active, setActive] = useState(null);

  const openCert = useCallback((cert) => {
    if (!cert) return;
    setActive(cert);
  }, []);

  const closeCert = useCallback(() => setActive(null), []);

  const value = useMemo(
    () => ({ openCert, closeCert, active }),
    [openCert, closeCert, active]
  );

  return (
    <CertViewerContext.Provider value={value}>
      {children}
      <CertModal cert={active} onClose={closeCert} />
    </CertViewerContext.Provider>
  );
}

export function useCertViewer() {
  const ctx = useContext(CertViewerContext);
  if (!ctx) {
    throw new Error("useCertViewer must be used within CertViewerProvider");
  }
  return ctx;
}
