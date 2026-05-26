'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { EstadoJornadaBadge } from '@/components/estado-badge';
import { JornadaCalendar } from '@/components/jornada-calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DESTINOS_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type ViewMode = 'calendario' | 'lista';

const SIGUIENTE_ACCION: Record<string, { label: string; colorClass: string; bgClass: string; borderClass: string }> = {
  abierta:                { label: 'Verificar fabricación', colorClass: 'text-status-blue',              bgClass: 'bg-status-blue/10',              borderClass: 'border-status-blue/20' },
  fabricacion_verificada: { label: 'Registrar desmolde',   colorClass: 'text-status-yellow',            bgClass: 'bg-status-yellow/10',            borderClass: 'border-status-yellow/20' },
  desmolde_registrado:    { label: 'Inspección PT',        colorClass: 'text-[oklch(0.7_0.15_30)]',     bgClass: 'bg-[oklch(0.7_0.15_30)]/10',    borderClass: 'border-[oklch(0.7_0.15_30)]/20' },
  producto_terminado:     { label: 'Revisar y liberar',    colorClass: 'text-status-green',             bgClass: 'bg-status-green/10',             borderClass: 'border-status-green/20' },
};

function getDiasAgo(fecha: string): string {
  const hoy = new Date().toISOString().slice(0, 10);
  const diff = Math.floor((new Date(hoy).getTime() - new Date(fecha).getTime()) / 86400000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  return `Hace ${diff} días`;
}

export default function JornadasPage() {
  const router = useRouter();
  const { planta, can } = useAuth();
  const { getJornadasByPlanta, getDespachosByPlanta, updateJornada, productoTerminado, usuarios } = useApp();
  const jornadas = getJornadasByPlanta(planta?.id || '').sort((a, b) => b.fecha.localeCompare(a.fecha));
  const despachos = getDespachosByPlanta(planta?.id || '');
  const [view, setView] = useState<ViewMode>('calendario');
  const canToggleVis = can('toggle_visible_externo');
  const [bannerExpanded, setBannerExpanded] = useState(false);
  const [bannerShowAll, setBannerShowAll] = useState(false);

  // Lotes con acción pendiente (no cerrados), ordenados por fecha ascendente (más antigua = más urgente)
  const pendientes = useMemo(() =>
    jornadas.filter(j => j.estado !== 'cerrada').sort((a, b) => a.fecha.localeCompare(b.fecha)),
    [jornadas]
  );

  // Conteo por tipo de acción para el resumen compacto
  const pendientesPorAccion = useMemo(() => {
    const counts: Record<string, number> = {};
    pendientes.forEach(j => {
      const accion = SIGUIENTE_ACCION[j.estado];
      if (accion) counts[accion.label] = (counts[accion.label] || 0) + 1;
    });
    return counts;
  }, [pendientes]);

  // Jornadas en estado producto_terminado con hallazgos pendientes
  const hallazgosSet = useMemo(() => {
    const set = new Set<string>();
    jornadas.filter(j => j.estado === 'producto_terminado').forEach(j => {
      const pt = productoTerminado.find(p => p.jornada_id === j.id);
      if (pt && (pt.nc_detectadas || pt.resultado === 'no_conforme')) set.add(j.id);
    });
    return set;
  }, [jornadas, productoTerminado]);

  const visiblePendientes = bannerShowAll ? pendientes : pendientes.slice(0, 2);
  const hiddenCount = pendientes.length - 2;

  return (
    <div className="space-y-6">

      {/* Banner compacto de lotes pendientes (A+B) */}
      {pendientes.length > 0 && (
        <div className="rounded-xl border border-border/40 bg-card/40 overflow-hidden">
          {/* Línea compacta de resumen — siempre visible */}
          <button
            onClick={() => setBannerExpanded(prev => !prev)}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-muted/10 transition-colors text-left"
          >
            <span className="text-sm">📌</span>
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              {Object.entries(pendientesPorAccion).map(([label, count]) => {
                const entry = Object.values(SIGUIENTE_ACCION).find(a => a.label === label);
                return (
                  <span key={label} className={`text-xs px-2 py-0.5 rounded-md border font-medium ${entry?.bgClass || ''} ${entry?.colorClass || ''} ${entry?.borderClass || ''}`}>
                    {count} {label.toLowerCase()}
                  </span>
                );
              })}
            </div>
            <span className={cn(
              'text-muted-foreground/50 text-xs transition-transform duration-200',
              bannerExpanded && 'rotate-180'
            )}>▾</span>
          </button>

          {/* Detalle expandible — los 2 más urgentes + "ver más" */}
          {bannerExpanded && (
            <div className="border-t border-border/30 divide-y divide-border/20">
              {visiblePendientes.map(j => {
                const accion = SIGUIENTE_ACCION[j.estado];
                if (!accion) return null;
                return (
                  <button
                    key={j.id}
                    onClick={() => router.push(`/fabrica/jornadas/${j.id}`)}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted/20 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-foreground/80">{j.codigo}</span>
                      <span className="text-xs text-muted-foreground">{getDiasAgo(j.fecha)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${accion.bgClass} ${accion.colorClass} ${accion.borderClass}`}>
                        {accion.label}
                      </span>
                      {hallazgosSet.has(j.id) && (
                        <span className="text-xs text-status-yellow">⚠️ Hallazgos</span>
                      )}
                    </div>
                    <span className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors text-sm">→</span>
                  </button>
                );
              })}
              {!bannerShowAll && hiddenCount > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setBannerShowAll(true); }}
                  className="w-full px-4 py-2 text-xs text-muted-foreground hover:text-foreground/70 transition-colors text-left"
                >
                  ▾ Ver {hiddenCount} más...
                </button>
              )}
              {bannerShowAll && hiddenCount > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setBannerShowAll(false); }}
                  className="w-full px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground/70 transition-colors text-left"
                >
                  ▴ Mostrar menos
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plan de Inspección</h1>
          <p className="text-muted-foreground text-sm mt-1">{jornadas.length} inspecciones registradas</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border border-border/50 overflow-hidden">
            <button
              onClick={() => setView('calendario')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium transition-colors',
                view === 'calendario' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/30'
              )}
            >
              📅 Calendario
            </button>
            <button
              onClick={() => setView('lista')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium transition-colors',
                view === 'lista' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/30'
              )}
            >
              📋 Lista
            </button>
          </div>
          <Link href="/fabrica/jornadas/nueva">
            <Button>+ Nueva jornada</Button>
          </Link>
        </div>
      </div>

      {view === 'calendario' ? (
        <JornadaCalendar
          jornadas={jornadas}
          despachos={despachos}
          onDespachoClick={(d) => router.push(`/fabrica/despachos/${d.id}`)}
          usuarios={usuarios}
          onDayClick={(jornada) => router.push(`/fabrica/jornadas/${jornada.id}`)}
          canToggleVisibility={canToggleVis}
          onToggleVisibility={(id, nuevoEstado) => updateJornada(id, { visible_externo: nuevoEstado })}
          jornadasConHallazgos={hallazgosSet}
        />
      ) : (
        <div className="space-y-3">
          {jornadas.map(j => (
            <Link key={j.id} href={`/fabrica/jornadas/${j.id}`}>
              <Card className="bg-card/50 border-border/50 hover:bg-muted/20 transition-all duration-200 cursor-pointer mb-3">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg">📅</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold">{j.codigo}</span>
                          <EstadoJornadaBadge estado={j.estado} />
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{j.fecha}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{DESTINOS_LABELS[j.destino]}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{j.tipos_poste.join(', ')}</span>
                          {j.created_by && (() => {
                            const u = usuarios.find(u => u.id === j.created_by);
                            return u ? (
                              <><span className="text-xs text-muted-foreground">•</span><span className="text-[10px] text-muted-foreground/50 italic">por {u.nombre}</span></>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    </div>
                    <span className="text-muted-foreground text-sm">→</span>
                  </div>
                  {j.alertas && j.alertas.length > 0 && (
                    <div className="mt-3 px-3 py-2 rounded-lg bg-status-yellow/10 border border-status-yellow/20">
                      <p className="text-xs text-status-yellow">{j.alertas[0]}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
