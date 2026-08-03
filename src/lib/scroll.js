import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** After all section hooks mount, sort triggers top→bottom and refresh pin math. */
export function useScrollRefresh() {
  useEffect(() => {
    const run = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    run();
    const times = [120, 500, 1200].map((ms) => setTimeout(run, ms));
    window.addEventListener("load", run);
    return () => {
      times.forEach(clearTimeout);
      window.removeEventListener("load", run);
    };
  }, []);
}
