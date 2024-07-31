import { useState, useEffect } from "react";

export default function useOptimizeAB() {
  const [variant, setVariant] = useState<number>(0);

  useEffect(() => {
    window.dataLayer.push({ event: "optimize.activate" });
    let interval = setInterval(() => {
      if ((window as any).google_optimize !== undefined) {
        const variant = (window as any).google_optimize.get(
          "zf-wWCytQJKbNl5tcG0V1w"
        );
        if (typeof variant !== "undefined") setVariant(Number(variant));
        clearInterval(interval);
      }
    }, 100);
  }, []);
  return variant;
}
