'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ESTADO_RECEPCION_LABELS, TIPOS_POSTE } from '@/lib/constants';
import type { EstadoRecepcion } from '@/lib/types';

export default function DespachosListPage() {
  const { planta, can, user } = useAuth();
  const { getDespachosByPlanta } = useApp();

  const despachos = getDespachosByPlanta(planta?.id || '');
  const [filtroEstado, setFiltroEstado] = useState<EstadoRecepcion | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState('');

  const visibles = useMemo(() => {
    return despachos.filter(d => {
      if (filtroEstado !== 'todos' && d.estado_recepcion !== filtroEstado) return false;
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase();
        const matchGuia = d.numero_guia.toLowerCase().includes(q);
        const matchDestino = d.destinatario.toLowerCase().includes(q);
        const matchPlaquita = d.postes.some(p => p.codigo_plaquita.toLowerCase().includes(q));
        if (!matchGuia && !matchDestino && !matchPlaquita) return false;
      }
      return true;
    });
  }, [despachos, filtroEstado, busqueda]);

  // KPIs simples para que el responsable de patio vea el panorama del día
  const kpis = useMemo(() => {
    const hoy = new Date().toISOString().slice(0, 10);
    const semanaAtras = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    return {
      hoy: despachos.filter(d => d.fecha_despacho === hoy).length,
      semana: despachos.filter(d => d.fecha_despacho >= semanaAtras).length,
      postesSemana: despachos
        .filter(d => d.fecha_despacho >= semanaAtras)
        .reduce((s, d) => s + d.postes.length, 0),
      pendientesRecepcion: despachos.filter(d => d.estado_recepcion === 'pendiente').length,
    };
  }, [despachos]);

  if (!can('ver_despachos')) {
    return <div className="text-center py-20 text-muted-foreground">Sin permisos para ver despachos.</div>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Despachos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Salida de postes de la fábrica — registro independiente del proceso productivo
          </p>
        </div>
        {can('crear_despacho') && (
          <Link href="/fabrica/despachos/nuevo">
            <Button size="lg" className="text-base">🚚 Registrar despacho</Button>
          </Link>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Hoy</p>
            <p className="text-2xl font-bold mt-1">{kpis.hoy}</p>
            <p className="text-[10px] text-muted-foreground">despachos</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Últimos 7 días</p>
            <p className="text-2xl font-bold mt-1">{kpis.semana}</p>
            <p className="text-[10px] text-muted-foreground">{kpis.postesSemana} postes</p>
          </CardContent>
        </Card>
        <Card className="bg-status-amber/5 border-status-amber/20">
          <CardContent className="p-4">
            <p className="text-xs text-status-amber">Pendientes</p>
            <p className="text-2xl font-bold mt-1 text-status-amber">{kpis.pendientesRecepcion}</p>
            <p className="text-[10px] text-muted-foreground">sin confirmar recepción</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Tu rol</p>
            <p className="text-base font-semibold mt-1 capitalize">{user?.rol.replace('_', ' ')}</p>
            <p className="text-[10px] text-muted-foreground">{can('crear_despacho') ? 'Puede registrar' : 'Solo lectura'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar por guía, destino o código de plaquita..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="max-w-md"
        />
        <div className="flex gap-1.5">
          {(['todos', 'pendiente', 'conforme', 'con_danos'] as const).map(est => {
            const isActive = filtroEstado === est;
            const label = est === 'todos' ? 'Todos' : ESTADO_RECEPCION_LABELS[est].label;
            return (
              <button
                key={est}
                onClick={() => setFiltroEstado(est)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/40 bg-muted/20 text-muted-foreground hover:bg-muted/40'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista */}
      {visibles.length === 0 ? (
        <Card className="bg-card/30 border-border/40 border-dashed">
          <CardContent className="p-10 text-center">
            <p className="text-3xl mb-2">📦</p>
            <p className="text-sm font-medium">Sin despachos {filtroEstado !== 'todos' ? 'en este filtro' : 'registrados'}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {can('crear_despacho')
                ? 'Cuando llegue el camión, registra el despacho desde "Registrar despacho".'
                : 'Aquí aparecerán los despachos cuando se registren.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {visibles.map(d => {
            const rec = ESTADO_RECEPCION_LABELS[d.estado_recepcion];
            // Conteo por tipo de poste para el resumen en una línea
            const porTipo = d.postes.reduce<Record<string, number>>((acc, p) => {
              acc[p.tipo_poste] = (acc[p.tipo_poste] || 0) + 1;
              return acc;
            }, {});
            const resumenTipos = Object.entries(porTipo)
              .map(([t, n]) => {
                const lbl = TIPOS_POSTE.find(tp => tp.value === t)?.label || t;
                return `${n}× ${lbl}`;
              })
              .join(' · ');

            return (
              <Link key={d.id} href={`/fabrica/despachos/${d.id}`}>
                <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-semibold">{d.numero_guia}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-sm">{d.destinatario}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {d.fecha_despacho}
                          {d.transportista ? ` · ${d.transportista}` : ''}
                          {d.patente_camion ? ` · ${d.patente_camion}` : ''}
                        </p>
                        <p className="text-xs text-muted-foreground/80">
                          <span className="font-medium text-foreground/70">{d.postes.length} postes</span>
                          {resumenTipos && <> — {resumenTipos}</>}
                        </p>
                      </div>
                      <div className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${
                        d.estado_recepcion === 'conforme' ? 'bg-status-green/10 border-status-green/30 text-status-green' :
                        d.estado_recepcion === 'con_danos' ? 'bg-status-red/10 border-status-red/30 text-status-red' :
                        'bg-status-amber/10 border-status-amber/30 text-status-amber'
                      }`}>
                        <span>{rec.icon}</span>
                        <span>{rec.label}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
