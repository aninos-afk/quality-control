'use client';

import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { SemaforoResumen } from '@/components/semaforo';
import { StatCard } from '@/components/stat-card';
import { EstadoJornadaBadge } from '@/components/estado-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DESTINOS_LABELS } from '@/lib/constants';

export default function FabricaDashboard() {
  const { planta, empresa } = useAuth();
  const { getCondicionesByPlanta, getJornadasByPlanta, getNCByPlanta, getEnsayosByPlanta } = useApp();

  const plantaId = planta?.id || '';
  const condiciones = getCondicionesByPlanta(plantaId);
  const jornadas = getJornadasByPlanta(plantaId);
  const ncs = getNCByPlanta(plantaId);
  const ensayos = getEnsayosByPlanta(plantaId);

  const vigentes = condiciones.filter(c => c.estado === 'vigente').length;
  const porVencer = condiciones.filter(c => c.estado === 'por_vencer').length;
  const vencidas = condiciones.filter(c => c.estado === 'vencido').length;

  const hoy = format(new Date(), 'yyyy-MM-dd');
  const jornadaHoy = jornadas.find(j => j.fecha === hoy);
  const jornadasPendientes = jornadas.filter(j => j.estado !== 'cerrada');
  const ncAbiertas = ncs.filter(nc => nc.estado === 'abierta');

  const ultimoEnsayo = ensayos.sort((a, b) => b.fecha_muestra.localeCompare(a.fecha_muestra))[0];
  const diasDesdeUltimoEnsayo = ultimoEnsayo
    ? Math.floor((new Date().getTime() - new Date(ultimoEnsayo.fecha_muestra).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{planta?.nombre || 'Dashboard'}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {empresa?.nombre && <span className="text-foreground/70">{empresa.nombre} — </span>}
          {format(new Date(), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      {/* Condiciones Habilitantes */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Condiciones Habilitantes</CardTitle>
            <Link href="/fabrica/condiciones" className="text-xs text-primary hover:underline">Ver detalle →</Link>
          </div>
        </CardHeader>
        <CardContent>
          <SemaforoResumen vigentes={vigentes} porVencer={porVencer} vencidas={vencidas} />
        </CardContent>
      </Card>

      {/* Jornada de Hoy */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Jornada de Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          {jornadaHoy ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-medium">{jornadaHoy.codigo}</span>
                <EstadoJornadaBadge estado={jornadaHoy.estado} />
                <span className="text-xs text-muted-foreground">Destino: {DESTINOS_LABELS[jornadaHoy.destino]}</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/fabrica/jornadas/${jornadaHoy.id}`}>
                  <Button size="sm" variant="outline">Ver jornada</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">No hay jornada registrada para hoy.</p>
              <Link href="/fabrica/jornadas/nueva">
                <Button size="sm">+ Abrir jornada de hoy</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Jornadas pendientes" value={jornadasPendientes.length} icon="📅" detail="Sin cerrar" accent={jornadasPendientes.length > 3 ? 'yellow' : 'default'} />
        <StatCard label="NC abiertas" value={ncAbiertas.length} icon="⚠️" accent={ncAbiertas.length > 0 ? 'red' : 'green'} />
        <StatCard label="Último ensayo" value={`${diasDesdeUltimoEnsayo} días`} icon="🧪" detail={ultimoEnsayo ? `${ultimoEnsayo.resultado_28d_mpa} MPa` : 'Sin registros'} accent={diasDesdeUltimoEnsayo > 30 ? 'red' : 'default'} />
        <StatCard label="Jornadas del mes" value={jornadas.filter(j => j.fecha.startsWith(format(new Date(), 'yyyy-MM'))).length} icon="📊" />
      </div>

      {/* Pendientes */}
      {jornadasPendientes.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Jornadas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {jornadasPendientes.slice(0, 5).map(j => (
                <Link key={j.id} href={`/fabrica/jornadas/${j.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{j.codigo}</span>
                    <span className="text-xs text-muted-foreground">{j.fecha}</span>
                  </div>
                  <EstadoJornadaBadge estado={j.estado} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
