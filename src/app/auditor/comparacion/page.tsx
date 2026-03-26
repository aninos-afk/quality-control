'use client';

import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Semaforo } from '@/components/semaforo';

export default function ComparacionPage() {
  const { fabricas, getCondicionesByFabrica, getJornadasByFabrica, getNCByFabrica, getEnsayosByFabrica } = useApp();

  const data = fabricas.map(fab => {
    const condiciones = getCondicionesByFabrica(fab.id);
    const jornadas = getJornadasByFabrica(fab.id);
    const ncs = getNCByFabrica(fab.id);
    const ensayos = getEnsayosByFabrica(fab.id);
    const vencidas = condiciones.filter(c => c.estado === 'vencido').length;
    const porVencer = condiciones.filter(c => c.estado === 'por_vencer').length;
    const estado = vencidas > 0 ? 'vencido' as const : porVencer > 0 ? 'por_vencer' as const : 'vigente' as const;
    const ultimoEnsayo = ensayos.sort((a, b) => b.fecha_muestra.localeCompare(a.fecha_muestra))[0];
    return {
      fab,
      estado,
      jornadas: jornadas.length,
      cerradas: jornadas.filter(j => j.estado === 'cerrada').length,
      ncAbiertas: ncs.filter(nc => nc.estado === 'abierta').length,
      ncTotal: ncs.length,
      ncPorJornada: jornadas.length > 0 ? (ncs.length / jornadas.length).toFixed(2) : '0',
      ultimoEnsayo28d: ultimoEnsayo?.resultado_28d_mpa || '—',
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Comparación entre Fábricas</h1>
        <p className="text-muted-foreground text-sm mt-1">Indicadores lado a lado</p>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Indicador</th>
                  {data.map(d => (
                    <th key={d.fab.id} className="text-center p-4 font-semibold">{d.fab.codigo}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="p-4 text-muted-foreground">Condiciones</td>
                  {data.map(d => (
                    <td key={d.fab.id} className="p-4 text-center"><Semaforo estado={d.estado} size="md" showLabel /></td>
                  ))}
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-4 text-muted-foreground">Jornadas</td>
                  {data.map(d => (
                    <td key={d.fab.id} className="p-4 text-center font-medium">{d.cerradas}/{d.jornadas}</td>
                  ))}
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-4 text-muted-foreground">NC abiertas</td>
                  {data.map(d => (
                    <td key={d.fab.id} className={`p-4 text-center font-medium ${d.ncAbiertas > 0 ? 'text-status-red' : 'text-status-green'}`}>{d.ncAbiertas}</td>
                  ))}
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-4 text-muted-foreground">NC / jornada</td>
                  {data.map(d => (
                    <td key={d.fab.id} className="p-4 text-center font-medium">{d.ncPorJornada}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-muted-foreground">Último ensayo 28d</td>
                  {data.map(d => (
                    <td key={d.fab.id} className="p-4 text-center font-medium">{d.ultimoEnsayo28d} {typeof d.ultimoEnsayo28d === 'number' ? 'MPa' : ''}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
