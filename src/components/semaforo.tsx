import { cn } from '@/lib/utils';
import type { EstadoCondicion } from '@/lib/types';

interface SemaforoProps {
  estado: EstadoCondicion;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const labels: Record<EstadoCondicion, string> = {
  vigente: 'Vigente',
  por_vencer: 'Por vencer',
  vencido: 'Vencido',
};

export function Semaforo({ estado, size = 'md', showLabel = false }: SemaforoProps) {
  const sizes = { sm: 'w-2.5 h-2.5', md: 'w-3.5 h-3.5', lg: 'w-5 h-5' };
  const colors: Record<EstadoCondicion, string> = {
    vigente: 'bg-status-green shadow-[0_0_8px_var(--status-green)]',
    por_vencer: 'bg-status-yellow shadow-[0_0_8px_var(--status-yellow)]',
    vencido: 'bg-status-red shadow-[0_0_8px_var(--status-red)]',
  };

  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn('rounded-full', sizes[size], colors[estado])} />
      {showLabel && <span className="text-sm">{labels[estado]}</span>}
    </span>
  );
}

interface SemaforoResumenProps {
  vigentes: number;
  porVencer: number;
  vencidas: number;
}

export function SemaforoResumen({ vigentes, porVencer, vencidas }: SemaforoResumenProps) {
  const total = vigentes + porVencer + vencidas;
  const overall: EstadoCondicion = vencidas > 0 ? 'vencido' : porVencer > 0 ? 'por_vencer' : 'vigente';
  const overallLabel = vencidas > 0 ? `${vencidas} vencida${vencidas > 1 ? 's' : ''}` : porVencer > 0 ? `${porVencer} por vencer` : 'Todo OK';

  return (
    <div className="flex items-center gap-3">
      <Semaforo estado={overall} size="lg" />
      <div>
        <span className="text-sm font-medium">{overallLabel}</span>
        <span className="text-xs text-muted-foreground ml-2">({total} condiciones)</span>
      </div>
    </div>
  );
}
