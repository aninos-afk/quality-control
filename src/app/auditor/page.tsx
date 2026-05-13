'use client';

import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Semaforo } from '@/components/semaforo';
import Link from 'next/link';
import type { Jornada, Empresa, Planta } from '@/lib/types';

// ─── Helpers ────────────────────────────────────────────
function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${y}`;
}

const MESES_CORTO = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_SEMANA = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

// ─── KPI Card ───────────────────────────────────────────
function KpiCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <Card className="bg-card/60 border-border/40">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <span className="text-2xl">{icon}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Calendario Component ────────────────────────────────
function CalendarioProduccion({
  jornadasVisibles,
  empresaId,
  setEmpresaId,
  empresasConProduccion,
  plantasEmpresa,
  onSelectJornada,
}: {
  jornadasVisibles: Jornada[];
  empresaId: string;
  setEmpresaId: (id: string) => void;
  empresasConProduccion: Empresa[];
  plantasEmpresa: Planta[];
  onSelectJornada: (j: Jornada) => void;
}) {
  const [plantaFiltro, setPlantaFiltro] = useState<string>(plantasEmpresa[0]?.id || '');
  const [mesOffset, setMesOffset] = useState(0);

  // Reset planta cuando cambia empresa
  useEffect(() => {
    setPlantaFiltro(plantasEmpresa[0]?.id || '');
  }, [empresaId, plantasEmpresa]);

  const empresaActual = empresasConProduccion.find(e => e.id === empresaId);

  const ahora = new Date();
  const mesBase = new Date(ahora.getFullYear(), ahora.getMonth() + mesOffset, 1);
  const year = mesBase.getFullYear();
  const month = mesBase.getMonth();

  // Días del mes
  const primerDia = new Date(year, month, 1);
  const ultimoDia = new Date(year, month + 1, 0);
  const diasEnMes = ultimoDia.getDate();
  const offsetInicio = (primerDia.getDay() + 6) % 7;

  // Filtrar jornadas del mes + planta
  const mesStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  const jornadasMes = jornadasVisibles.filter(j =>
    j.planta_id === plantaFiltro && j.fecha.startsWith(mesStr)
  );

  // Map: día → jornadas
  const jornadasPorDia = useMemo(() => {
    const map: Record<number, Jornada[]> = {};
    jornadasMes.forEach(j => {
      const dia = parseInt(j.fecha.split('-')[2]);
      if (!map[dia]) map[dia] = [];
      map[dia].push(j);
    });
    return map;
  }, [jornadasMes]);

  const celdas: (number | null)[] = [];
  for (let i = 0; i < offsetInicio; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);
  while (celdas.length % 7 !== 0) celdas.push(null);

  const plantaSeleccionada = plantasEmpresa.find(p => p.id === plantaFiltro);

  return (
    <div className="space-y-5">

      {/* Selector de empresa */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">Empresa</label>
        <div className="relative">
          <select
            value={empresaId}
            onChange={e => setEmpresaId(e.target.value)}
            className="appearance-none bg-card border border-border/60 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-foreground cursor-pointer hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {empresasConProduccion.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nombre}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-xs">▼</span>
        </div>
        {empresaActual && (
          <span className="text-xs text-muted-foreground">
            {plantasEmpresa.length} planta{plantasEmpresa.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Selector de planta */}
      <div className="flex flex-wrap gap-2">
        {plantasEmpresa.map(p => (
          <button
            key={p.id}
            onClick={() => setPlantaFiltro(p.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
              plantaFiltro === p.id
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
            }`}
          >
            {p.nombre.replace('Planta ', '')}
          </button>
        ))}
      </div>

      {/* Navegación de mes */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMesOffset(o => o - 1)}
          className="px-3 py-1.5 rounded-lg border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-all"
        >
          ← Anterior
        </button>
        <h3 className="text-lg font-bold">
          {MESES_CORTO[month]} {year}
        </h3>
        <button
          onClick={() => setMesOffset(o => o + 1)}
          disabled={mesOffset >= 0}
          className="px-3 py-1.5 rounded-lg border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          Siguiente →
        </button>
      </div>

      {/* Grilla calendario */}
      <Card className="bg-card/60 border-border/40 overflow-hidden">
        <CardContent className="p-0">
          {/* Header días */}
          <div className="grid grid-cols-7 border-b border-border/30">
            {DIAS_SEMANA.map(d => (
              <div key={d} className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          {/* Celdas */}
          <div className="grid grid-cols-7">
            {celdas.map((dia, i) => {
              const jornadas = dia ? (jornadasPorDia[dia] || []) : [];
              const tieneJornada = jornadas.length > 0;
              const esHoy = dia === ahora.getDate() && month === ahora.getMonth() && year === ahora.getFullYear();

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (jornadas.length >= 1) onSelectJornada(jornadas[0]);
                  }}
                  className={`
                    relative min-h-[80px] p-2 border-b border-r border-border/15 transition-all duration-150
                    ${dia === null ? 'bg-muted/5' : ''}
                    ${tieneJornada ? 'cursor-pointer hover:bg-primary/5' : ''}
                    ${esHoy ? 'bg-primary/5' : ''}
                  `}
                >
                  {dia !== null && (
                    <>
                      <span className={`text-xs font-medium ${esHoy ? 'text-primary font-bold' : tieneJornada ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                        {dia}
                      </span>

                      {jornadas.map(j => (
                        <div key={j.id} className="mt-1.5">
                          <div className={`
                            text-[10px] leading-tight px-2 py-1 rounded-md font-semibold
                            ${j.estado === 'cerrada' ? 'bg-status-green/15 text-status-green border border-status-green/20' : 'bg-status-amber/15 text-status-amber border border-status-amber/20'}
                          `}>
                            {j.codigo}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Leyenda */}
      <div className="flex items-center gap-5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-status-green/20 border border-status-green/30" />
          <span>Liberado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-status-amber/20 border border-status-amber/30" />
          <span>En proceso</span>
        </div>
        <span className="ml-auto">
          {jornadasMes.length} jornada{jornadasMes.length !== 1 ? 's' : ''} en {MESES_CORTO[month].toLowerCase()}
          {plantaSeleccionada && ` · ${plantaSeleccionada.nombre}`}
        </span>
      </div>
    </div>
  );
}

// ─── Popup Jornada ───────────────────────────────────────
function PopupJornada({
  jornada,
  onClose,
}: {
  jornada: Jornada;
  onClose: () => void;
}) {
  const { verificaciones, ensayos, usuarios, plantas, empresas, desmoldes, productoTerminado } = useApp();

  const planta = plantas.find(p => p.id === jornada.planta_id);
  const empresa = empresas.find(e => e.id === planta?.empresa_id);
  const jefePlanta = usuarios.find(u => u.id === jornada.jefe_planta_id);
  const encCalidad = usuarios.find(u => u.id === jornada.encargado_calidad_id);
  const ensayoVinculado = ensayos.find(e => e.jornada_id === jornada.id);
  const verifs = verificaciones.filter(v => v.jornada_id === jornada.id);
  const nConforme = verifs.filter(v => v.resultado === 'conforme').length;
  const desmolde = desmoldes.find(d => d.jornada_id === jornada.id);
  const pt = productoTerminado.find(p => p.jornada_id === jornada.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-card border border-border/60 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border/30 px-5 py-4 flex items-start justify-between gap-3 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-base">{jornada.codigo}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                jornada.estado === 'cerrada'
                  ? 'bg-status-green/15 text-status-green'
                  : 'bg-status-amber/15 text-status-amber'
              }`}>
                {jornada.estado === 'cerrada' ? 'Liberado' : 'En proceso'}
              </span>
              {jornada.destino === 'SAESA' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold uppercase">
                  SAESA
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {empresa?.nombre} — {planta?.nombre} · {formatDate(jornada.fecha)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-4">
          {/* Postes */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Tipos de poste</p>
            <div className="flex flex-wrap gap-1.5">
              {jornada.tipos_poste.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium border border-primary/20">
                  🏗 {t}
                </span>
              ))}
            </div>
          </div>

          {/* Datos de producción */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-muted/20 text-center">
              <p className="text-lg font-bold">{jornada.cono_abrams_mm}</p>
              <p className="text-[10px] text-muted-foreground">Cono mm</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 text-center">
              <p className="text-lg font-bold">{jornada.temperatura}°</p>
              <p className="text-[10px] text-muted-foreground">Temp.</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 text-center">
              <p className="text-lg font-bold">{jornada.humedad_relativa}%</p>
              <p className="text-[10px] text-muted-foreground">HR</p>
            </div>
          </div>

          {/* Materiales */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Materiales</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/15">
                <span className="text-muted-foreground">Cemento</span>
                <span className="font-medium">{jornada.lote_cemento}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/15">
                <span className="text-muted-foreground">Acero</span>
                <span className="font-medium">{jornada.lote_acero}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Áridos</span>
                <span className="font-medium">{jornada.partida_aridos}</span>
              </div>
            </div>
          </div>

          {/* Inspección */}
          {verifs.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Inspección fabricación</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${nConforme === verifs.length ? 'bg-status-green' : 'bg-status-amber'}`}
                    style={{ width: `${(nConforme / verifs.length) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold ${nConforme === verifs.length ? 'text-status-green' : 'text-status-amber'}`}>
                  {nConforme}/{verifs.length}
                </span>
              </div>
            </div>
          )}

          {/* Desmolde & PT */}
          {(desmolde || pt) && (
            <div className="grid grid-cols-2 gap-3">
              {desmolde && (
                <div className={`p-3 rounded-xl text-center text-xs ${desmolde.defectos_detectados ? 'bg-status-amber/10' : 'bg-status-green/10'}`}>
                  <p className="font-semibold">{desmolde.defectos_detectados ? '⚠️ Defectos' : '✅ Sin defectos'}</p>
                  <p className="text-muted-foreground mt-0.5">Desmolde</p>
                </div>
              )}
              {pt && (
                <div className={`p-3 rounded-xl text-center text-xs ${pt.resultado === 'conforme' ? 'bg-status-green/10' : 'bg-status-red/10'}`}>
                  <p className="font-semibold">{pt.resultado === 'conforme' ? '✅ Conforme' : '❌ No conforme'}</p>
                  <p className="text-muted-foreground mt-0.5">Producto terminado</p>
                </div>
              )}
            </div>
          )}

          {/* Ensayo */}
          {ensayoVinculado && (
            <div className={`p-4 rounded-xl border-2 ${ensayoVinculado.cumple ? 'border-status-green/30 bg-status-green/5' : 'border-status-red/30 bg-status-red/5'}`}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Ensayo compresión 28d</p>
              <div className="flex items-end gap-3">
                <p className="text-2xl font-bold">{ensayoVinculado.resultado_28d_mpa} <span className="text-sm font-normal">MPa</span></p>
                <span className={`text-sm font-semibold mb-0.5 ${ensayoVinculado.cumple ? 'text-status-green' : 'text-status-red'}`}>
                  {ensayoVinculado.tipo_hormigon} · {ensayoVinculado.cumple ? '✅ Cumple' : '❌ No cumple'}
                </span>
              </div>
            </div>
          )}

          {/* Responsables */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/20">
            {jefePlanta && <span>👤 <strong>Jefe Planta:</strong> {jefePlanta.nombre}</span>}
            {encCalidad && <span>🔬 <strong>Enc. Calidad:</strong> {encCalidad.nombre}</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border/30 px-5 py-3 flex items-center justify-between">
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Cerrar
          </button>
          <div className="flex items-center gap-2">
            <Link
              href={`/auditor/expediente/${jornada.planta_id}`}
              className="text-xs px-4 py-2 rounded-lg bg-muted/60 text-foreground font-medium hover:bg-muted transition-all"
            >
              📋 Expediente
            </Link>
            <Link
              href={`/auditor/jornadas/${jornada.id}`}
              className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
            >
              Ver ficha completa →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Vista Auditor Externo ───────────────────────────────
function VistaAuditorExterno() {
  const { jornadas, verificaciones, ensayos, empresas, plantas, condiciones, noConformidades } = useApp();
  const [vista, setVista] = useState<'calendario' | 'consolidada'>('consolidada');
  const [empresaCalendario, setEmpresaCalendario] = useState<string>('');
  const [jornadaPopup, setJornadaPopup] = useState<Jornada | null>(null);
  const [alertasExpandidas, setAlertasExpandidas] = useState(false);

  const jornadasVisibles = jornadas.filter(j => j.estado === 'cerrada' && j.visible_externo === true);

  // Empresas que tienen al menos una jornada visible
  const empresasConProduccion = empresas.filter(emp => {
    const empPlantas = plantas.filter(p => p.empresa_id === emp.id);
    return jornadasVisibles.some(j => empPlantas.some(p => p.id === j.planta_id));
  });

  const plantasConProduccion = plantas.filter(p => jornadasVisibles.some(j => j.planta_id === p.id));

  // Plantas de la empresa seleccionada en calendario (solo las que tienen jornadas)
  const plantasEmpresaCalendario = plantas.filter(
    p => p.empresa_id === empresaCalendario && jornadasVisibles.some(j => j.planta_id === p.id)
  );

  // KPIs
  const totalEnsayos = ensayos.filter(e => e.jornada_id && jornadasVisibles.some(j => j.id === e.jornada_id)).length;
  const todasVerif = jornadasVisibles.flatMap(j => verificaciones.filter(v => v.jornada_id === j.id));
  const pctConforme = todasVerif.length > 0
    ? Math.round(todasVerif.filter(v => v.resultado === 'conforme').length / todasVerif.length * 100)
    : 100;

  // ─── ALERTAS PROACTIVAS ──────────────────────────────
  type Alerta = { id: string; nivel: 'rojo' | 'amarillo'; icono: string; titulo: string; detalle: string; plantaId: string };

  const alertas = useMemo(() => {
    const result: Alerta[] = [];
    const hoy = Date.now();
    const MS_DIA = 1000 * 60 * 60 * 24;

    plantas.forEach(planta => {
      const empresa = empresas.find(e => e.id === planta.empresa_id);
      const tag = `${empresa?.nombre || ''} — ${planta.nombre.replace('Planta ', '')}`;

      // 1. Condiciones vencidas
      condiciones.filter(c => c.planta_id === planta.id && c.estado === 'vencido').forEach(c => {
        result.push({
          id: `cond-v-${c.id}`, nivel: 'rojo', icono: '🔴',
          titulo: `Condición vencida: ${c.descripcion}`,
          detalle: tag + (c.fecha_vencimiento ? ` · Venció el ${formatDate(c.fecha_vencimiento)}` : ''),
          plantaId: planta.id,
        });
      });

      // 2. Condiciones por vencer (< 30 días)
      condiciones.filter(c => c.planta_id === planta.id && c.estado === 'por_vencer').forEach(c => {
        const diasRestantes = c.fecha_vencimiento
          ? Math.ceil((new Date(c.fecha_vencimiento).getTime() - hoy) / MS_DIA) : 0;
        result.push({
          id: `cond-pv-${c.id}`, nivel: 'amarillo', icono: '🟡',
          titulo: `Condición por vencer en ${diasRestantes} días: ${c.descripcion}`,
          detalle: tag + (c.fecha_vencimiento ? ` · Vence el ${formatDate(c.fecha_vencimiento)}` : ''),
          plantaId: planta.id,
        });
      });

      // 3. NC abiertas > 15 días sin cierre
      noConformidades.filter(nc => nc.planta_id === planta.id && nc.estado === 'abierta').forEach(nc => {
        const diasAbierta = Math.floor((hoy - new Date(nc.fecha_deteccion).getTime()) / MS_DIA);
        if (diasAbierta > 15) {
          result.push({
            id: `nc-${nc.id}`, nivel: 'rojo', icono: '⚠️',
            titulo: `NC abierta hace ${diasAbierta} días: ${nc.numero}`,
            detalle: tag + ` · ${nc.detalle?.substring(0, 60)}...`,
            plantaId: planta.id,
          });
        } else {
          result.push({
            id: `nc-${nc.id}`, nivel: 'amarillo', icono: '⚠️',
            titulo: `NC abierta: ${nc.numero}`,
            detalle: tag + ` · ${diasAbierta} días · ${nc.detalle?.substring(0, 60)}`,
            plantaId: planta.id,
          });
        }
      });

      // 4. Ensayos atrasados (> 30 días sin ensayo nuevo)
      const ensayosPlanta = ensayos.filter(e => e.planta_id === planta.id)
        .sort((a, b) => b.fecha_muestra.localeCompare(a.fecha_muestra));
      if (ensayosPlanta.length > 0) {
        const diasUltimoEnsayo = Math.floor((hoy - new Date(ensayosPlanta[0].fecha_muestra).getTime()) / MS_DIA);
        if (diasUltimoEnsayo > 45) {
          result.push({
            id: `ens-${planta.id}`, nivel: 'rojo', icono: '🧪',
            titulo: `Sin ensayo de compresión hace ${diasUltimoEnsayo} días`,
            detalle: tag + ` · Último: ${formatDate(ensayosPlanta[0].fecha_muestra)}`,
            plantaId: planta.id,
          });
        } else if (diasUltimoEnsayo > 30) {
          result.push({
            id: `ens-${planta.id}`, nivel: 'amarillo', icono: '🧪',
            titulo: `Ensayo de compresión pendiente (${diasUltimoEnsayo} días)`,
            detalle: tag + ` · Último: ${formatDate(ensayosPlanta[0].fecha_muestra)}`,
            plantaId: planta.id,
          });
        }
      }
    });

    // Ordenar: rojos primero
    return result.sort((a, b) => (a.nivel === 'rojo' ? 0 : 1) - (b.nivel === 'rojo' ? 0 : 1));
  }, [plantas, empresas, condiciones, noConformidades, ensayos]);

  const alertasRojas = alertas.filter(a => a.nivel === 'rojo').length;
  const alertasAmarillas = alertas.filter(a => a.nivel === 'amarillo').length;

  // Función para navegar desde consolidado al calendario con empresa preseleccionada
  const irACalendario = (empresaId: string) => {
    setEmpresaCalendario(empresaId);
    setVista('calendario');
  };

  // Cuando se hace click en el toggle "Calendario" sin contexto, preseleccionar primera empresa
  const handleToggleCalendario = () => {
    if (!empresaCalendario && empresasConProduccion.length > 0) {
      setEmpresaCalendario(empresasConProduccion[0].id);
    }
    setVista('calendario');
  };

  return (
    <div className="space-y-8">

      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Portal de Trazabilidad</p>
            <h1 className="text-2xl font-bold">Registro de Producción</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Postes de hormigón armado · Control de calidad certificado
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground hidden sm:block">
            <p className="font-medium text-foreground">Programa SAESA 2026</p>
          </div>
        </div>
      </div>

      {/* ── BANNER DE ALERTAS PROACTIVAS ── */}
      {alertas.length > 0 && (
        <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
          alertasRojas > 0
            ? 'border-status-red/30 bg-status-red/5'
            : 'border-status-amber/30 bg-status-amber/5'
        }`}>
          {/* Resumen compacto — siempre visible */}
          <button
            onClick={() => setAlertasExpandidas(!alertasExpandidas)}
            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-black/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{alertasRojas > 0 ? '🚨' : '⚡'}</span>
              <div className="text-left">
                <p className="text-sm font-bold">
                  {alertas.length} alerta{alertas.length !== 1 ? 's' : ''} requiere{alertas.length === 1 ? '' : 'n'} atención
                </p>
                <p className="text-xs text-muted-foreground">
                  {alertasRojas > 0 && <span className="text-status-red font-semibold">{alertasRojas} urgente{alertasRojas > 1 ? 's' : ''}</span>}
                  {alertasRojas > 0 && alertasAmarillas > 0 && ' · '}
                  {alertasAmarillas > 0 && <span className="text-status-amber font-semibold">{alertasAmarillas} preventiva{alertasAmarillas > 1 ? 's' : ''}</span>}
                </p>
              </div>
            </div>
            <span className={`text-xs transition-transform duration-200 ${alertasExpandidas ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {/* Detalle expandido */}
          {alertasExpandidas && (
            <div className="border-t border-border/20 divide-y divide-border/10 max-h-[320px] overflow-y-auto">
              {alertas.map(a => (
                <Link
                  key={a.id}
                  href={`/auditor/expediente/${a.plantaId}`}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-black/5 transition-colors group"
                >
                  <span className="text-sm mt-0.5 shrink-0">{a.icono}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold group-hover:text-primary transition-colors">{a.titulo}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{a.detalle}</p>
                  </div>
                  <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                    Ver expediente →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toggle de vista */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl w-fit">
        <button
          onClick={() => setVista('consolidada')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            vista === 'consolidada' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          📊 Consolidado
        </button>
        <button
          onClick={handleToggleCalendario}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            vista === 'calendario' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          📅 Calendario
        </button>
      </div>

      {/* ── VISTA CONSOLIDADA ── */}
      {vista === 'consolidada' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {empresas.map(emp => {
            const empPlantas = plantas.filter(p => p.empresa_id === emp.id);
            const empJornadas = jornadasVisibles.filter(j => empPlantas.some(p => p.id === j.planta_id));
            if (empJornadas.length === 0) return null;

            const empVerifs = empJornadas.flatMap(j => verificaciones.filter(v => v.jornada_id === j.id));
            const empConformidad = empVerifs.length > 0
              ? Math.round(empVerifs.filter(v => v.resultado === 'conforme').length / empVerifs.length * 100)
              : 100;
            const ultimoEnsayo = ensayos
              .filter(e => empPlantas.some(p => p.id === e.planta_id) && e.jornada_id)
              .sort((a, b) => b.fecha_muestra.localeCompare(a.fecha_muestra))[0];

            const plantasActivas = empPlantas.filter(p => empJornadas.some(j => j.planta_id === p.id));

            return (
              <Card key={emp.id} className="bg-card/60 border-border/40 hover:border-primary/30 transition-all duration-200">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                      {emp.nombre.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{emp.nombre}</h3>
                      <p className="text-xs text-muted-foreground">
                        {plantasActivas.map(p => p.nombre.replace('Planta ', '')).join(' · ')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-xl bg-muted/30">
                      <p className="text-2xl font-bold">{empJornadas.length}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">jornadas publicadas</p>
                    </div>
                    <div className={`text-center p-3 rounded-xl ${empConformidad === 100 ? 'bg-status-green/10' : 'bg-status-amber/10'}`}>
                      <p className={`text-2xl font-bold ${empConformidad === 100 ? 'text-status-green' : 'text-status-amber'}`}>{empConformidad}%</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">conformidad</p>
                    </div>
                  </div>

                  {ultimoEnsayo && (
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-muted/20 border border-border/20">
                      <span className="text-muted-foreground">Último ensayo 28d</span>
                      <span className={`font-bold ${ultimoEnsayo.cumple ? 'text-status-green' : 'text-status-red'}`}>
                        {ultimoEnsayo.resultado_28d_mpa} MPa · {ultimoEnsayo.tipo_hormigon} {ultimoEnsayo.cumple ? '✅' : '❌'}
                      </span>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground flex flex-col gap-2 pt-1 border-t border-border/20">
                    <div className="flex items-center justify-between">
                      <span>{plantasActivas.length} planta{plantasActivas.length !== 1 ? 's' : ''} activa{plantasActivas.length !== 1 ? 's' : ''}</span>
                      <button
                        onClick={() => irACalendario(emp.id)}
                        className="text-primary hover:underline"
                      >
                        Ver calendario →
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {plantasActivas.map(p => (
                        <Link
                          key={p.id}
                          href={`/auditor/expediente/${p.id}`}
                          className="text-[10px] px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
                        >
                          📋 {p.nombre.replace('Planta ', '')}
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── VISTA CALENDARIO ── */}
      {vista === 'calendario' && empresaCalendario && (
        <CalendarioProduccion
          jornadasVisibles={jornadasVisibles}
          empresaId={empresaCalendario}
          setEmpresaId={setEmpresaCalendario}
          empresasConProduccion={empresasConProduccion}
          plantasEmpresa={plantasEmpresaCalendario}
          onSelectJornada={setJornadaPopup}
        />
      )}

      {/* KPIs — resumen compacto al pie */}
      <div className="rounded-xl border border-border/30 bg-card/40 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">📋</span>
            <div>
              <p className="text-sm font-bold leading-none">{jornadasVisibles.length}</p>
              <p className="text-[10px] text-muted-foreground">Jornadas</p>
            </div>
          </div>
          <div className="w-px h-8 bg-border/30" />
          <div className="flex items-center gap-2">
            <span className="text-sm">🏭</span>
            <div>
              <p className="text-sm font-bold leading-none">{plantasConProduccion.length}</p>
              <p className="text-[10px] text-muted-foreground">Plantas</p>
            </div>
          </div>
          <div className="w-px h-8 bg-border/30" />
          <div className="flex items-center gap-2">
            <span className="text-sm">🧪</span>
            <div>
              <p className="text-sm font-bold leading-none">{totalEnsayos}</p>
              <p className="text-[10px] text-muted-foreground">Ensayos</p>
            </div>
          </div>
          <div className="w-px h-8 bg-border/30" />
          <div className="flex items-center gap-2">
            <span className="text-sm">✅</span>
            <div>
              <p className="text-sm font-bold leading-none">{pctConforme}%</p>
              <p className="text-[10px] text-muted-foreground">Conformidad</p>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">Programa SAESA 2026</p>
      </div>

      {/* Popup */}
      {jornadaPopup && (
        <PopupJornada jornada={jornadaPopup} onClose={() => setJornadaPopup(null)} />
      )}
    </div>
  );
}

// ─── Vista Admin Plataforma ──────────────────────────────
function VistaAdminPlataforma() {
  const { empresas, getPlantasByEmpresa, getCondicionesByPlanta, getJornadasByPlanta, getNCByPlanta } = useApp();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Empresas</h1>
        <p className="text-muted-foreground text-sm mt-1">Vista consolidada de todas las empresas registradas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {empresas.map(emp => {
          const plantasEmp = getPlantasByEmpresa(emp.id);
          let vencidas = 0, porVencer = 0, ncAbiertas = 0, jornadasMes = 0;
          const mesActual = new Date().toISOString().slice(0, 7);
          plantasEmp.forEach(p => {
            const conds = getCondicionesByPlanta(p.id);
            vencidas += conds.filter(c => c.estado === 'vencido').length;
            porVencer += conds.filter(c => c.estado === 'por_vencer').length;
            ncAbiertas += getNCByPlanta(p.id).filter(nc => nc.estado === 'abierta').length;
            jornadasMes += getJornadasByPlanta(p.id).filter(j => j.fecha.startsWith(mesActual)).length;
          });
          const estado = vencidas > 0 ? 'vencido' as const : porVencer > 0 ? 'por_vencer' as const : 'vigente' as const;

          return (
            <Link key={emp.id} href={`/auditor/fabricas/${emp.id}`}>
              <Card className="bg-card/50 border-border/50 hover:bg-muted/20 transition-all duration-200 cursor-pointer h-full">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">🏢</div>
                    <div>
                      <h3 className="font-semibold text-sm">{emp.nombre}</h3>
                      <p className="text-xs text-muted-foreground">{plantasEmp.length} planta{plantasEmp.length !== 1 ? 's' : ''}</p>
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
                  </div>
                  <div className="pt-2 border-t border-border/30">
                    <span className="text-xs text-primary">Ver plantas →</span>
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

// ─── Entry point ─────────────────────────────────────────
export default function AuditorDashboard() {
  const { user } = useAuth();
  if (user?.rol === 'auditor_externo') return <VistaAuditorExterno />;
  return <VistaAdminPlataforma />;
}
