import { Sidebar } from '@/components/sidebar';

const FABRICA_NAV = [
  { href: '/fabrica', label: 'Inicio', icon: '📋' },
  { href: '/fabrica/jornadas', label: 'Plan de Inspección', icon: '📅' },
  { href: '/fabrica/no-conformidades', label: 'No Conformidades', icon: '⚠️' },
  { href: '/fabrica/ensayos', label: 'Ensayos', icon: '🧪' },
  { href: '/fabrica/condiciones', label: 'Condiciones', icon: '✅' },
  { href: '/fabrica/configuracion/moldes', label: 'Configuración', icon: '⚙️' },
];

export default function FabricaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar
        title="Planta Temuco"
        items={FABRICA_NAV}
      />
      <main className="ml-64 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
