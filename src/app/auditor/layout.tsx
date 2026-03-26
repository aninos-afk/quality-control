import { Sidebar } from '@/components/sidebar';

const AUDITOR_NAV = [
  { href: '/auditor', label: 'Resumen General', icon: '📊' },
  { href: '/auditor/fabricas', label: 'Fábricas', icon: '🏭' },
  { href: '/auditor/comparacion', label: 'Comparación', icon: '📈' },
];

export default function AuditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar
        title="Panel Auditor"
        subtitle="Grupo SAESA"
        items={AUDITOR_NAV}
      />
      <main className="ml-64 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
