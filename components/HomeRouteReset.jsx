"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { resetFullPageState } from "@/lib/fullpage-reset";

export default function HomeRouteReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      resetFullPageState(window, document);
    }
  }, [pathname]);

  return null;
}
