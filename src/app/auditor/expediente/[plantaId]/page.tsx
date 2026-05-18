'use client';

import { use, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Semaforo, SemaforoResumen } from '@/components/semaforo';
import { useRouter } from 'next/navigation';

// ─── Helpers ────────────────────────────────────────
function formatDate(iso?: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(d)} ${meses[parseInt(m) - 1]} ${y}`;
}

function diasDesde(iso?: string) {
  if (!iso) return 999;
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

const TIPO_CONDICION_LABEL: Record<string, string> = {
  resolucion_sanitaria: 'Resolución sanitaria',
  certificacion_iso: 'Certificación ISO',
  poliza_seguro: 'Póliza de seguro',
  permiso_municipal: 'Permiso municipal',
  calibracion_equipos: 'Calibración de equipos',
  certificado_cemento: 'Certificado cemento',
  certificado_acero: 'Certificado acero',
  certificado_aridos: 'Certificado áridos',
  otro: 'Otro',
};

const TIPO_MATERIAL_LABEL: Record<string, string> = {
  cemento: 'Cemento',
  acero: 'Acero',
  aridos: 'Áridos',
  aditivo: 'Aditivo',
  alambre: 'Alambre',
  membrana_curado: 'Membrana curado',
};

const DEFECTO_LABEL: Record<string, string> = {
  despunte: 'Despunte / Desprendimiento',
  fisura_menor: 'Fisura ≤ 0.2 mm',
  nido: 'Nido de abeja',
  otro: 'Otro',
};

type Tab = 'condiciones' | 'materiales' | 'ensayos' | 'nc' | 'moldes';

// ─── Section badge ──────────────────────────────────
function TabButton({ active, label, count, color, onClick }: {
  active: boolean; label: string; count: number; color?: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
        active
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground'
      }`}
    >
      {label}
      <span className={`ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold ${
        active ? 'bg-primary-foreground/20 text-primary-foreground' : `${color || 'bg-muted'} text-muted-foreground`
      }`}>
        {count}
      </span>
    </button>
  );
}

// ─── Expediente Page ────────────────────────────────
export default function ExpedientePlantaPage({ params }: { params: Promise<{ plantaId: string }> }) {
  const { plantaId } = use(params);
  const {
    getPlanta, empresas,
    getCondicionesByPlanta, getMaterialesByPlanta, getMoldesByPlanta,
    getEnsayosByPlanta, getNCByPlanta, getTrabajadoresByPlanta,
    getJornadasByPlanta,
  } = useApp();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('condiciones');

  const planta = getPlanta(plantaId);
  const empresa = empresas.find(e => e.id === planta?.empresa_id);

  if (!planta) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-3">
        <p className="text-4xl">🔒</p>
        <h2 className="text-lg font-semibold">Planta no encontrada</h2>
        <button onClick={() => router.back()} className="text-xs text-primary hover:underline">← Volver al portal</button>
      </div>
    );
  }

  const condiciones = getCondicionesByPlanta(plantaId);
  const materiales = getMaterialesByPlanta(plantaId);
  const moldes = getMoldesByPlanta(plantaId);
  const ensayos = getEnsayosByPlanta(plantaId).sort((a, b) => b.fecha_muestra.localeCompare(a.fecha_muestra));
  const ncs = getNCByPlanta(plantaId).sort((a, b) => b.fecha_deteccion.localeCompare(a.fecha_deteccion));
  const trabajadores = getTrabajadoresByPlanta(plantaId);
  const jornadas = getJornadasByPlanta(plantaId);

  const vigentes = condiciones.filter(c => c.estado === 'vigente').length;
  const porVencer = condiciones.filter(c => c.estado === 'por_vencer').length;
  const vencidas = condiciones.filter(c => c.estado === 'vencido').length;
  const ncAbiertas = ncs.filter(nc => nc.estado === 'abierta').length;
  const jornadasCerradas = jornadas.filter(j => j.estado === 'cerrada' && j.visible_externo).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Back */}
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        ← Volver al portal
      </button>

      {/* Header */}
      <div className="rounded-2xl overflow-hidden border border-border/40">
        <div className="bg-gradient-to-r from-primary/25 via-primary/10 to-transparent px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Expediente de Planta</p>
              <h1 className="text-xl font-bold">{planta.nombre}</h1>
              <p className="text-sm text-muted-foreground mt-1">{empresa?.nombre} · {planta.codigo}</p>
            </div>
            <div className="text-right shrink-0 space-y-1">
              <SemaforoResumen vigentes={vigentes} porVencer={porVencer} vencidas={vencidas} />
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="bg-card/60 px-6 py-4 border-t border-border/30 grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold">{condiciones.length}</p>
            <p className="text-[10px] text-muted-foreground">Condiciones</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{materiales.filter(m => m.activo).length}</p>
            <p className="text-[10px] text-muted-foreground">Materiales activos</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{moldes.filter(m => m.activo).length}</p>
            <p className="text-[10px] text-muted-foreground">Moldes operativos</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{ensayos.length}</p>
            <p className="text-[10px] text-muted-foreground">Ensayos</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{jornadasCerradas}</p>
            <p className="text-[10px] text-muted-foreground">Jornadas publicadas</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <TabButton active={tab === 'condiciones'} label="📋 Condiciones" count={condiciones.length} onClick={() => setTab('condiciones')} />
        <TabButton active={tab === 'materiales'} label="🧱 Materiales" count={materiales.filter(m => m.activo).length} onClick={() => setTab('materiales')} />
        <TabButton active={tab === 'moldes'} label="🔧 Moldes" count={moldes.length} onClick={() => setTab('moldes')} />
        <TabButton active={tab === 'ensayos'} label="🧪 Ensayos" count={ensayos.length} onClick={() => setTab('ensayos')} />
        <TabButton active={tab === 'nc'} label="⚠️ No Conformidades" count={ncs.length} color={ncAbiertas > 0 ? 'bg-status-red/20' : undefined} onClick={() => setTab('nc')} />
      </div>

      {/* ── CONDICIONES HABILITANTES ── */}
      {tab === 'condiciones' && (
        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b border-border/30">
              <h2 className="text-sm font-bold">Condiciones Habilitantes</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Documentos y certificaciones vigentes de la planta</p>
            </div>
            {condiciones.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">Sin condiciones registradas</p>
            ) : (
              <div className="divide-y divide-border/15">
                {condiciones.map(c => (
                  <div key={c.id} className="px-6 py-3 flex items-center gap-4 hover:bg-muted/5 transition-colors">
                    <Semaforo estado={c.estado} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{c.descripcion}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {TIPO_CONDICION_LABEL[c.tipo] || c.tipo}
                        {c.norma_referencia && ` · ${c.norma_referencia}`}
                        {c.entidad_emisora && ` · ${c.entidad_emisora}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {c.fecha_vencimiento && (
                        <p className={`text-[10px] font-medium ${
                          c.estado === 'vencido' ? 'text-status-red' :
                          c.estado === 'por_vencer' ? 'text-status-amber' : 'text-muted-foreground'
                        }`}>
                          Vence: {formatDate(c.fecha_vencimiento)}
                        </p>
                      )}
                      {c.frecuencia_descripcion && (
                        <p className="text-[10px] text-muted-foreground">{c.frecuencia_descripcion}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── MATERIALES ── */}
      {tab === 'materiales' && (
        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b border-border/30">
              <h2 className="text-sm font-bold">Materiales Activos</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Materias primas con certificados vigentes</p>
            </div>
            {materiales.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">Sin materiales registrados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/30 text-left text-muted-foreground">
                      <th className="px-6 py-3 font-semibold">Tipo</th>
                      <th className="px-4 py-3 font-semibold">Proveedor</th>
                      <th className="px-4 py-3 font-semibold">Lote</th>
                      <th className="px-4 py-3 font-semibold">Recepción</th>
                      <th className="px-4 py-3 font-semibold text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/15">
                    {materiales.map(m => (
                      <tr key={m.id} className="hover:bg-muted/5 transition-colors">
                        <td className="px-6 py-3 font-medium">{TIPO_MATERIAL_LABEL[m.tipo] || m.tipo}</td>
                        <td className="px-4 py-3 text-muted-foreground">{m.proveedor || '—'}</td>
                        <td className="px-4 py-3 font-mono">{m.codigo_lote}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(m.fecha_recepcion)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            m.activo ? 'bg-status-green/15 text-status-green' : 'bg-muted text-muted-foreground'
                          }`}>
                            {m.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── MOLDES ── */}
      {tab === 'moldes' && (
        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b border-border/30">
              <h2 className="text-sm font-bold">Moldes y Equipamiento</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Inventario de moldes registrados en la planta</p>
            </div>
            {moldes.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">Sin moldes registrados</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                {moldes.map(m => (
                  <div key={m.id} className={`p-4 rounded-xl border transition-all ${
                    m.activo ? 'border-status-green/30 bg-status-green/5' : 'border-border/30 bg-muted/10 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-sm">{m.numero}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        m.activo ? 'bg-status-green/15 text-status-green' : 'bg-muted text-muted-foreground'
                      }`}>
                        {m.activo ? 'Operativo' : 'Inactivo'}
                      </span>
                    </div>
                    {m.tipo_poste && <p className="text-xs text-muted-foreground">Poste: {m.tipo_poste}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Personal capacitado */}
            {trabajadores.length > 0 && (
              <>
                <div className="px-6 py-4 border-t border-b border-border/30">
                  <h2 className="text-sm font-bold">Personal Capacitado</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{trabajadores.filter(t => t.activo).length} operadores activos</p>
                </div>
                <div className="divide-y divide-border/15">
                  {trabajadores.filter(t => t.activo).map(t => (
                    <div key={t.id} className="px-6 py-3 flex items-center justify-between hover:bg-muted/5 transition-colors">
                      <div>
                        <p className="text-xs font-semibold">{t.nombre}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {t.actividades_habilitadas.join(', ')}
                        </p>
                      </div>
                      {t.fecha_ultima_capacitacion && (
                        <p className="text-[10px] text-muted-foreground shrink-0">
                          Últ. capacitación: {formatDate(t.fecha_ultima_capacitacion)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── ENSAYOS ── */}
      {tab === 'ensayos' && (
        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b border-border/30">
              <h2 className="text-sm font-bold">Ensayos de Compresión</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Historial de resistencia del hormigón</p>
            </div>
            {ensayos.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">Sin ensayos registrados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/30 text-left text-muted-foreground">
                      <th className="px-6 py-3 font-semibold">Fecha muestra</th>
                      <th className="px-4 py-3 font-semibold">Hormigón</th>
                      <th className="px-4 py-3 font-semibold text-right">7 días (MPa)</th>
                      <th className="px-4 py-3 font-semibold text-right">28 días (MPa)</th>
                      <th className="px-4 py-3 font-semibold">Laboratorio</th>
                      <th className="px-4 py-3 font-semibold text-center">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/15">
                    {ensayos.map(e => (
                      <tr key={e.id} className="hover:bg-muted/5 transition-colors">
                        <td className="px-6 py-3 font-medium">{formatDate(e.fecha_muestra)}</td>
                        <td className="px-4 py-3 font-mono">{e.tipo_hormigon}</td>
                        <td className="px-4 py-3 text-right font-bold">{e.resultado_7d_mpa ?? '—'}</td>
                        <td className="px-4 py-3 text-right font-bold">{e.resultado_28d_mpa ?? '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{e.laboratorio}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            e.cumple ? 'bg-status-green/15 text-status-green' : 'bg-status-red/15 text-status-red'
                          }`}>
                            {e.cumple ? '✅ Cumple' : '❌ No cumple'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── NO CONFORMIDADES ── */}
      {tab === 'nc' && (
        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold">No Conformidades</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Hallazgos y acciones de calidad</p>
              </div>
              {ncAbiertas > 0 && (
                <span className="text-xs px-3 py-1 rounded-full bg-status-red/15 text-status-red font-semibold">
                  {ncAbiertas} abierta{ncAbiertas > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {ncs.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">Sin no conformidades registradas</p>
            ) : (
              <div className="divide-y divide-border/15">
                {ncs.map(nc => (
                  <div key={nc.id} className="px-6 py-4 hover:bg-muted/5 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs">{nc.numero}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                          nc.estado === 'abierta' ? 'bg-status-red/15 text-status-red' : 'bg-status-green/15 text-status-green'
                        }`}>
                          {nc.estado}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                          {nc.nivel}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">{formatDate(nc.fecha_deteccion)}</span>
                    </div>
                    <p className="text-xs text-foreground mb-1">{nc.detalle}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                      <span>Tipo: {DEFECTO_LABEL[nc.tipo_defecto] || nc.tipo_defecto}</span>
                      {nc.tipo_poste && <span>Poste: {nc.tipo_poste}</span>}
                      {nc.disposicion && <span>Disposición: {nc.disposicion.replace(/_/g, ' ')}</span>}
                      {nc.accion_inmediata && <span>Acción: {nc.accion_inmediata}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground py-4">
        <p>Expediente generado por el Sistema de Gestión de Calidad | Grupo SAESA</p>
      </div>
    </div>
  );
}
