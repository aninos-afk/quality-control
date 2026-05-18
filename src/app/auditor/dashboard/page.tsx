'use client';

import { useMemo, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Area, AreaChart,
  ReferenceLine, ComposedChart,
} from 'recharts';
import { TIPOS_DEFECTO } from '@/lib/constants';

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

// ─── KPI Card ───────────────────────────────────────────
function KpiCard({ icon, label, value, sub, accent, tooltip }: {
  icon: string; label: string; value: string | number; sub?: string;
  accent?: 'green' | 'red' | 'amber' | 'primary'; tooltip?: string;
}) {
  const colors = {
    green:   'from-status-green/15 to-status-green/5 border-status-green/20',
    red:     'from-status-red/15 to-status-red/5 border-status-red/20',
    amber:   'from-status-amber/15 to-status-amber/5 border-status-amber/20',
    primary: 'from-primary/15 to-primary/5 border-primary/20',
  };
  return (
    <Card className={`bg-gradient-to-br ${accent ? colors[accent] : 'from-card to-card border-border/40'} border`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
              {tooltip && (
                <span
                  title={tooltip}
                  className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-muted-foreground/20 text-muted-foreground text-[9px] font-bold cursor-help flex-shrink-0"
                >
                  ?
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <span className="text-2xl ml-2">{icon}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Tooltip ────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/60 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-semibold mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">{typeof p.value === 'number' && p.value % 1 !== 0 ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

const EMPRESA_COLORS = [
  'hsl(210, 90%, 60%)', 'hsl(160, 70%, 50%)', 'hsl(280, 65%, 60%)',
  'hsl(30, 85%, 55%)', 'hsl(340, 75%, 55%)', 'hsl(190, 80%, 50%)',
];
const DEFECTO_COLORS = [
  'hsl(0, 75%, 55%)', 'hsl(25, 85%, 55%)', 'hsl(45, 90%, 50%)',
  'hsl(200, 70%, 55%)', 'hsl(270, 60%, 55%)', 'hsl(150, 60%, 45%)', 'hsl(0, 0%, 55%)',
];

// ─── Semáforo compacto ──────────────────────────────────
function Semaforo({ estado }: { estado: 'green' | 'amber' | 'red' }) {
  const cfg = {
    green: { bg: 'bg-status-green', label: '✓' },
    amber: { bg: 'bg-status-amber', label: '!' },
    red:   { bg: 'bg-status-red',   label: '✕' },
  }[estado];
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════
export default function DashboardEjecutivo() {
  const {
    empresas, plantas: allPlantas, jornadas: allJornadas,
    verificaciones: allVerificaciones, noConformidades: allNoConformidades,
    ensayos: allEnsayos, condiciones: allCondiciones,
  } = useApp();

  const [filtroEmpresaId, setFiltroEmpresaId] = useState<string>('todas');
  const [filtroPlantaId, setFiltroPlantaId]   = useState<string>('todas');

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroEmpresaId(e.target.value);
    setFiltroPlantaId('todas');
  };

  const plantasVisibles = useMemo(() => {
    if (filtroEmpresaId === 'todas') return allPlantas;
    return allPlantas.filter(p => p.empresa_id === filtroEmpresaId);
  }, [allPlantas, filtroEmpresaId]);

  const targetPlantasIds = useMemo(() => {
    if (filtroPlantaId !== 'todas') return [filtroPlantaId];
    return plantasVisibles.map(p => p.id);
  }, [filtroPlantaId, plantasVisibles]);

  const jornadas       = useMemo(() => allJornadas.filter(j => targetPlantasIds.includes(j.planta_id)), [allJornadas, targetPlantasIds]);
  const verificaciones = useMemo(() => allVerificaciones.filter(v => jornadas.some(j => j.id === v.jornada_id)), [allVerificaciones, jornadas]);
  const noConformidades = useMemo(() => allNoConformidades.filter(nc => targetPlantasIds.includes(nc.planta_id)), [allNoConformidades, targetPlantasIds]);
  const ensayos        = useMemo(() => allEnsayos.filter(e => targetPlantasIds.includes(e.planta_id)), [allEnsayos, targetPlantasIds]);
  const condiciones    = useMemo(() => allCondiciones.filter(c => targetPlantasIds.includes(c.planta_id)), [allCondiciones, targetPlantasIds]);

  // ─── KPIs DE ADOPCIÓN ───────────────────────────────
  const kpis = useMemo(() => {
    // Fábricas activas este mes
    const hoy = new Date();
    const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
    const plantasConActividad = new Set(
      jornadas.filter(j => j.fecha.startsWith(mesActual)).map(j => j.planta_id)
    ).size;
    const totalPlantas = plantasVisibles.length;

    // % jornadas con ciclo completo (cerradas o despachadas)
    const jornadasCompletas = jornadas.filter(j => j.estado === 'cerrada' || j.estado === 'despachada').length;
    const pctCicloCompleto  = jornadas.length > 0 ? Math.round(jornadasCompletas / jornadas.length * 100) : 0;

    // Ensayos al día (planta con ensayo en los últimos 35 días)
    const hace35 = new Date(Date.now() - 35 * 86400000).toISOString().slice(0, 10);
    const plantasConEnsayo = new Set(
      ensayos.filter(e => e.fecha_muestra >= hace35).map(e => e.planta_id)
    ).size;
    const plantasConJornadas = new Set(jornadas.map(j => j.planta_id)).size;

    // Alertas activas
    const condVencidas   = condiciones.filter(c => c.estado === 'vencido').length;
    const condPorVencer  = condiciones.filter(c => c.estado === 'por_vencer').length;
    const ensayosAtrasados = plantasConJornadas - plantasConEnsayo;
    const alertasActivas = condVencidas + Math.max(0, ensayosAtrasados);

    // MPa promedio (se mantiene — único KPI de resultado técnico)
    const ensayos28d = ensayos.filter(e => e.resultado_28d_mpa != null);
    const mpaProm    = ensayos28d.length > 0
      ? (ensayos28d.reduce((s, e) => s + (e.resultado_28d_mpa || 0), 0) / ensayos28d.length).toFixed(1)
      : '—';

    // NC: se muestran como indicador secundario (sistema detectando)
    const ncAbiertas = noConformidades.filter(nc => nc.estado === 'abierta').length;
    const ncTotal    = noConformidades.length;

    return {
      plantasConActividad, totalPlantas,
      jornadasCompletas, totalJornadas: jornadas.length, pctCicloCompleto,
      plantasConEnsayo, plantasConJornadas,
      condVencidas, condPorVencer, alertasActivas,
      mpaProm,
      ncAbiertas, ncTotal,
    };
  }, [jornadas, verificaciones, noConformidades, ensayos, condiciones, plantasVisibles]);

  // ─── ESTADO POR PLANTA (mapa visual) ────────────────
  const estadoPlantas = useMemo(() => {
    const hoy = new Date();
    const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
    const hace35    = new Date(Date.now() - 35 * 86400000).toISOString().slice(0, 10);

    return plantasVisibles.map(p => {
      const emp        = empresas.find(e => e.id === p.empresa_id);
      const pJornadas  = jornadas.filter(j => j.planta_id === p.id);
      const activa     = pJornadas.some(j => j.fecha.startsWith(mesActual));
      const completas  = pJornadas.filter(j => j.estado === 'cerrada' || j.estado === 'despachada').length;
      const pctCompleto = pJornadas.length > 0 ? Math.round(completas / pJornadas.length * 100) : 0;

      const pEnsayos   = ensayos.filter(e => e.planta_id === p.id);
      const ensayoOk   = pEnsayos.some(e => e.fecha_muestra >= hace35);

      const pConds     = condiciones.filter(c => c.planta_id === p.id);
      const condState: 'green' | 'amber' | 'red' =
        pConds.some(c => c.estado === 'vencido')    ? 'red'   :
        pConds.some(c => c.estado === 'por_vencer') ? 'amber' : 'green';

      // Adopción: promedio ponderado de los tres ejes
      const ejeActividad  = activa ? 100 : 0;
      const ejeCiclo      = pctCompleto;
      const ejeEnsayo     = ensayoOk ? 100 : 0;
      const adopcion      = pJornadas.length > 0
        ? Math.round((ejeActividad * 0.3 + ejeCiclo * 0.5 + ejeEnsayo * 0.2))
        : 0;

      return {
        id: p.id,
        codigo: p.codigo,
        nombre: p.nombre.replace('Planta ', ''),
        empresa: emp?.nombre || '',
        activa,
        pctCompleto,
        ensayoOk,
        condState,
        adopcion,
        totalJornadas: pJornadas.length,
      };
    }).filter(p => p.totalJornadas > 0).sort((a, b) => b.adopcion - a.adopcion);
  }, [plantasVisibles, empresas, jornadas, ensayos, condiciones]);

  // ─── ADOPCIÓN MENSUAL (barras + línea %) ────────────
  const adopcionMensual = useMemo(() => {
    const meses: Record<string, { total: number; completas: number }> = {};
    jornadas.forEach(j => {
      const [y, m] = j.fecha.split('-');
      const key = `${MESES[parseInt(m) - 1]} ${y.slice(2)}`;
      if (!meses[key]) meses[key] = { total: 0, completas: 0 };
      meses[key].total++;
      if (j.estado === 'cerrada' || j.estado === 'despachada') meses[key].completas++;
    });
    const sortedKeys = Object.keys(meses).sort((a, b) => {
      const [ma, ya] = a.split(' ');
      const [mb, yb] = b.split(' ');
      return (parseInt(ya) * 12 + MESES.indexOf(ma)) - (parseInt(yb) * 12 + MESES.indexOf(mb));
    });
    return sortedKeys.map(key => ({
      mes: key,
      jornadas: meses[key].total,
      completas: meses[key].completas,
      pct: meses[key].total > 0 ? Math.round(meses[key].completas / meses[key].total * 100) : 0,
    }));
  }, [jornadas]);

  // ─── ENSAYOS TENDENCIA ──────────────────────────────
  const ensayosTendencia = useMemo(() => {
    return [...ensayos]
      .filter(e => e.resultado_28d_mpa != null)
      .sort((a, b) => a.fecha_muestra.localeCompare(b.fecha_muestra))
      .map(e => {
        const p = allPlantas.find(pl => pl.id === e.planta_id);
        return { fecha: e.fecha_muestra.slice(5), mpa: e.resultado_28d_mpa, planta: p?.codigo || '?' };
      });
  }, [ensayos, allPlantas]);

  // ─── NC POR TIPO (Pareto) ───────────────────────────
  const ncPorTipo = useMemo(() => {
    const counts: Record<string, number> = {};
    noConformidades.forEach(nc => {
      const label = TIPOS_DEFECTO.find(t => t.value === nc.tipo_defecto)?.label || nc.tipo_defecto;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([tipo, cantidad]) => ({ tipo: tipo.length > 25 ? tipo.slice(0, 22) + '...' : tipo, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [noConformidades]);

  const empNombres = useMemo(() => {
    if (filtroEmpresaId !== 'todas') return [empresas.find(e => e.id === filtroEmpresaId)?.nombre || ''];
    return empresas.map(e => e.nombre);
  }, [empresas, filtroEmpresaId]);

  return (
    <div className="space-y-8">

      {/* ── HEADER + FILTROS ── */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Dashboard Ejecutivo</p>
          <h1 className="text-2xl font-bold">Control de Calidad — Programa Postes 2026</h1>
          <p className="text-sm text-muted-foreground mt-1">Adopción del Plan de Aseguramiento de Calidad · Todas las fábricas</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 bg-background/50 p-3 rounded-xl border border-border/50">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground px-1">Empresa</label>
            <select
              className="text-sm bg-card border border-border rounded-md px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary min-w-[140px]"
              value={filtroEmpresaId} onChange={handleEmpresaChange}
            >
              <option value="todas">Todas las empresas</option>
              {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground px-1">Planta</label>
            <select
              className="text-sm bg-card border border-border rounded-md px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary min-w-[140px] disabled:opacity-50"
              value={filtroPlantaId} onChange={e => setFiltroPlantaId(e.target.value)}
              disabled={filtroEmpresaId === 'todas'}
            >
              <option value="todas">Todas las plantas</option>
              {plantasVisibles.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── KPIs DE ADOPCIÓN ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          icon="🏭" label="Fábricas activas"
          value={`${kpis.plantasConActividad} / ${kpis.totalPlantas}`}
          sub="con actividad este mes"
          accent={kpis.plantasConActividad === kpis.totalPlantas ? 'green' : kpis.plantasConActividad > 0 ? 'amber' : 'red'}
          tooltip="Plantas que han registrado al menos una jornada durante el mes en curso. Mide si el sistema está siendo usado activamente."
        />
        <KpiCard
          icon="📋" label="Jornadas registradas"
          value={kpis.totalJornadas}
          sub={`${kpis.jornadasCompletas} ciclo completo`}
          accent="primary"
          tooltip="Total de jornadas de fabricación ingresadas al sistema en el período seleccionado, independientemente de su estado."
        />
        <KpiCard
          icon="✅" label="Ciclo completo"
          value={`${kpis.pctCicloCompleto}%`}
          sub="jornadas cerradas / total"
          accent={kpis.pctCicloCompleto >= 80 ? 'green' : kpis.pctCicloCompleto >= 50 ? 'amber' : 'red'}
          tooltip="Porcentaje de jornadas que llegaron hasta el cierre (firma del Jefe de Planta y Encargado de Calidad). Una jornada abierta sin cerrar indica que el proceso quedó incompleto."
        />
        <KpiCard
          icon="🧪" label="Ensayos al día"
          value={`${kpis.plantasConEnsayo} / ${kpis.plantasConJornadas}`}
          sub="plantas con ensayo ≤35 días"
          accent={kpis.plantasConEnsayo === kpis.plantasConJornadas ? 'green' : 'amber'}
          tooltip="Plantas que tienen al menos un ensayo de compresión registrado en los últimos 35 días. El hormigón G25 requiere ensayo a los 28 días — 35 días es el margen operativo."
        />
        <KpiCard
          icon="⚗️" label="MPa promedio"
          value={kpis.mpaProm}
          sub={`${ensayos.length} ensayos 28d`}
          accent="primary"
          tooltip="Resistencia promedio a compresión a 28 días, en megapascales, de todos los ensayos registrados. El hormigón G25 exige un mínimo de 25 MPa."
        />
        <KpiCard
          icon="🔔" label="Alertas activas"
          value={kpis.alertasActivas}
          sub={`${kpis.condVencidas} cond. vencidas · ${kpis.condPorVencer} por vencer`}
          accent={kpis.alertasActivas === 0 ? 'green' : kpis.alertasActivas <= 3 ? 'amber' : 'red'}
          tooltip="Suma de condiciones habilitantes vencidas (certificados, calibraciones, capacitaciones) más plantas con ensayo de compresión atrasado. Requieren acción inmediata."
        />
      </div>

      {/* ── GRÁFICOS FILA 1: Adopción mensual + Ensayos ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Adopción mensual: barras de jornadas + línea % ciclo completo */}
        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-1">Adopción mensual del PAC</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Barras: jornadas registradas · Línea: % con ciclo completo</p>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={adopcionMensual}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" unit="%" />
                <Tooltip content={<ChartTooltip />} />
                <Bar yAxisId="left" dataKey="jornadas" name="Jornadas" fill="hsl(210, 90%, 60%)" radius={[4, 4, 0, 0]} opacity={0.7} />
                <Line yAxisId="right" type="monotone" dataKey="pct" name="% ciclo completo" stroke="hsl(160, 70%, 50%)" strokeWidth={2.5} dot={{ r: 4 }} />
                <ReferenceLine yAxisId="right" y={80} stroke="hsl(160, 70%, 50%)" strokeDasharray="4 4" opacity={0.4} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ensayos compresión — se mantiene igual, es el mejor gráfico */}
        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-1">Ensayos Compresión 28d — Tendencia</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Línea de referencia: 25 MPa mínimo normativo (Hormigón G25)</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={ensayosTendencia}>
                <defs>
                  <linearGradient id="gradMpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(210, 90%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(210, 90%, 60%)" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="fecha" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[20, 40]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" unit=" MPa" />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={25} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Mínimo 25 MPa', fontSize: 10, fill: '#ef4444' }} />
                <Area type="monotone" dataKey="mpa" name="Resistencia 28d" stroke="hsl(210, 90%, 60%)" fill="url(#gradMpa)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(210, 90%, 60%)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── GRÁFICOS FILA 2: NC contextualizadas ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* NC por tipo — reencuadrado: "el sistema detecta" */}
        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-1">Detección por Tipo de Defecto</h3>
            <p className="text-[10px] text-muted-foreground mb-4">
              Las NC son señal de que el sistema funciona — {kpis.ncTotal} detectadas · {kpis.ncAbiertas} en gestión activa
            </p>
            {ncPorTipo.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={ncPorTipo} layout="vertical" barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <YAxis type="category" dataKey="tipo" tick={{ fontSize: 10 }} width={140} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="cantidad" name="Detecciones" radius={[0, 4, 4, 0]}>
                    {ncPorTipo.map((_, i) => <Cell key={i} fill={DEFECTO_COLORS[i % DEFECTO_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">Sin NC registradas</div>
            )}
          </CardContent>
        </Card>

        {/* Alertas activas por planta */}
        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-1">Alertas Activas por Planta</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Condiciones vencidas y por vencer que requieren atención</p>
            <div className="space-y-2 overflow-y-auto max-h-[260px] pr-1">
              {plantasVisibles.map(p => {
                const pConds = condiciones.filter(c => c.planta_id === p.id);
                const vencidas   = pConds.filter(c => c.estado === 'vencido');
                const porVencer  = pConds.filter(c => c.estado === 'por_vencer');
                if (vencidas.length === 0 && porVencer.length === 0) return null;
                return (
                  <div key={p.id} className="p-3 rounded-lg bg-muted/10 border border-border/20 space-y-1.5">
                    <p className="text-xs font-semibold">{p.nombre.replace('Planta ', '')} · {empresas.find(e => e.id === p.empresa_id)?.nombre}</p>
                    {vencidas.map(c => (
                      <div key={c.id} className="flex items-center gap-2 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-red flex-shrink-0" />
                        <span className="text-status-red font-medium">Vencida:</span>
                        <span className="text-muted-foreground truncate">{c.descripcion}</span>
                      </div>
                    ))}
                    {porVencer.map(c => (
                      <div key={c.id} className="flex items-center gap-2 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-amber flex-shrink-0" />
                        <span className="text-status-amber font-medium">Por vencer:</span>
                        <span className="text-muted-foreground truncate">{c.descripcion} {c.fecha_vencimiento ? `· ${c.fecha_vencimiento}` : ''}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
              {kpis.alertasActivas === 0 && (
                <div className="h-[220px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <span className="text-3xl">✅</span>
                  <span className="text-sm">Todas las condiciones habilitantes al día</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── TABLA DE ESTADO POR PLANTA ── */}
      <Card className="bg-card/60 border-border/40">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold mb-1">Estado de Adopción por Planta</h3>
          <p className="text-[10px] text-muted-foreground mb-4">
            Resumen de cumplimiento por cada planta activa en el período
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Planta</th>
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Empresa</th>
                  <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">Activa este mes</th>
                  <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">Ciclo completo</th>
                  <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">Ensayo vigente</th>
                  <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">Condiciones</th>
                </tr>
              </thead>
              <tbody>
                {estadoPlantas.map(p => (
                  <tr key={p.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-medium">{p.nombre}</td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">{p.empresa}</td>
                    <td className="py-3 px-3 text-center">
                      <Semaforo estado={p.activa ? 'green' : 'red'} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Semaforo estado={p.pctCompleto >= 80 ? 'green' : p.pctCompleto >= 50 ? 'amber' : 'red'} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Semaforo estado={p.ensayoOk ? 'green' : 'red'} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Semaforo estado={p.condState} />
                    </td>
                  </tr>
                ))}
                {estadoPlantas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Sin datos de producción para los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Leyenda */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/20">
            <p className="text-[10px] text-muted-foreground mr-1">Referencias:</p>
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Semaforo estado="green" /> Cumple
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Semaforo estado="amber" /> Atención
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Semaforo estado="red" /> Crítico
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ── FOOTER ── */}
      <div className="text-center text-[10px] text-muted-foreground py-4 border-t border-border/20">
        Dashboard Analítico · Adopción del PAC · Postes de Hormigón Armado · Grupo SAESA · Programa 2026
      </div>

    </div>
  );
}
