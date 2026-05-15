'use client';

import { useEffect, useState } from 'react';

// ─── Inline script to prevent flash of wrong theme ──────
// This runs BEFORE React hydration, reading localStorage and applying the class
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('qc_theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `,
      }}
    />
  );
}

// ─── Toggle hook ─────────────────────────────────────────
export function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('qc_theme');
    if (stored) {
      setIsDark(stored === 'dark');
    } else {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('qc_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('qc_theme', 'light');
    }
  };

  return { isDark, toggle };
}

// ─── Visual toggle button ────────────────────────────────
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { isDark, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (compact) {
    return (
      <button
        onClick={toggle}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all duration-200 hover:bg-sidebar-accent/50"
        title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
    >
      <span className="text-base">{isDark ? '☀️' : '🌙'}</span>
      <span>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  );
}
