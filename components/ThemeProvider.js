"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Global Theme Provider
 * Provides unified theme management across dark, light, and system themes
 * without unmounting child trees or dropping WebGL/3D contexts.
 */
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
