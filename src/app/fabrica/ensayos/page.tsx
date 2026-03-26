'use client';

import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/stat-card';

export default function EnsayosPage() {
  const { currentFabricaId, getEnsayosByFabrica } = useApp();
  const ensayos = getEnsayosByFabrica(currentFabricaId).sort((a, b) => b.fecha_muestra.localeCompare(a.fecha_muestra));

  const ultimo = ensayos[0];
  const diasDesdeUltimo = ultimo
    ? Math.floor((new Date().getTime() - new Date(ultimo.fecha_muestra).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ensayos de Compresión</h1>
        <p className="text-muted-foreground text-sm mt-1">Control de resistencia del hormigón — NCh 1037</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Último ensayo" value={`${diasDesdeUltimo} días`} icon="🧪" accent={diasDesdeUltimo > 30 ? 'red' : 'green'} />
        <StatCard label="Resultado 28d" value={ultimo?.resultado_28d_mpa ? `${ultimo.resultado_28d_mpa} MPa` : '—'} icon="📊" />
        <StatCard label="Total registrados" value={ensayos.length} icon="📋" />
      </div>

      {diasDesdeUltimo > 30 && (
        <div className="p-3 rounded-lg bg-status-red/10 border border-status-red/20 text-sm text-status-red">
          ⚠️ Han transcurrido más de 30 días desde el último ensayo registrado. El PIE establece frecuencia mensual.
        </div>
      )}

      {/* Trend chart placeholder */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-base">Tendencia de Resultados</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <div className="flex items-end gap-3 h-36">
              {ensayos.slice().reverse().map((e, i) => (
                <div key={e.id} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{e.resultado_28d_mpa}</span>
                  <div
                    className="w-10 rounded-t-md transition-all duration-500"
                    style={{
                      height: `${Math.max(20, ((e.resultado_28d_mpa || 25) / 40) * 120)}px`,
                      background: (e.resultado_28d_mpa || 0) >= 25 ? 'var(--status-green)' : 'var(--status-red)',
                      opacity: 0.7 + (i * 0.08),
                    }}
                  />
                  <span className="text-[9px] text-muted-foreground">{e.fecha_muestra.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
            <div className="w-3 h-3 rounded-sm bg-status-green/70" /> Cumple (≥25 MPa)
            <div className="w-3 h-3 rounded-sm bg-status-red/70 ml-3" /> No cumple
          </div>
        </CardContent>
      </Card>

      {/* Ensayos list */}
      <div className="space-y-3">
        {ensayos.map(e => (
          <Card key={e.id} className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{e.fecha_muestra}</span>
                    <Badge variant="outline" className={`text-[10px] ${e.cumple ? 'bg-status-green/10 text-status-green border-status-green/20' : 'bg-status-red/10 text-status-red border-status-red/20'}`}>
                      {e.cumple ? 'Cumple' : 'No cumple'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Tipo: {e.tipo_hormigon}</span>
                    <span>Lab: {e.laboratorio}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm"><span className="text-muted-foreground">7d:</span> <span className="font-medium">{e.resultado_7d_mpa} MPa</span></div>
                  <div className="text-sm"><span className="text-muted-foreground">28d:</span> <span className="font-bold">{e.resultado_28d_mpa} MPa</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
