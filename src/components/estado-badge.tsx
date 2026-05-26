import { Badge } from '@/components/ui/badge';
import type { EstadoJornada, EstadoNC } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ESTADOS_JORNADA_LABELS } from '@/lib/constants';

interface EstadoBadgeProps {
  estado: EstadoJornada;
}

const jornadaColors: Record<EstadoJornada, string> = {
  abierta: 'bg-status-blue/15 text-status-blue border-status-blue/30',
  fabricacion_verificada: 'bg-status-yellow/15 text-status-yellow border-status-yellow/30',
  desmolde_registrado: 'bg-[oklch(0.7_0.15_30)]/15 text-[oklch(0.7_0.15_30)] border-[oklch(0.7_0.15_30)]/30',
  producto_terminado: 'bg-status-green/15 text-status-green border-status-green/30',
  cerrada: 'bg-muted text-muted-foreground border-muted',
};

export function EstadoJornadaBadge({ estado }: EstadoBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium', jornadaColors[estado])}>
      {ESTADOS_JORNADA_LABELS[estado]}
    </Badge>
  );
}

interface EstadoNCBadgeProps {
  estado: EstadoNC;
}

export function EstadoNCBadge({ estado }: EstadoNCBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium',
        estado === 'abierta'
          ? 'bg-status-red/15 text-status-red border-status-red/30'
          : 'bg-status-green/15 text-status-green border-status-green/30'
      )}
    >
      {estado === 'abierta' ? 'Abierta' : 'Cerrada'}
    </Badge>
  );
}
