'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PhotoUploader } from '@/components/photo-uploader';
import { ESTADO_RECEPCION_LABELS, TIPOS_POSTE } from '@/lib/constants';
import { PUNTOS_INSPECCION_DESPACHO } from '@/lib/types';
import type { EstadoRecepcion } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function DespachoDetallePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { user, can } = useAuth();
  const { getDespacho, updateDespacho, addAuditLog, jornadas } = useApp();

  const despacho = getDespacho(id);

  // Estado para el formulario de recepción
  const [editandoRecepcion, setEditandoRecepcion] = useState(false);
  const [estadoRec, setEstadoRec]       = useState<EstadoRecepcion>('conforme');
  const [fechaRec, setFechaRec]         = useState(new Date().toISOString().slice(0, 10));
  const [receptor, setReceptor]         = useState('');
  const [obsRec, setObsRec]             = useState('');
  const [danos, setDanos]               = useState('');
  const [fotosRec, setFotosRec]         = useState<string[]>([]);
  const [saving, setSaving]             = useState(false);

  const resumenPorTipo = useMemo(() => {
    if (!despacho) return [];
    const map = new Map<string, number>();
    despacho.postes.forEach(p => map.set(p.tipo_poste, (map.get(p.tipo_poste) || 0) + 1));
    return Array.from(map.entries());
  }, [despacho]);

  if (!despacho) {
    return <div className="text-center py-20 text-muted-foreground">Despacho no encontrado.</div>;
  }
  if (!can('ver_despachos')) {
    return <div className="text-center py-20 text-muted-foreground">Sin permisos para ver despachos.</div>;
  }

  const rec = ESTADO_RECEPCION_LABELS[despacho.estado_recepcion];

  // ── Guardar recepción ──
  const guardarRecepcion = () => {
    if (!user) return;
    setSaving(true);

    updateDespacho(despacho.id, {
      estado_recepcion: estadoRec,
      fecha_recepcion: fechaRec,
      nombre_receptor: receptor.trim() || undefined,
      fotos_recepcion_urls: fotosRec,
      observaciones_recepcion: obsRec.trim() || undefined,
      danos_detectados: estadoRec === 'con_danos' ? danos.trim() : undefined,
    });

    addAuditLog({
      id: `audit-rec-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      hora: new Date().toTimeString().slice(0, 5),
      usuario_id: user.id,
      usuario_nombre: user.nombre,
      rol: user.rol,
      accion: 'registrar_recepcion',
      modulo: 'despacho',
      detalle: `Recepción ${ESTADO_RECEPCION_LABELS[estadoRec].label} — Guía ${despacho.numero_guia}`,
      planta_id: despacho.planta_id,
    });

    setSaving(false);
    setEditandoRecepcion(false);
    router.refresh();
  };

  // Trazabilidad inversa: agrupar postes por jornada de origen
  const postesPorJornada = useMemo(() => {
    const map = new Map<string, typeof despacho.postes>();
    despacho.postes.forEach(p => {
      const key = p.jornada_origen_id || '__sin_asociar__';
      const arr = map.get(key) || [];
      arr.push(p);
      map.set(key, arr);
    });
    return Array.from(map.entries());
  }, [despacho]);

  // ── Vista formulario de recepción ──
  if (editandoRecepcion) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setEditandoRecepcion(false)} className="text-sm text-muted-foreground hover:text-foreground">
            ← Volver al despacho
          </button>
          <div>
            <h1 className="text-xl font-bold">Registrar recepción</h1>
            <p className="text-xs text-muted-foreground">
              Guía {despacho.numero_guia} · {despacho.destinatario}
            </p>
          </div>
        </div>

        <Card className="bg-status-amber/5 border-status-amber/20">
          <CardContent className="p-4 text-sm text-status-amber flex items-center gap-2">
            <span>📦</span>
            <span>Complétalo cuando se confirme la recepción en destino.</span>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-5 space-y-5">
            <div className="space-y-2">
              <Label>Estado al recibir</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['conforme', 'con_danos', 'pendiente'] as EstadoRecepcion[]).map(est => {
                  const info = ESTADO_RECEPCION_LABELS[est];
                  return (
                    <button
                      key={est}
                      onClick={() => setEstadoRec(est)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        estadoRec === est ? 'border-primary bg-primary/10 text-primary' : 'border-border/40 bg-muted/20 text-muted-foreground hover:bg-muted/40'
                      }`}
                    >
                      <div className="text-lg mb-1">{info.icon}</div>
                      {info.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Fecha de recepción</Label>
                <Input type="date" value={fechaRec} onChange={e => setFechaRec(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Quien recibe</Label>
                <Input placeholder="Nombre y empresa" value={receptor} onChange={e => setReceptor(e.target.value)} />
              </div>
            </div>

            {estadoRec === 'con_danos' && (
              <div className="space-y-1.5">
                <Label className="text-status-red">Daños detectados</Label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border border-status-red/30 bg-status-red/5 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-status-red/50"
                  placeholder="Identifica los postes afectados por su código de plaquita y describe el daño."
                  value={danos}
                  onChange={e => setDanos(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">
                  Las fotos de carga del despacho original sirven como contraprueba ante reclamos.
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Observaciones</Label>
              <textarea
                className="w-full min-h-[60px] rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="Comentarios generales de la recepción..."
                value={obsRec}
                onChange={e => setObsRec(e.target.value)}
              />
            </div>

            <PhotoUploader
              label="Fotos de recepción"
              variant="muted"
              fotos={fotosRec}
              onAdd={nombres => setFotosRec(prev => [...prev, ...nombres])}
              onRemove={i => setFotosRec(prev => prev.filter((_, idx) => idx !== i))}
              hint="Fotografía el estado del camión al descargar y los postes con daños si los hay."
            />

            <div className="flex gap-3 pt-2">
              <Button onClick={guardarRecepcion} disabled={saving} className="flex-1">
                {saving ? 'Guardando...' : '✅ Confirmar recepción'}
              </Button>
              <Button variant="outline" onClick={() => setEditandoRecepcion(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Vista detalle (solo lectura + trazabilidad) ──
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/fabrica/despachos"><Button variant="outline" size="sm">← Volver</Button></Link>
          <div>
            <h1 className="text-xl font-bold">Despacho {despacho.numero_guia}</h1>
            <p className="text-xs text-muted-foreground">{despacho.fecha_despacho} · {despacho.destinatario}</p>
          </div>
        </div>
        {despacho.estado_recepcion === 'pendiente' && can('editar_despacho') && (
          <Button onClick={() => setEditandoRecepcion(true)}>📥 Registrar recepción</Button>
        )}
      </div>

      {/* Banner estado */}
      <Card className={`border ${
        despacho.estado_recepcion === 'conforme' ? 'bg-status-green/5 border-status-green/20' :
        despacho.estado_recepcion === 'con_danos' ? 'bg-status-red/5 border-status-red/20' :
        'bg-status-amber/5 border-status-amber/20'
      }`}>
        <CardContent className="p-4 flex items-center gap-3">
          <span className="text-2xl">{rec.icon}</span>
          <div className="min-w-0 flex-1">
            <p className={`font-semibold text-sm ${rec.color}`}>{rec.label}</p>
            {despacho.fecha_recepcion && (
              <p className="text-xs text-muted-foreground">
                Recibido el {despacho.fecha_recepcion}
                {despacho.nombre_receptor ? ` por ${despacho.nombre_receptor}` : ''}
              </p>
            )}
            {despacho.danos_detectados && (
              <p className="text-xs text-status-red mt-1">{despacho.danos_detectados}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Datos del camión + fotos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/60 border-border/40">
          <CardHeader><CardTitle className="text-sm">Datos del camión</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Guía N°" value={despacho.numero_guia} />
            <Row label="Fecha" value={despacho.fecha_despacho} />
            <Row label="Destinatario" value={despacho.destinatario} />
            <Row label="Transportista" value={despacho.transportista} />
            <Row label="Patente" value={despacho.patente_camion} />
            <Row label="Chofer" value={despacho.nombre_chofer} />
            {despacho.observaciones_despacho && <Row label="Observaciones" value={despacho.observaciones_despacho} />}
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/40">
          <CardHeader><CardTitle className="text-sm">📷 Fotos de carga ({despacho.fotos_carga_urls.length})</CardTitle></CardHeader>
          <CardContent>
            {despacho.fotos_carga_urls.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sin fotos registradas.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {despacho.fotos_carga_urls.map((f, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-muted/40 border border-border/30">
                    📷 {f}
                  </span>
                ))}
              </div>
            )}
            {despacho.fotos_recepcion_urls.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2">📷 Fotos de recepción ({despacho.fotos_recepcion_urls.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {despacho.fotos_recepcion_urls.map((f, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-muted/40 border border-border/30">
                      📷 {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {despacho.observaciones_recepcion && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground">Observaciones de recepción</p>
                <p className="text-sm mt-0.5">{despacho.observaciones_recepcion}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Postes y trazabilidad inversa */}
      <Card className="bg-card/60 border-border/40">
        <CardHeader>
          <CardTitle className="text-sm">
            📦 Postes despachados — {despacho.postes.length} unidades
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Resumen por tipo */}
          <div className="flex flex-wrap gap-1.5">
            {resumenPorTipo.map(([tipo, cantidad]) => {
              const lbl = TIPOS_POSTE.find(t => t.value === tipo)?.label || tipo;
              return (
                <span key={tipo} className="text-xs px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary font-medium">
                  <span className="font-bold">{cantidad}×</span> {lbl}
                </span>
              );
            })}
          </div>

          {/* Trazabilidad inversa por jornada */}
          <div className="space-y-3">
            {postesPorJornada.map(([jornadaId, postes]) => {
              const sinAsociar = jornadaId === '__sin_asociar__';
              const jornada = sinAsociar ? null : jornadas.find(j => j.id === jornadaId);
              return (
                <div key={jornadaId} className="rounded-lg border border-border/30 bg-muted/10 p-3 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {sinAsociar
                        ? `Sin jornada asociada — ${postes.length} postes`
                        : `Jornada ${jornada?.codigo || jornadaId} · ${jornada?.fecha || ''} — ${postes.length} postes`}
                    </p>
                    {!sinAsociar && jornada && (
                      <Link href={`/fabrica/jornadas/${jornada.id}`}>
                        <Button variant="outline" size="sm" className="text-xs h-7">Ver jornada →</Button>
                      </Link>
                    )}
                  </div>
                  <div className="overflow-x-auto rounded border border-border/30 bg-card">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/30 border-b border-border/30">
                        <tr>
                          <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">Plaquita</th>
                          <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">Tipo</th>
                          <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">Fecha fab.</th>
                          {PUNTOS_INSPECCION_DESPACHO.map(pi => (
                            <th
                              key={pi.key}
                              className="px-1 py-1.5 font-medium text-muted-foreground text-center text-[10px]"
                              title={pi.label}
                            >
                              {pi.label.replace(/^Sin /, '').replace(/^Punto /, 'Pto ')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {postes.map((p, i) => (
                          <tr key={i} className="border-b border-border/20 last:border-b-0">
                            <td className="px-2 py-1.5 font-mono font-semibold">{p.codigo_plaquita}</td>
                            <td className="px-2 py-1.5 text-muted-foreground">
                              {TIPOS_POSTE.find(t => t.value === p.tipo_poste)?.label || p.tipo_poste}
                            </td>
                            <td className="px-2 py-1.5 text-muted-foreground">
                              {p.fecha_fabricacion || '—'}
                            </td>
                            {PUNTOS_INSPECCION_DESPACHO.map(pi => {
                              const conforme = p[pi.key];
                              return (
                                <td key={pi.key} className="px-1 py-1.5 text-center" title={pi.label}>
                                  <span className={conforme ? 'text-status-green' : 'text-status-red'}>
                                    {conforme ? '✓' : '✗'}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {postes.some(p => p.observaciones) && (
                      <div className="border-t border-border/30 p-2 space-y-1 bg-status-red/5">
                        {postes.filter(p => p.observaciones).map((p, i) => (
                          <p key={i} className="text-[10px] text-status-red">
                            <span className="font-mono font-semibold">{p.codigo_plaquita}:</span> {p.observaciones}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground min-w-[110px]">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
