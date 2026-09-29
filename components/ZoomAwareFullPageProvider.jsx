"use client";

import { useEffect, useState } from "react";
import { FullPageProvider } from "@alvalens/react-fullpage-snap";
import { isBrowserZoomed } from "@/lib/fullpage-scroll";

export default function ZoomAwareFullPageProvider({ children, ...props }) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const update = () => setZoomed(isBrowserZoomed({ scale: window.visualViewport?.scale, innerWidth: window.innerWidth, outerWidth: window.outerWidth }));
    update();
    window.visualViewport?.addEventListener("resize", update);
    return () => window.visualViewport?.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("browser-zoomed", zoomed);
    document.body.classList.toggle("browser-zoomed", zoomed);
    return () => {
      document.documentElement.classList.remove("browser-zoomed");
      document.body.classList.remove("browser-zoomed");
    };
  }, [zoomed]);

  return (
    <FullPageProvider
      {...props}
      anchors={zoomed ? [] : props.anchors}
      keyboardScrolling={!zoomed}
      touchScrolling={!zoomed}
      wheelScrolling={false}
    >
      {children}
    </FullPageProvider>
  );
}
