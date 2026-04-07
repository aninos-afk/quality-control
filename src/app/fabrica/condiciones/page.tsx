'use client';

import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Semaforo } from '@/components/semaforo';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TIPOS_CONDICION } from '@/lib/constants';

export default function CondicionesPage() {
  const { planta } = useAuth();
  const { getCondicionesByPlanta } = useApp();
  const condiciones = getCondicionesByPlanta(planta?.id || '');

  const grouped = TIPOS_CONDICION.map(tipo => ({
    ...tipo,
    items: condiciones.filter(c => c.tipo === tipo.value),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Condiciones Habilitantes</h1>
        <p className="text-muted-foreground text-sm mt-1">Estado de vigencia de certificados, calibraciones, mantenciones y capacitaciones</p>
      </div>

      {/* Summary bar */}
      <div className="flex gap-4 flex-wrap">
        {(['vigente', 'por_vencer', 'vencido'] as const).map(estado => {
          const count = condiciones.filter(c => c.estado === estado).length;
          const labels = { vigente: 'Vigentes', por_vencer: 'Por vencer', vencido: 'Vencidas' };
          return (
            <div key={estado} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border/50">
              <Semaforo estado={estado} size="sm" />
              <span className="text-sm font-medium">{count}</span>
              <span className="text-xs text-muted-foreground">{labels[estado]}</span>
            </div>
          );
        })}
      </div>

      {/* Grouped list */}
      {grouped.map(group => (
        <div key={group.value} className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{group.label}</h2>
          {group.items.length === 0 ? (
            <p className="text-sm text-muted-foreground/50 py-2">Sin registros</p>
          ) : (
            group.items.map(cond => (
              <Card key={cond.id} className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Semaforo estado={cond.estado} size="md" />
                      <div>
                        <p className="text-sm font-medium">{cond.descripcion}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {cond.norma_referencia && <Badge variant="outline" className="text-[10px]">{cond.norma_referencia}</Badge>}
                          {cond.frecuencia_descripcion && <span className="text-xs text-muted-foreground">{cond.frecuencia_descripcion}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {cond.fecha_vencimiento && (
                        <p className="text-xs text-muted-foreground">Vence: {cond.fecha_vencimiento}</p>
                      )}
                      {cond.entidad_emisora && (
                        <p className="text-[10px] text-muted-foreground/60">{cond.entidad_emisora}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
