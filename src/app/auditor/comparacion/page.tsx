'use client';

import { useApp } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Semaforo } from '@/components/semaforo';

export default function ComparacionPage() {
  const { empresas, getPlantasByEmpresa, getCondicionesByPlanta, getJornadasByPlanta, getNCByPlanta, getEnsayosByPlanta } = useApp();

  const data = empresas.map(emp => {
    const plantas = getPlantasByEmpresa(emp.id);
    let vencidas = 0, porVencer = 0, jornadas = 0, cerradas = 0, ncAbiertas = 0, ncTotal = 0;
    let ultimoEnsayo28d: number | string = '—';

    plantas.forEach(p => {
      const cond = getCondicionesByPlanta(p.id);
      vencidas += cond.filter(c => c.estado === 'vencido').length;
      porVencer += cond.filter(c => c.estado === 'por_vencer').length;
      const j = getJornadasByPlanta(p.id);
      jornadas += j.length;
      cerradas += j.filter(jr => jr.estado === 'cerrada').length;
      const nc = getNCByPlanta(p.id);
      ncAbiertas += nc.filter(n => n.estado === 'abierta').length;
      ncTotal += nc.length;
      const ens = getEnsayosByPlanta(p.id).sort((a, b) => b.fecha_muestra.localeCompare(a.fecha_muestra));
      if (ens[0]?.resultado_28d_mpa && (ultimoEnsayo28d === '—' || typeof ultimoEnsayo28d === 'string')) {
        ultimoEnsayo28d = ens[0].resultado_28d_mpa;
      }
    });

    const estado = vencidas > 0 ? 'vencido' as const : porVencer > 0 ? 'por_vencer' as const : 'vigente' as const;
    return {
      emp,
      estado,
      plantas: plantas.length,
      jornadas,
      cerradas,
      ncAbiertas,
      ncTotal,
      ncPorJornada: jornadas > 0 ? (ncTotal / jornadas).toFixed(2) : '0',
      ultimoEnsayo28d,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Comparación entre Empresas</h1>
        <p className="text-muted-foreground text-sm mt-1">Indicadores consolidados lado a lado</p>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Indicador</th>
                  {data.map(d => (
                    <th key={d.emp.id} className="text-center p-4 font-semibold">{d.emp.nombre}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="p-4 text-muted-foreground">Plantas</td>
                  {data.map(d => (
                    <td key={d.emp.id} className="p-4 text-center font-medium">{d.plantas}</td>
                  ))}
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-4 text-muted-foreground">Condiciones</td>
                  {data.map(d => (
                    <td key={d.emp.id} className="p-4 text-center"><Semaforo estado={d.estado} size="md" showLabel /></td>
                  ))}
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-4 text-muted-foreground">Jornadas</td>
                  {data.map(d => (
                    <td key={d.emp.id} className="p-4 text-center font-medium">{d.cerradas}/{d.jornadas}</td>
                  ))}
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-4 text-muted-foreground">NC abiertas</td>
                  {data.map(d => (
                    <td key={d.emp.id} className={`p-4 text-center font-medium ${d.ncAbiertas > 0 ? 'text-status-red' : 'text-status-green'}`}>{d.ncAbiertas}</td>
                  ))}
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-4 text-muted-foreground">NC / jornada</td>
                  {data.map(d => (
                    <td key={d.emp.id} className="p-4 text-center font-medium">{d.ncPorJornada}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-muted-foreground">Último ensayo 28d</td>
                  {data.map(d => (
                    <td key={d.emp.id} className="p-4 text-center font-medium">{d.ultimoEnsayo28d} {typeof d.ultimoEnsayo28d === 'number' ? 'MPa' : ''}</td>
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
