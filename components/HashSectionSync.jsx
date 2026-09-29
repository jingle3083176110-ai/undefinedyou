"use client";

import { useEffect } from "react";
import { useFullPage } from "@alvalens/react-fullpage-snap";
import { isBrowserZoomed } from "@/lib/fullpage-scroll";

/**
 * The full-page library reads the URL hash before its sections have mounted
 * on a fresh navigation. Retry once the complete section list is available.
 */
export default function HashSectionSync() {
  const { anchors, moveTo, totalSections } = useFullPage();
  const homeAnchors = ["home", "about", "projects", "writing", "journal", "contact"];

  useEffect(() => {
    const targetAnchors = anchors.length ? anchors : homeAnchors;
    const moveToHash = () => {
      const anchor = window.location.hash.slice(1);
      if (!anchor || !targetAnchors.includes(anchor) || totalSections < targetAnchors.length) return;

      if (isBrowserZoomed({ scale: window.visualViewport?.scale, innerWidth: window.innerWidth, outerWidth: window.outerWidth })) {
        const index = targetAnchors.indexOf(anchor);
        window.requestAnimationFrame(() => {
          document.querySelectorAll(".section")[index]?.scrollIntoView({ behavior: "auto", block: "start" });
        });
        return;
      }

      window.requestAnimationFrame(() => moveTo(anchor));
    };

    moveToHash();
    window.addEventListener("hashchange", moveToHash);
    return () => window.removeEventListener("hashchange", moveToHash);
  }, [anchors, moveTo, totalSections]);

  return null;
}
