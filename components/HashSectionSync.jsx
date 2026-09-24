"use client";

import { useEffect } from "react";
import { useFullPage } from "@alvalens/react-fullpage-snap";

/**
 * The full-page library reads the URL hash before its sections have mounted
 * on a fresh navigation. Retry once the complete section list is available.
 */
export default function HashSectionSync() {
  const { anchors, moveTo, totalSections } = useFullPage();

  useEffect(() => {
    const moveToHash = () => {
      const anchor = window.location.hash.slice(1);
      if (!anchor || !anchors.includes(anchor) || totalSections < anchors.length) return;

      window.requestAnimationFrame(() => moveTo(anchor));
    };

    moveToHash();
    window.addEventListener("hashchange", moveToHash);
    return () => window.removeEventListener("hashchange", moveToHash);
  }, [anchors, moveTo, totalSections]);

  return null;
}
