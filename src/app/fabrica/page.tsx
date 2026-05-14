'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
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

function formatDateShort(iso: string) {
  const [y, m, d] = iso.split('-');
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(d)} ${meses[parseInt(m) - 1]} ${y}`;
}

type AlertaPlanta = {
  id: string; nivel: 'rojo' | 'amarillo'; icono: string;
  titulo: string; detalle: string; href: string;
};

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

  // ─── ALERTAS PROACTIVAS (local a esta planta) ───────────
  const alertas = useMemo(() => {
    const result: AlertaPlanta[] = [];
    const ahora = Date.now();
    const MS_DIA = 1000 * 60 * 60 * 24;

    // 1. Condiciones vencidas
    condiciones.filter(c => c.estado === 'vencido').forEach(c => {
      result.push({
        id: `cond-v-${c.id}`, nivel: 'rojo', icono: '🔴',
        titulo: `Condición vencida: ${c.descripcion}`,
        detalle: c.fecha_vencimiento ? `Venció el ${formatDateShort(c.fecha_vencimiento)}` : 'Sin fecha',
        href: '/fabrica/condiciones',
      });
    });

    // 2. Condiciones por vencer (<30 días)
    condiciones.filter(c => c.estado === 'por_vencer').forEach(c => {
      const diasRestantes = c.fecha_vencimiento
        ? Math.ceil((new Date(c.fecha_vencimiento).getTime() - ahora) / MS_DIA) : 0;
      result.push({
        id: `cond-pv-${c.id}`, nivel: 'amarillo', icono: '🟡',
        titulo: `Por vencer en ${diasRestantes} días: ${c.descripcion}`,
        detalle: c.fecha_vencimiento ? `Vence el ${formatDateShort(c.fecha_vencimiento)}` : '',
        href: '/fabrica/condiciones',
      });
    });

    // 3. NC abiertas
    ncs.filter(nc => nc.estado === 'abierta').forEach(nc => {
      const diasAbierta = Math.floor((ahora - new Date(nc.fecha_deteccion).getTime()) / MS_DIA);
      result.push({
        id: `nc-${nc.id}`,
        nivel: diasAbierta > 15 ? 'rojo' : 'amarillo',
        icono: diasAbierta > 15 ? '⚠️' : '⚠️',
        titulo: diasAbierta > 15
          ? `NC abierta hace ${diasAbierta} días: ${nc.numero}`
          : `NC abierta: ${nc.numero}`,
        detalle: `${diasAbierta} días · ${nc.detalle?.substring(0, 80)}`,
        href: '/fabrica/no-conformidades',
      });
    });

    // 4. Ensayos atrasados
    const ensayosOrdenados = [...ensayos].sort((a, b) => b.fecha_muestra.localeCompare(a.fecha_muestra));
    if (ensayosOrdenados.length > 0) {
      const diasUltimo = Math.floor((ahora - new Date(ensayosOrdenados[0].fecha_muestra).getTime()) / MS_DIA);
      if (diasUltimo > 45) {
        result.push({
          id: `ens-critico`, nivel: 'rojo', icono: '🧪',
          titulo: `Sin ensayo de compresión hace ${diasUltimo} días`,
          detalle: `Último: ${formatDateShort(ensayosOrdenados[0].fecha_muestra)}`,
          href: '/fabrica/ensayos',
        });
      } else if (diasUltimo > 30) {
        result.push({
          id: `ens-pendiente`, nivel: 'amarillo', icono: '🧪',
          titulo: `Ensayo de compresión pendiente (${diasUltimo} días)`,
          detalle: `Último: ${formatDateShort(ensayosOrdenados[0].fecha_muestra)}`,
          href: '/fabrica/ensayos',
        });
      }
    }

    return result.sort((a, b) => (a.nivel === 'rojo' ? 0 : 1) - (b.nivel === 'rojo' ? 0 : 1));
  }, [condiciones, ncs, ensayos]);

  const alertasRojas = alertas.filter(a => a.nivel === 'rojo').length;
  const [alertasExpandidas, setAlertasExpandidas] = useState(false);

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

      {/* ── BANNER DE ALERTAS PROACTIVAS ── */}
      {alertas.length > 0 && (
        <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
          alertasRojas > 0
            ? 'border-status-red/30 bg-status-red/5'
            : 'border-status-amber/30 bg-status-amber/5'
        }`}>
          <button
            onClick={() => setAlertasExpandidas(!alertasExpandidas)}
            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{alertasRojas > 0 ? '🚨' : '⚡'}</span>
              <div className="text-left">
                <p className="text-sm font-semibold">
                  {alertasRojas > 0
                    ? `${alertasRojas} alerta${alertasRojas > 1 ? 's' : ''} crítica${alertasRojas > 1 ? 's' : ''}`
                    : `${alertas.length} aviso${alertas.length > 1 ? 's' : ''} preventivo${alertas.length > 1 ? 's' : ''}`
                  }
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {alertas.length} situacion{alertas.length > 1 ? 'es' : ''} requiere{alertas.length === 1 ? '' : 'n'} atención
                </p>
              </div>
            </div>
            <span className={`text-xs transition-transform duration-200 ${alertasExpandidas ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {alertasExpandidas && (
            <div className="border-t border-border/20 divide-y divide-border/10 max-h-64 overflow-y-auto">
              {alertas.map(a => (
                <Link
                  key={a.id}
                  href={a.href}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-black/[0.03] transition-colors group"
                >
                  <span className="text-sm mt-0.5 shrink-0">{a.icono}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold group-hover:text-primary transition-colors">{a.titulo}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{a.detalle}</p>
                  </div>
                  <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                    Ir →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

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
