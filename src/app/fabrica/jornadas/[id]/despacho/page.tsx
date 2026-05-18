'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { PosteDespachado, TipoPoste, EstadoRecepcion } from '@/lib/types';
import { TIPOS_POSTE } from '@/lib/constants';

interface Props {
  params: Promise<{ id: string }>;
}

const ESTADO_RECEPCION_LABELS: Record<EstadoRecepcion, { label: string; color: string; icon: string }> = {
  pendiente: { label: 'Pendiente de recepción', color: 'text-status-amber', icon: '⏳' },
  conforme:  { label: 'Recibido conforme',       color: 'text-status-green',  icon: '✅' },
  con_danos: { label: 'Con daños en recepción',  color: 'text-status-red',    icon: '⚠️' },
};

export default function DespachoPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const {
    getJornada, getDespachoByJornada, addDespacho, updateDespacho, updateJornada, addAuditLog,
  } = useApp();

  const jornada = getJornada(id);
  const despachoExistente = getDespachoByJornada(id);

  // ── Modo: registrar nuevo despacho vs. registrar recepción ──
  const [modo, setModo] = useState<'despacho' | 'recepcion'>(
    despachoExistente && despachoExistente.estado_recepcion === 'pendiente' ? 'recepcion' : 'despacho'
  );

  // ── Estado formulario despacho ──
  const [numeroGuia, setNumeroGuia]         = useState('');
  const [destinatario, setDestinatario]     = useState('');
  const [transportista, setTransportista]   = useState('');
  const [patente, setPatente]               = useState('');
  const [chofer, setChofer]                 = useState('');
  const [obsDespacho, setObsDespacho]       = useState('');
  const [postes, setPostes]                 = useState<PosteDespachado[]>([
    { tipo_poste: '10-600', cantidad: 1, codigos_plaquita: [''] },
  ]);
  // Fotos: en demo simulamos con nombres de archivo
  const [fotosNombres, setFotosNombres]     = useState<string[]>([]);

  // ── Estado formulario recepción ──
  const [estadoRec, setEstadoRec]           = useState<EstadoRecepcion>('conforme');
  const [fechaRec, setFechaRec]             = useState(new Date().toISOString().slice(0, 10));
  const [receptor, setReceptor]             = useState('');
  const [obsRecepcion, setObsRecepcion]     = useState('');
  const [danosDetectados, setDanosDetectados] = useState('');
  const [fotosRecNombres, setFotosRecNombres] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);

  if (!jornada) return <div className="text-center py-20 text-muted-foreground">Jornada no encontrada</div>;

  if (jornada.estado !== 'cerrada' && jornada.estado !== 'despachada') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link href={`/fabrica/jornadas/${id}`}><Button variant="outline" size="sm">← Volver</Button></Link>
          <h1 className="text-xl font-bold">Despacho — {jornada.codigo}</h1>
        </div>
        <Card className="bg-status-amber/5 border-status-amber/20">
          <CardContent className="p-5 flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-semibold text-sm">La jornada debe estar cerrada para registrar despacho</p>
              <p className="text-xs text-muted-foreground mt-0.5">Completa primero las etapas anteriores y libera la jornada.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Helpers postes ──────────────────────────────────────
  const addFilaPoste = () =>
    setPostes(prev => [...prev, { tipo_poste: '10-600', cantidad: 1, codigos_plaquita: [''] }]);

  const removeFilaPoste = (i: number) =>
    setPostes(prev => prev.filter((_, idx) => idx !== i));

  const updatePoste = (i: number, field: keyof PosteDespachado, value: unknown) =>
    setPostes(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));

  const updateCodigos = (i: number, raw: string) => {
    const codigos = raw.split('\n').map(s => s.trim()).filter(Boolean);
    setPostes(prev => prev.map((p, idx) => idx === i ? { ...p, codigos_plaquita: codigos.length ? codigos : [''] } : p));
  };

  const handleFotosCarga = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).map(f => f.name);
    setFotosNombres(prev => [...prev, ...files]);
  };

  const handleFotosRecepcion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).map(f => f.name);
    setFotosRecNombres(prev => [...prev, ...files]);
  };

  // ─── Guardar despacho ────────────────────────────────────
  const handleGuardarDespacho = () => {
    if (!numeroGuia.trim() || !destinatario.trim()) return;
    setSaving(true);

    const nuevoDespacho = {
      id: `dsp-${Date.now()}`,
      jornada_id: id,
      planta_id: jornada.planta_id,
      fecha_despacho: new Date().toISOString().slice(0, 10),
      numero_guia: numeroGuia.trim(),
      destinatario: destinatario.trim(),
      transportista: transportista.trim() || undefined,
      patente_camion: patente.trim() || undefined,
      nombre_chofer: chofer.trim() || undefined,
      postes,
      fotos_carga_urls: fotosNombres,
      observaciones_despacho: obsDespacho.trim() || undefined,
      estado_recepcion: 'pendiente' as EstadoRecepcion,
      fotos_recepcion_urls: [],
      created_by: user?.id || '',
      created_at: new Date().toISOString(),
    };

    addDespacho(nuevoDespacho);
    updateJornada(id, { estado: 'despachada' });
    addAuditLog({
      id: `audit-dsp-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      hora: new Date().toTimeString().slice(0, 5),
      usuario_id: user?.id || '',
      usuario_nombre: user?.nombre || '',
      rol: user?.rol || 'jefe_planta',
      accion: 'registrar_despacho',
      modulo: 'despacho',
      detalle: `Despacho ${numeroGuia} registrado para jornada ${jornada.codigo}`,
      planta_id: jornada.planta_id,
    });

    setSaving(false);
    router.push(`/fabrica/jornadas/${id}`);
  };

  // ─── Guardar recepción ───────────────────────────────────
  const handleGuardarRecepcion = () => {
    if (!despachoExistente) return;
    setSaving(true);

    updateDespacho(despachoExistente.id, {
      estado_recepcion: estadoRec,
      fecha_recepcion: fechaRec,
      nombre_receptor: receptor.trim() || undefined,
      fotos_recepcion_urls: fotosRecNombres,
      observaciones_recepcion: obsRecepcion.trim() || undefined,
      danos_detectados: estadoRec === 'con_danos' ? danosDetectados.trim() : undefined,
    });

    addAuditLog({
      id: `audit-rec-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      hora: new Date().toTimeString().slice(0, 5),
      usuario_id: user?.id || '',
      usuario_nombre: user?.nombre || '',
      rol: user?.rol || 'jefe_planta',
      accion: 'registrar_recepcion',
      modulo: 'despacho',
      detalle: `Recepción registrada: ${ESTADO_RECEPCION_LABELS[estadoRec].label} — Jornada ${jornada.codigo}`,
      planta_id: jornada.planta_id,
    });

    setSaving(false);
    router.push(`/fabrica/jornadas/${id}`);
  };

  // ─── Vista despacho ya registrado (solo lectura) ─────────
  if (despachoExistente && modo === 'despacho') {
    const d = despachoExistente;
    const rec = ESTADO_RECEPCION_LABELS[d.estado_recepcion];
    const totalPostes = d.postes.reduce((s, p) => s + p.cantidad, 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/fabrica/jornadas/${id}`}><Button variant="outline" size="sm">← Volver</Button></Link>
            <div>
              <h1 className="text-xl font-bold">Despacho — {jornada.codigo}</h1>
              <p className="text-xs text-muted-foreground">Guía {d.numero_guia} · {d.fecha_despacho}</p>
            </div>
          </div>
          {d.estado_recepcion === 'pendiente' && (
            <Button size="sm" onClick={() => setModo('recepcion')}>
              📥 Registrar Recepción
            </Button>
          )}
        </div>

        {/* Estado recepción banner */}
        <Card className={`border ${d.estado_recepcion === 'conforme' ? 'bg-status-green/5 border-status-green/20' : d.estado_recepcion === 'con_danos' ? 'bg-status-red/5 border-status-red/20' : 'bg-status-amber/5 border-status-amber/20'}`}>
          <CardContent className="p-4 flex items-center gap-3">
            <span className="text-2xl">{rec.icon}</span>
            <div>
              <p className={`font-semibold text-sm ${rec.color}`}>{rec.label}</p>
              {d.fecha_recepcion && <p className="text-xs text-muted-foreground">Recibido el {d.fecha_recepcion}{d.nombre_receptor ? ` por ${d.nombre_receptor}` : ''}</p>}
              {d.danos_detectados && <p className="text-xs text-status-red mt-1">{d.danos_detectados}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Datos despacho */}
          <Card className="bg-card/60 border-border/40">
            <CardHeader><CardTitle className="text-sm">Datos del despacho</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Guía N°" value={d.numero_guia} />
              <Row label="Destinatario" value={d.destinatario} />
              <Row label="Transportista" value={d.transportista} />
              <Row label="Patente" value={d.patente_camion} />
              <Row label="Chofer" value={d.nombre_chofer} />
              {d.observaciones_despacho && <Row label="Observaciones" value={d.observaciones_despacho} />}
              {d.fotos_carga_urls.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Fotos carga:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {d.fotos_carga_urls.map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-muted/40 border border-border/30">📷 {f}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Postes despachados */}
          <Card className="bg-card/60 border-border/40">
            <CardHeader><CardTitle className="text-sm">Postes despachados — {totalPostes} unidades</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {d.postes.map((p, i) => {
                const label = TIPOS_POSTE.find(t => t.value === p.tipo_poste)?.label || p.tipo_poste;
                return (
                  <div key={i} className="p-3 rounded-lg bg-muted/20 border border-border/20 text-sm">
                    <p className="font-medium">{label} — {p.cantidad} ud.</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {p.codigos_plaquita.map((c, j) => (
                        <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{c}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Datos recepción si existe */}
        {d.estado_recepcion !== 'pendiente' && d.observaciones_recepcion && (
          <Card className="bg-card/60 border-border/40">
            <CardHeader><CardTitle className="text-sm">Datos de recepción</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {d.observaciones_recepcion && <Row label="Observaciones" value={d.observaciones_recepcion} />}
              {d.fotos_recepcion_urls.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Fotos recepción:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {d.fotos_recepcion_urls.map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-muted/40 border border-border/30">📷 {f}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ─── Formulario recepción ────────────────────────────────
  if (modo === 'recepcion' && despachoExistente) {
    const d = despachoExistente;
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setModo('despacho')} className="text-sm text-muted-foreground hover:text-foreground">← Volver al despacho</button>
          <div>
            <h1 className="text-xl font-bold">Registrar Recepción</h1>
            <p className="text-xs text-muted-foreground">Guía {d.numero_guia} · Destino: {d.destinatario}</p>
          </div>
        </div>

        <Card className="bg-status-amber/5 border-status-amber/20">
          <CardContent className="p-4 text-sm text-status-amber flex items-center gap-2">
            <span>📦</span>
            <span>Esta sección la completa quien recibe los postes en destino — o el transportista al entregar.</span>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/40">
          <CardContent className="p-5 space-y-5">

            <div className="space-y-2">
              <Label>Estado de los postes al recibir</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['conforme', 'con_danos', 'pendiente'] as EstadoRecepcion[]).map(est => {
                  const info = ESTADO_RECEPCION_LABELS[est];
                  return (
                    <button
                      key={est}
                      onClick={() => setEstadoRec(est)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${estadoRec === est ? 'border-primary bg-primary/10 text-primary' : 'border-border/40 bg-muted/20 text-muted-foreground hover:bg-muted/40'}`}
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
                <Label>Nombre de quien recibe</Label>
                <Input placeholder="Nombre y empresa" value={receptor} onChange={e => setReceptor(e.target.value)} />
              </div>
            </div>

            {estadoRec === 'con_danos' && (
              <div className="space-y-1.5">
                <Label className="text-status-red">Descripción de daños detectados</Label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border border-status-red/30 bg-status-red/5 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-status-red/50"
                  placeholder="Identificar los postes afectados por código de plaquita y describir el tipo de daño..."
                  value={danosDetectados}
                  onChange={e => setDanosDetectados(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">Esta información queda registrada como evidencia. Las fotos de carga del despacho original sirven de contraprueba.</p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Observaciones de recepción</Label>
              <textarea
                className="w-full min-h-[60px] rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="Comentarios generales sobre la recepción..."
                value={obsRecepcion}
                onChange={e => setObsRecepcion(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Fotos de recepción</Label>
              <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 rounded-lg border border-dashed border-border/50 bg-muted/20 hover:bg-muted/40 text-sm text-muted-foreground transition-colors">
                <span>📷</span> Adjuntar fotos
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFotosRecepcion} />
              </label>
              {fotosRecNombres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {fotosRecNombres.map((f, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-muted/40 border border-border/30">📷 {f}</span>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-muted-foreground">Fotografiar el estado del camión al descargar y los postes individuales que presenten daños.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleGuardarRecepcion} disabled={saving} className="flex-1">
                {saving ? 'Guardando...' : '✅ Confirmar Recepción'}
              </Button>
              <Button variant="outline" onClick={() => setModo('despacho')}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Formulario nuevo despacho ───────────────────────────
  const totalPostesForm = postes.reduce((s, p) => s + (Number(p.cantidad) || 0), 0);
  const puedeGuardar = numeroGuia.trim() && destinatario.trim() &&
    postes.every(p => p.codigos_plaquita.some(c => c.trim()));

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href={`/fabrica/jornadas/${id}`}><Button variant="outline" size="sm">← Volver</Button></Link>
        <div>
          <h1 className="text-xl font-bold">Registrar Despacho</h1>
          <p className="text-xs text-muted-foreground">Jornada {jornada.codigo} · {jornada.fecha}</p>
        </div>
      </div>

      {/* Datos del transporte */}
      <Card className="bg-card/60 border-border/40">
        <CardHeader><CardTitle className="text-sm">🚚 Datos del transporte</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Número de guía <span className="text-status-red">*</span></Label>
              <Input placeholder="Ej: G-2026-0101" value={numeroGuia} onChange={e => setNumeroGuia(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Destinatario <span className="text-status-red">*</span></Label>
              <Input placeholder="Obra / Subestación / Bodega" value={destinatario} onChange={e => setDestinatario(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Transportista</Label>
              <Input placeholder="Empresa de transporte" value={transportista} onChange={e => setTransportista(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Patente del camión</Label>
              <Input placeholder="Ej: ABCD-12" value={patente} onChange={e => setPatente(e.target.value)} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Nombre del chofer</Label>
              <Input placeholder="Nombre completo" value={chofer} onChange={e => setChofer(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Postes despachados */}
      <Card className="bg-card/60 border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">📦 Postes despachados — {totalPostesForm} unidades</CardTitle>
            <Button size="sm" variant="outline" onClick={addFilaPoste}>+ Agregar tipo</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {postes.map((p, i) => (
            <div key={i} className="p-4 rounded-xl border border-border/30 bg-muted/10 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tipo de poste {i + 1}</p>
                {postes.length > 1 && (
                  <button onClick={() => removeFilaPoste(i)} className="text-xs text-status-red hover:underline">Eliminar</button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Tipo</Label>
                  <select
                    className="w-full text-sm bg-card border border-border rounded-md px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary"
                    value={p.tipo_poste}
                    onChange={e => updatePoste(i, 'tipo_poste', e.target.value as TipoPoste)}
                  >
                    {TIPOS_POSTE.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Cantidad</Label>
                  <Input
                    type="number" min={1}
                    value={p.cantidad}
                    onChange={e => updatePoste(i, 'cantidad', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Códigos de plaquita (uno por línea)</Label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border border-border/40 bg-background px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder={`TMC-001\nTMC-002\nTMC-003`}
                  value={p.codigos_plaquita.join('\n')}
                  onChange={e => updateCodigos(i, e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">El código de cada poste corresponde a la plaquita física adherida. Conecta este despacho con la jornada de fabricación.</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Fotos de carga */}
      <Card className="bg-card/60 border-border/40">
        <CardHeader><CardTitle className="text-sm">📷 Fotografías del estado de carga</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Fotografiar el camión cargado antes de la partida. Estas imágenes son la evidencia del estado de los postes al salir de la fábrica — protegen a la fábrica ante reclamos del transportista.
          </p>
          <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2.5 rounded-lg border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 text-sm text-primary transition-colors font-medium">
            <span>📷</span> Adjuntar fotos de carga
            <input type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={handleFotosCarga} />
          </label>
          {fotosNombres.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {fotosNombres.map((f, i) => (
                <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium">📷 {f}</span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-status-amber">⚠️ Sin fotos adjuntas — se recomienda fotografiar antes de la partida</p>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs">Observaciones del despacho</Label>
            <textarea
              className="w-full min-h-[60px] rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="Estado de estiba, condiciones de carga, instrucciones especiales..."
              value={obsDespacho}
              onChange={e => setObsDespacho(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex gap-3">
        <Button onClick={handleGuardarDespacho} disabled={!puedeGuardar || saving} className="flex-1">
          {saving ? 'Guardando...' : '🚚 Confirmar Despacho'}
        </Button>
        <Link href={`/fabrica/jornadas/${id}`}>
          <Button variant="outline">Cancelar</Button>
        </Link>
      </div>
      {!puedeGuardar && (
        <p className="text-xs text-muted-foreground text-center">Completa guía, destinatario y al menos un código de plaquita para continuar.</p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground min-w-[100px]">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
