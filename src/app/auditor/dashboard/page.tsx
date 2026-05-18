'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Area, AreaChart,
  Legend, ReferenceLine,
} from 'recharts';
import { TIPOS_DEFECTO } from '@/lib/constants';

// ─── Helpers ────────────────────────────────────────────
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function KpiCard({ icon, label, value, sub, accent }: {
  icon: string; label: string; value: string | number; sub?: string;
  accent?: 'green' | 'red' | 'amber' | 'primary';
}) {
  const colors = {
    green: 'from-status-green/15 to-status-green/5 border-status-green/20',
    red: 'from-status-red/15 to-status-red/5 border-status-red/20',
    amber: 'from-status-amber/15 to-status-amber/5 border-status-amber/20',
    primary: 'from-primary/15 to-primary/5 border-primary/20',
  };
  return (
    <Card className={`bg-gradient-to-br ${accent ? colors[accent] : 'from-card to-card border-border/40'} border`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <span className="text-2xl">{icon}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Custom Tooltip ─────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/60 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-semibold mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">{typeof p.value === 'number' && p.value % 1 !== 0 ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Colors ─────────────────────────────────────────────
const EMPRESA_COLORS = [
  'hsl(210, 90%, 60%)', 'hsl(160, 70%, 50%)', 'hsl(280, 65%, 60%)',
  'hsl(30, 85%, 55%)', 'hsl(340, 75%, 55%)', 'hsl(190, 80%, 50%)',
];
const DEFECTO_COLORS = [
  'hsl(0, 75%, 55%)', 'hsl(25, 85%, 55%)', 'hsl(45, 90%, 50%)',
  'hsl(200, 70%, 55%)', 'hsl(270, 60%, 55%)', 'hsl(150, 60%, 45%)', 'hsl(0, 0%, 55%)',
];

// ═══════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════
export default function DashboardEjecutivo() {
  const {
    empresas, plantas, jornadas, verificaciones, noConformidades,
    ensayos, condiciones, desmoldes, productoTerminado,
  } = useApp();

  // ─── KPIs GLOBALES ──────────────────────────────────
  const kpis = useMemo(() => {
    const totalJornadas = jornadas.length;
    const jornadasCerradas = jornadas.filter(j => j.estado === 'cerrada').length;
    const totalVerif = verificaciones.length;
    const conformes = verificaciones.filter(v => v.resultado === 'conforme').length;
    const pctConformidad = totalVerif > 0 ? Math.round((conformes / totalVerif) * 100) : 100;
    const ncAbiertas = noConformidades.filter(nc => nc.estado === 'abierta').length;
    const ncTotal = noConformidades.length;
    const ncPor100 = totalVerif > 0 ? ((ncTotal / totalVerif) * 100).toFixed(1) : '0';

    const ensayos28d = ensayos.filter(e => e.resultado_28d_mpa != null);
    const mpaProm = ensayos28d.length > 0
      ? (ensayos28d.reduce((s, e) => s + (e.resultado_28d_mpa || 0), 0) / ensayos28d.length).toFixed(1)
      : '—';

    const ncCerradas = noConformidades.filter(nc => nc.estado === 'cerrada' && nc.fecha_cierre);
    const diasPromCierre = ncCerradas.length > 0
      ? Math.round(ncCerradas.reduce((s, nc) => {
          const d = (new Date(nc.fecha_cierre!).getTime() - new Date(nc.fecha_deteccion).getTime()) / 86400000;
          return s + Math.max(0, d);
        }, 0) / ncCerradas.length)
      : '—';

    const plantasActivas = new Set(jornadas.map(j => j.planta_id)).size;
    const condVencidas = condiciones.filter(c => c.estado === 'vencido').length;
    const condPorVencer = condiciones.filter(c => c.estado === 'por_vencer').length;

    return {
      totalJornadas, jornadasCerradas, totalVerif, conformes, pctConformidad,
      ncAbiertas, ncTotal, ncPor100, mpaProm, diasPromCierre,
      plantasActivas, condVencidas, condPorVencer,
    };
  }, [jornadas, verificaciones, noConformidades, ensayos, condiciones]);

  // ─── PRODUCCIÓN POR MES ─────────────────────────────
  const produccionMensual = useMemo(() => {
    const meses: Record<string, Record<string, number>> = {};
    jornadas.forEach(j => {
      const [y, m] = j.fecha.split('-');
      const key = `${MESES[parseInt(m) - 1]} ${y.slice(2)}`;
      const emp = plantas.find(p => p.id === j.planta_id);
      const empId = emp?.empresa_id || 'otro';
      const empNombre = empresas.find(e => e.id === empId)?.nombre || 'Otro';
      if (!meses[key]) meses[key] = {};
      meses[key][empNombre] = (meses[key][empNombre] || 0) + 1;
    });

    const sortedKeys = Object.keys(meses).sort((a, b) => {
      const [ma, ya] = a.split(' ');
      const [mb, yb] = b.split(' ');
      return (parseInt(ya) * 12 + MESES.indexOf(ma)) - (parseInt(yb) * 12 + MESES.indexOf(mb));
    });

    return sortedKeys.map(key => ({
      mes: key,
      ...meses[key],
      total: Object.values(meses[key]).reduce((s, v) => s + v, 0),
    }));
  }, [jornadas, plantas, empresas]);

  // ─── RANKING DE PLANTAS ─────────────────────────────
  const rankingPlantas = useMemo(() => {
    return plantas.map(p => {
      const emp = empresas.find(e => e.id === p.empresa_id);
      const pJornadas = jornadas.filter(j => j.planta_id === p.id);
      const pVerifs = pJornadas.flatMap(j => verificaciones.filter(v => v.jornada_id === j.id));
      const pConformes = pVerifs.filter(v => v.resultado === 'conforme').length;
      const pctConf = pVerifs.length > 0 ? Math.round((pConformes / pVerifs.length) * 100) : 100;
      const pNCs = noConformidades.filter(nc => nc.planta_id === p.id);
      const pEnsayos = ensayos.filter(e => e.planta_id === p.id).sort((a, b) => b.fecha_muestra.localeCompare(a.fecha_muestra));
      const ultimoMpa = pEnsayos[0]?.resultado_28d_mpa || null;
      const conds = condiciones.filter(c => c.planta_id === p.id);
      const vencidas = conds.filter(c => c.estado === 'vencido').length;

      // Score: 100 base, -10 per NC abierta, -20 per cond vencida, -5 if conformidad < 95%
      let score = 100;
      score -= pNCs.filter(nc => nc.estado === 'abierta').length * 10;
      score -= vencidas * 20;
      if (pctConf < 95) score -= 5;
      score = Math.max(0, Math.min(100, score));

      return {
        planta: p.codigo,
        nombre: p.nombre.replace('Planta ', ''),
        empresa: emp?.nombre || '',
        jornadas: pJornadas.length,
        verificaciones: pVerifs.length,
        conformidad: pctConf,
        ncAbiertas: pNCs.filter(nc => nc.estado === 'abierta').length,
        ncTotal: pNCs.length,
        ultimoMpa,
        condVencidas: vencidas,
        score,
      };
    })
    .filter(p => p.jornadas > 0)
    .sort((a, b) => b.score - a.score);
  }, [plantas, empresas, jornadas, verificaciones, noConformidades, ensayos, condiciones]);

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

  // ─── ENSAYOS TENDENCIA ──────────────────────────────
  const ensayosTendencia = useMemo(() => {
    return [...ensayos]
      .filter(e => e.resultado_28d_mpa != null)
      .sort((a, b) => a.fecha_muestra.localeCompare(b.fecha_muestra))
      .map(e => {
        const p = plantas.find(pl => pl.id === e.planta_id);
        return {
          fecha: e.fecha_muestra.slice(5), // MM-DD
          mpa: e.resultado_28d_mpa,
          planta: p?.codigo || '?',
          cumple: e.cumple,
        };
      });
  }, [ensayos, plantas]);

  // ─── CONFORMIDAD POR EMPRESA ────────────────────────
  const conformidadEmpresa = useMemo(() => {
    return empresas.map((emp, i) => {
      const empPlantas = plantas.filter(p => p.empresa_id === emp.id);
      const empVerifs = empPlantas.flatMap(p =>
        jornadas.filter(j => j.planta_id === p.id).flatMap(j =>
          verificaciones.filter(v => v.jornada_id === j.id)
        )
      );
      const conf = empVerifs.length > 0
        ? Math.round(empVerifs.filter(v => v.resultado === 'conforme').length / empVerifs.length * 100)
        : 100;
      return { empresa: emp.nombre, conformidad: conf, color: EMPRESA_COLORS[i % EMPRESA_COLORS.length] };
    }).filter(e => {
      const empPlantas = plantas.filter(p => p.empresa_id === empresas.find(em => em.nombre === e.empresa)?.id);
      return jornadas.some(j => empPlantas.some(p => p.id === j.planta_id));
    });
  }, [empresas, plantas, jornadas, verificaciones]);

  // Unique empresa names for the stacked bar
  const empNombres = empresas.map(e => e.nombre);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-6">
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Dashboard Ejecutivo</p>
        <h1 className="text-2xl font-bold">Control de Calidad — Programa Postes 2026</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visión consolidada de producción, calidad y trazabilidad · {empresas.length} empresas · {kpis.plantasActivas} plantas activas
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard icon="📋" label="Jornadas" value={kpis.totalJornadas} sub={`${kpis.jornadasCerradas} cerradas`} accent="primary" />
        <KpiCard icon="🏗" label="Postes Inspeccionados" value={kpis.totalVerif} sub={`${kpis.conformes} conformes`} />
        <KpiCard icon="✅" label="Conformidad" value={`${kpis.pctConformidad}%`} accent={kpis.pctConformidad >= 95 ? 'green' : 'amber'} />
        <KpiCard icon="⚠️" label="NC Abiertas" value={kpis.ncAbiertas} sub={`${kpis.ncTotal} total · ${kpis.ncPor100}‰`} accent={kpis.ncAbiertas > 0 ? 'red' : 'green'} />
        <KpiCard icon="🧪" label="MPa Prom. 28d" value={kpis.mpaProm} sub={`${ensayos.length} ensayos`} accent="primary" />
        <KpiCard icon="⏱" label="Cierre NC (días)" value={kpis.diasPromCierre} sub={kpis.condVencidas > 0 ? `⚠ ${kpis.condVencidas} cond. vencidas` : '✅ Condiciones OK'} accent={kpis.condVencidas > 0 ? 'amber' : 'green'} />
      </div>

      {/* Charts Row 1: Producción + Conformidad */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Producción mensual */}
        <Card className="xl:col-span-2 bg-card/60 border-border/40">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-4">Producción por Mes y Empresa</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={produccionMensual} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                {empNombres.map((name, i) => (
                  <Bar key={name} dataKey={name} stackId="a" fill={EMPRESA_COLORS[i % EMPRESA_COLORS.length]} radius={i === empNombres.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conformidad por empresa */}
        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-4">Conformidad por Empresa</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={conformidadEmpresa} layout="vertical" barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" unit="%" />
                <YAxis type="category" dataKey="empresa" tick={{ fontSize: 10 }} width={80} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine x={95} stroke="#22c55e" strokeDasharray="5 5" label={{ value: 'Meta 95%', fontSize: 10, fill: '#22c55e' }} />
                <Bar dataKey="conformidad" name="Conformidad %" radius={[0, 4, 4, 0]}>
                  {conformidadEmpresa.map((entry, i) => (
                    <Cell key={i} fill={entry.conformidad >= 95 ? '#22c55e' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Ensayos + NC Pareto */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Ensayos tendencia */}
        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-1">Ensayos Compresión 28d — Tendencia</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Línea de referencia: 28 MPa mínimo normativo</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={ensayosTendencia}>
                <defs>
                  <linearGradient id="gradMpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(210, 90%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(210, 90%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="fecha" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[20, 40]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" unit=" MPa" />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={28} stroke="#ef4444" strokeDasharray="5 5" label={{ value: '28 MPa', fontSize: 10, fill: '#ef4444' }} />
                <Area type="monotone" dataKey="mpa" name="Resistencia 28d" stroke="hsl(210, 90%, 60%)" fill="url(#gradMpa)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(210, 90%, 60%)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* NC por tipo defecto */}
        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-1">No Conformidades por Tipo de Defecto</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Diagrama Pareto — {kpis.ncTotal} NC registradas</p>
            {ncPorTipo.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={ncPorTipo} layout="vertical" barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <YAxis type="category" dataKey="tipo" tick={{ fontSize: 10 }} width={140} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="cantidad" name="NC" radius={[0, 4, 4, 0]}>
                    {ncPorTipo.map((_, i) => (
                      <Cell key={i} fill={DEFECTO_COLORS[i % DEFECTO_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
                Sin NC registradas
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ranking de Plantas */}
      <Card className="bg-card/60 border-border/40">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold mb-4">Ranking de Plantas — Índice de Desempeño</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">#</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Planta</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Empresa</th>
                  <th className="text-center p-3 font-medium text-muted-foreground text-xs">Jornadas</th>
                  <th className="text-center p-3 font-medium text-muted-foreground text-xs">Verificaciones</th>
                  <th className="text-center p-3 font-medium text-muted-foreground text-xs">Conformidad</th>
                  <th className="text-center p-3 font-medium text-muted-foreground text-xs">NC Abiertas</th>
                  <th className="text-center p-3 font-medium text-muted-foreground text-xs">Últ. MPa</th>
                  <th className="text-center p-3 font-medium text-muted-foreground text-xs">Score</th>
                </tr>
              </thead>
              <tbody>
                {rankingPlantas.map((p, i) => (
                  <tr key={p.planta} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono text-xs text-muted-foreground">{i + 1}</td>
                    <td className="p-3">
                      <span className="font-semibold">{p.nombre}</span>
                      <span className="text-xs text-muted-foreground ml-1.5">({p.planta})</span>
                    </td>
                    <td className="p-3 text-muted-foreground">{p.empresa}</td>
                    <td className="p-3 text-center font-medium">{p.jornadas}</td>
                    <td className="p-3 text-center font-medium">{p.verificaciones}</td>
                    <td className="p-3 text-center">
                      <span className={`font-bold ${p.conformidad >= 95 ? 'text-status-green' : p.conformidad >= 80 ? 'text-status-amber' : 'text-status-red'}`}>
                        {p.conformidad}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`font-bold ${p.ncAbiertas > 0 ? 'text-status-red' : 'text-status-green'}`}>
                        {p.ncAbiertas}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {p.ultimoMpa ? (
                        <span className={`font-medium ${p.ultimoMpa >= 28 ? 'text-status-green' : 'text-status-red'}`}>
                          {p.ultimoMpa}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${p.score >= 80 ? 'bg-status-green' : p.score >= 50 ? 'bg-status-amber' : 'bg-status-red'}`}
                            style={{ width: `${p.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold w-6">{p.score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-[10px] text-muted-foreground py-4 border-t border-border/20">
        Dashboard Ejecutivo · Control de Calidad Postes de Hormigón Armado · Grupo SAESA · Programa 2026
      </div>
    </div>
  );
}
