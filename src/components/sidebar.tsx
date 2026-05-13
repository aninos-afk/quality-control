'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth, ROL_LABELS } from '@/lib/auth';
import { useState } from 'react';
import Image from 'next/image';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  title: string;
  subtitle?: string;
  items: NavItem[];
}

export function Sidebar({ title, subtitle, items }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, empresa, planta, plantasDisponibles, switchPlanta, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const displayTitle = (user?.rol === 'auditor_plataforma' || user?.rol === 'auditor_externo')
    ? (user?.rol === 'auditor_externo' ? 'Vista Auditor' : 'Panel Plataforma')
    : planta?.nombre || empresa?.nombre || title;

  const displaySubtitle = (user?.rol === 'auditor_plataforma' || user?.rol === 'auditor_externo')
    ? undefined
    : user?.rol === 'encargado_calidad'
      ? empresa?.nombre
      : subtitle;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-lg bg-sidebar border border-sidebar-border flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <span className="text-lg">{mobileOpen ? '✕' : '☰'}</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-40 h-screen w-64 flex flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Header */}
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Image
              src="/grupo-saesa.png"
              alt="Grupo SAESA"
              width={120}
              height={36}
              className="h-7 w-auto object-contain opacity-90"
              priority
            />
          </div>
          <div className="mt-3">
            <h2 className="text-sm font-semibold text-sidebar-foreground truncate">{displayTitle}</h2>
            {displaySubtitle && <p className="text-xs text-muted-foreground truncate">{displaySubtitle}</p>}
          </div>

          {/* Plant switcher for encargado_calidad */}
          {user?.rol === 'encargado_calidad' && plantasDisponibles.length > 1 && (
            <div className="mt-3">
              <select
                value={planta?.id || ''}
                onChange={e => switchPlanta(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-sidebar-accent/30 border border-sidebar-border text-sm text-sidebar-foreground cursor-pointer"
              >
                {plantasDisponibles.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} ({p.codigo})</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/fabrica' && item.href !== '/auditor' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info & logout */}
        <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
          {user && (
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.nombre}</p>
              <p className="text-xs text-muted-foreground">{ROL_LABELS[user.rol]}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
          >
            <span className="text-xs">←</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
