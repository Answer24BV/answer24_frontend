"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";

export function useHideSomethingOnRoute(route: string) {
  const router = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (router === route) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, [router, route]);

  return hidden;
}
