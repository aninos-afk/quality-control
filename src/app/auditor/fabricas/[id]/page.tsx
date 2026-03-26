'use client';

import { use } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/stat-card';
import { SemaforoResumen } from '@/components/semaforo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default function FabricaDetallePage({ params }: Props) {
  const { id } = use(params);
  const { getFabrica, getCondicionesByFabrica, getJornadasByFabrica, getNCByFabrica, getEnsayosByFabrica } = useApp();
  const fabrica = getFabrica(id);
  const condiciones = getCondicionesByFabrica(id);
  const jornadas = getJornadasByFabrica(id);
  const ncs = getNCByFabrica(id);
  const ensayos = getEnsayosByFabrica(id);

  if (!fabrica) return <div className="text-center py-20 text-muted-foreground">Fábrica no encontrada</div>;

  const vigentes = condiciones.filter(c => c.estado === 'vigente').length;
  const porVencer = condiciones.filter(c => c.estado === 'por_vencer').length;
  const vencidas = condiciones.filter(c => c.estado === 'vencido').length;
  const ncAbiertas = ncs.filter(nc => nc.estado === 'abierta').length;
  const jornadasCerradas = jornadas.filter(j => j.estado === 'cerrada').length;
  const jornadasTotal = jornadas.length;
  const ncPorJornada = jornadasTotal > 0 ? (ncs.length / jornadasTotal).toFixed(2) : '0';

  // Defects distribution
  const defectosDist = ncs.reduce((acc, nc) => {
    acc[nc.tipo_defecto] = (acc[nc.tipo_defecto] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{fabrica.nombre}</h1>
          <p className="text-muted-foreground text-sm mt-1">{fabrica.codigo} — {fabrica.direccion}</p>
        </div>
        <Link href="/auditor"><Button variant="outline" size="sm">← Volver</Button></Link>
      </div>

      {/* Condiciones */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-base">Condiciones Habilitantes</CardTitle></CardHeader>
        <CardContent>
          <SemaforoResumen vigentes={vigentes} porVencer={porVencer} vencidas={vencidas} />
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Jornadas totales" value={jornadasTotal} icon="📅" />
        <StatCard label="Jornadas cerradas" value={jornadasCerradas} icon="✅" detail={`${jornadasTotal > 0 ? Math.round((jornadasCerradas/jornadasTotal)*100) : 0}% completadas`} accent="green" />
        <StatCard label="NC abiertas" value={ncAbiertas} icon="⚠️" accent={ncAbiertas > 0 ? 'red' : 'green'} />
        <StatCard label="NC por jornada" value={ncPorJornada} icon="📊" />
      </div>

      {/* Defects distribution */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-base">Distribución de Defectos</CardTitle></CardHeader>
        <CardContent>
          {Object.keys(defectosDist).length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin no conformidades registradas</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(defectosDist).sort((a, b) => b[1] - a[1]).map(([tipo, count]) => (
                <div key={tipo} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs capitalize">{tipo.replace(/_/g, ' ')}</span>
                      <span className="text-xs font-medium">{count}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted/30">
                      <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${(count / ncs.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ensayos trend */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-base">Ensayos de Compresión</CardTitle></CardHeader>
        <CardContent>
          {ensayos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin ensayos registrados</p>
          ) : (
            <div className="space-y-2">
              {ensayos.sort((a, b) => b.fecha_muestra.localeCompare(a.fecha_muestra)).map(e => (
                <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/10">
                  <span className="text-xs">{e.fecha_muestra}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">7d: {e.resultado_7d_mpa} MPa</span>
                    <span className="text-sm font-medium">28d: {e.resultado_28d_mpa} MPa</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${e.cumple ? 'bg-status-green/15 text-status-green' : 'bg-status-red/15 text-status-red'}`}>
                      {e.cumple ? 'Cumple' : 'No cumple'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
