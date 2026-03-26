'use client';

import { useApp } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Semaforo } from '@/components/semaforo';
import Link from 'next/link';

export default function AuditorDashboard() {
  const { fabricas, getCondicionesByFabrica, getJornadasByFabrica, getNCByFabrica, getEnsayosByFabrica } = useApp();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Panel del Auditor</h1>
        <p className="text-muted-foreground text-sm mt-1">Vista consolidada de todas las fábricas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {fabricas.map(fab => {
          const condiciones = getCondicionesByFabrica(fab.id);
          const jornadas = getJornadasByFabrica(fab.id);
          const ncs = getNCByFabrica(fab.id);
          const ensayos = getEnsayosByFabrica(fab.id);

          const vencidas = condiciones.filter(c => c.estado === 'vencido').length;
          const porVencer = condiciones.filter(c => c.estado === 'por_vencer').length;
          const estado = vencidas > 0 ? 'vencido' as const : porVencer > 0 ? 'por_vencer' as const : 'vigente' as const;

          const ncAbiertas = ncs.filter(nc => nc.estado === 'abierta').length;
          const jornadasMes = jornadas.filter(j => j.fecha.startsWith(new Date().toISOString().slice(0, 7))).length;

          const ultimoEnsayo = ensayos.sort((a, b) => b.fecha_muestra.localeCompare(a.fecha_muestra))[0];
          const diasEnsayo = ultimoEnsayo
            ? Math.floor((Date.now() - new Date(ultimoEnsayo.fecha_muestra).getTime()) / (1000 * 60 * 60 * 24))
            : 999;

          return (
            <Link key={fab.id} href={`/auditor/fabricas/${fab.id}`}>
              <Card className="bg-card/50 border-border/50 hover:bg-muted/20 transition-all duration-200 cursor-pointer h-full">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">🏭</div>
                    <div>
                      <h3 className="font-semibold text-sm">{fab.nombre}</h3>
                      <p className="text-xs text-muted-foreground">{fab.codigo}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Condiciones</span>
                      <Semaforo estado={estado} size="md" showLabel />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Jornadas (mes)</span>
                      <span className="text-sm font-medium">{jornadasMes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">NC abiertas</span>
                      <span className={`text-sm font-medium ${ncAbiertas > 0 ? 'text-status-red' : 'text-status-green'}`}>{ncAbiertas}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Último ensayo</span>
                      <span className={`text-sm font-medium ${diasEnsayo > 30 ? 'text-status-red' : ''}`}>{diasEnsayo < 999 ? `${diasEnsayo} días` : '—'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/30">
                    <span className="text-xs text-primary">Ver detalle →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
