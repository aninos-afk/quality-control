'use client';

import { use } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/stat-card';
import { SemaforoResumen } from '@/components/semaforo';
import { Semaforo } from '@/components/semaforo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EmpresaDetallePage({ params }: Props) {
  const { id } = use(params);
  const { getEmpresa, getPlantasByEmpresa, getCondicionesByPlanta, getJornadasByPlanta, getNCByPlanta, getEnsayosByPlanta } = useApp();
  const empresa = getEmpresa(id);
  const plantas = getPlantasByEmpresa(id);

  if (!empresa) return <div className="text-center py-20 text-muted-foreground">Empresa no encontrada</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{empresa.nombre}</h1>
          <p className="text-muted-foreground text-sm mt-1">{plantas.length} planta{plantas.length !== 1 ? 's' : ''} registrada{plantas.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/auditor"><Button variant="outline" size="sm">← Volver</Button></Link>
      </div>

      {/* Plants grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plantas.map(planta => {
          const condiciones = getCondicionesByPlanta(planta.id);
          const jornadas = getJornadasByPlanta(planta.id);
          const ncs = getNCByPlanta(planta.id);
          const ensayos = getEnsayosByPlanta(planta.id);

          const vigentes = condiciones.filter(c => c.estado === 'vigente').length;
          const porVencer = condiciones.filter(c => c.estado === 'por_vencer').length;
          const vencidas = condiciones.filter(c => c.estado === 'vencido').length;
          const ncAbiertas = ncs.filter(nc => nc.estado === 'abierta').length;
          const jornadasCerradas = jornadas.filter(j => j.estado === 'cerrada').length;
          const mesActual = new Date().toISOString().slice(0, 7);
          const jornadasMes = jornadas.filter(j => j.fecha.startsWith(mesActual)).length;

          const ultimoEnsayo = ensayos.sort((a, b) => b.fecha_muestra.localeCompare(a.fecha_muestra))[0];
          const diasEnsayo = ultimoEnsayo
            ? Math.floor((Date.now() - new Date(ultimoEnsayo.fecha_muestra).getTime()) / (1000 * 60 * 60 * 24))
            : 999;

          // Defects distribution
          const defectosDist = ncs.reduce((acc, nc) => {
            acc[nc.tipo_defecto] = (acc[nc.tipo_defecto] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          return (
            <Card key={planta.id} className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">🏭</div>
                  <div>
                    <CardTitle className="text-base">{planta.nombre}</CardTitle>
                    <p className="text-xs text-muted-foreground">{planta.codigo} — {planta.direccion}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Condiciones semáforo */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Condiciones Habilitantes</p>
                  <SemaforoResumen vigentes={vigentes} porVencer={porVencer} vencidas={vencidas} />
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/10 border border-border/30">
                    <p className="text-xs text-muted-foreground">Jornadas (mes)</p>
                    <p className="text-lg font-bold">{jornadasMes}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/10 border border-border/30">
                    <p className="text-xs text-muted-foreground">NC abiertas</p>
                    <p className={`text-lg font-bold ${ncAbiertas > 0 ? 'text-status-red' : 'text-status-green'}`}>{ncAbiertas}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/10 border border-border/30">
                    <p className="text-xs text-muted-foreground">Último ensayo</p>
                    <p className={`text-lg font-bold ${diasEnsayo > 30 ? 'text-status-red' : ''}`}>{diasEnsayo < 999 ? `${diasEnsayo}d` : '—'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/10 border border-border/30">
                    <p className="text-xs text-muted-foreground">Cerradas</p>
                    <p className="text-lg font-bold">{jornadasCerradas}/{jornadas.length}</p>
                  </div>
                </div>

                {/* Defects mini-chart */}
                {Object.keys(defectosDist).length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Defectos frecuentes</p>
                    {Object.entries(defectosDist).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([tipo, count]) => (
                      <div key={tipo} className="flex items-center justify-between text-xs py-1">
                        <span className="capitalize text-muted-foreground">{tipo.replace(/_/g, ' ')}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
