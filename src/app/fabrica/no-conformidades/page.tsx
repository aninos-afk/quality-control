'use client';

import { useApp } from '@/lib/store';
import { EstadoNCBadge } from '@/components/estado-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TIPOS_DEFECTO, DISPOSICIONES_PNC } from '@/lib/constants';

export default function NoConformidadesPage() {
  const { currentFabricaId, getNCByFabrica } = useApp();
  const ncs = getNCByFabrica(currentFabricaId).sort((a, b) => b.fecha_deteccion.localeCompare(a.fecha_deteccion));
  const ncAbiertas = ncs.filter(nc => nc.estado === 'abierta');
  const ncCerradas = ncs.filter(nc => nc.estado === 'cerrada');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">No Conformidades</h1>
        <p className="text-muted-foreground text-sm mt-1">{ncAbiertas.length} abiertas · {ncCerradas.length} cerradas</p>
      </div>

      {/* Summary */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-red/10 border border-status-red/20">
          <span className="text-sm font-bold text-status-red">{ncAbiertas.length}</span>
          <span className="text-xs text-status-red">Abiertas</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-green/10 border border-status-green/20">
          <span className="text-sm font-bold text-status-green">{ncCerradas.length}</span>
          <span className="text-xs text-status-green">Cerradas</span>
        </div>
      </div>

      {/* NC list */}
      <div className="space-y-3">
        {ncs.map(nc => {
          const tipoLabel = TIPOS_DEFECTO.find(t => t.value === nc.tipo_defecto)?.label || nc.tipo_defecto;
          const dispLabel = nc.disposicion ? DISPOSICIONES_PNC.find(d => d.value === nc.disposicion)?.label : 'Sin disposición';
          const origenLabels: Record<string, string> = {
            verificacion_fabricacion: 'Verificación',
            desmolde: 'Desmolde',
            producto_terminado: 'Producto terminado',
            manual: 'Manual',
          };

          return (
            <Card key={nc.id} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{nc.numero}</span>
                      <EstadoNCBadge estado={nc.estado} />
                      <Badge variant="outline" className="text-[10px]">{origenLabels[nc.origen]}</Badge>
                    </div>
                    <p className="text-sm">{tipoLabel}</p>
                    {nc.detalle && <p className="text-xs text-muted-foreground">{nc.detalle}</p>}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{nc.fecha_deteccion}</span>
                      {nc.tipo_poste && <span>Poste: {nc.tipo_poste}</span>}
                      {nc.ancho_fisura_mm && <span>Fisura: {nc.ancho_fisura_mm} mm</span>}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs text-muted-foreground">{dispLabel}</p>
                    {nc.apto_saesa !== undefined && (
                      <Badge variant="outline" className={nc.apto_saesa ? 'bg-status-green/10 text-status-green border-status-green/20 text-[10px]' : 'bg-status-red/10 text-status-red border-status-red/20 text-[10px]'}>
                        {nc.apto_saesa ? 'Apto SAESA' : 'NO APTO SAESA'}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
