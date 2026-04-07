'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/lib/auth';

const NAV_FULL = [
  { href: '/fabrica', label: 'Inspecciones', icon: '📋' },
  { href: '/fabrica/jornadas', label: 'Plan de Inspección', icon: '📅' },
  { href: '/fabrica/no-conformidades', label: 'No Conformidades', icon: '⚠️' },
  { href: '/fabrica/ensayos', label: 'Ensayos', icon: '🧪' },
  { href: '/fabrica/condiciones', label: 'Condiciones', icon: '✅' },
  { href: '/fabrica/configuracion/moldes', label: 'Configuración', icon: '⚙️' },
];

const NAV_PATIO = [
  { href: '/fabrica/jornadas', label: 'Registro Diario', icon: '📅' },
  { href: '/fabrica', label: 'Inspecciones', icon: '📋' },
];

export default function FabricaLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, planta } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (user?.rol === 'auditor_externo' || user?.rol === 'auditor_plataforma') {
      router.replace('/auditor');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) return null;
  if (!isAuthenticated || user?.rol === 'auditor_externo' || user?.rol === 'auditor_plataforma') return null;

  const navItems = user?.rol === 'encargado_patio' ? NAV_PATIO : NAV_FULL;

  return (
    <div className="min-h-screen">
      <Sidebar
        title={planta?.nombre || 'Planta'}
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
