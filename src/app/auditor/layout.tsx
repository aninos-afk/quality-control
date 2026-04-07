'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/lib/auth';

const AUDITOR_NAV = [
  { href: '/auditor', label: 'Empresas', icon: '🏢' },
  { href: '/auditor/comparacion', label: 'Comparación', icon: '📈' },
];

export default function AuditorLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (user?.rol !== 'auditor_plataforma' && user?.rol !== 'auditor_externo') {
      router.replace('/fabrica');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || (user?.rol !== 'auditor_plataforma' && user?.rol !== 'auditor_externo')) return null;

  const navItems = user?.rol === 'auditor_externo'
    ? [{ href: '/auditor', label: 'Producción', icon: '📋' }]
    : AUDITOR_NAV;

  const title = user?.rol === 'auditor_externo' ? 'Vista Auditor' : 'Panel Plataforma';

  return (
    <div className="min-h-screen">
      <Sidebar
        title={title}
        items={navItems}
      />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
