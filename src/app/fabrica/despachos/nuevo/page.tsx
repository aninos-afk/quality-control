'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PhotoUploader } from '@/components/photo-uploader';
import { TIPOS_POSTE } from '@/lib/constants';
import { PUNTOS_INSPECCION_DESPACHO } from '@/lib/types';
import type { PosteDespachado, TipoPoste, Despacho, PuntoInspeccionKey } from '@/lib/types';
import { ROL_LABELS } from '@/lib/auth';

// Crea un poste con los 5 puntos de inspección en true (caso normal).
// El despachador SOLO modifica si encuentra un hallazgo — en ese caso, baja el poste.
function nuevoPosteConforme(tipo: TipoPoste): Omit<PosteDespachado, 'codigo_plaquita'> & { codigo_plaquita: string } {
  return {
    codigo_plaquita: '',
    tipo_poste: tipo,
    fecha_fabricacion: '',
    insp_punto_verde: true,
    insp_armadura_vista: true,
    insp_oxido: true,
    insp_fisuras_mayores: true,
    insp_danos_golpes: true,
  };
}

export default function NuevoDespachoPage() {
  const router = useRouter();
  const { user, planta, can } = useAuth();
  const { addDespacho, addAuditLog } = useApp();

  // ── Datos del camión ──
  const [fechaDespacho, setFechaDespacho] = useState(new Date().toISOString().slice(0, 10));
  const [numeroGuia, setNumeroGuia]       = useState('');
  const [destinatario, setDestinatario]   = useState('');
  const [transportista, setTransportista] = useState('');
  const [patente, setPatente]             = useState('');
  const [chofer, setChofer]               = useState('');
  const [obsDespacho, setObsDespacho]     = useState('');

  // ── Tabla de postes ──
  const [postes, setPostes] = useState<PosteDespachado[]>([]);
  // Selector "agregar lote": tipo + cantidad
  const [tipoNuevo, setTipoNuevo]         = useState<TipoPoste>('10-600');
  const [cantidadNueva, setCantidadNueva] = useState(1);

  // ── Fotos ──
  const [fotos, setFotos] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);

  if (!can('crear_despacho')) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Tu rol no tiene permiso para registrar despachos.
      </div>
    );
  }

  // ── Agregar N filas del mismo tipo ──
  const agregarLote = () => {
    const n = Math.max(1, Math.min(50, cantidadNueva || 1));
    setPostes(prev => [...prev, ...Array.from({ length: n }, () => nuevoPosteConforme(tipoNuevo))]);
  };

  // ── Bajar del camión (eliminar fila) ──
  const bajarPoste = (idx: number) => {
    setPostes(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Actualizar campo de una fila ──
  const updatePoste = (idx: number, patch: Partial<PosteDespachado>) => {
    setPostes(prev => prev.map((p, i) => i === idx ? { ...p, ...patch } : p));
  };

  // Marcar un punto de inspección como NO conforme dispara bajar del camión.
  // Marcar como conforme = simplemente queda en true.
  const togglePuntoInspeccion = (idx: number, punto: PuntoInspeccionKey) => {
    const valorActual = postes[idx]?.[punto];
    if (valorActual === true) {
      // Pasa a no conforme → bajar del camión
      if (typeof window !== 'undefined') {
        const confirma = window.confirm(
          `Este poste no cumple en "${PUNTOS_INSPECCION_DESPACHO.find(p => p.key === punto)?.label}".\n\n` +
          `Al confirmar, el poste se baja del camión y se elimina de este despacho. ¿Continuar?`
        );
        if (!confirma) return;
      }
      bajarPoste(idx);
    }
    // Si estaba false (caso raro de revertir manualmente), volvemos a true
    else {
      updatePoste(idx, { [punto]: true } as Partial<PosteDespachado>);
    }
  };

  // ── Resumen por tipo (para banner) ──
  const resumenPorTipo = useMemo(() => {
    const map = new Map<TipoPoste, number>();
    postes.forEach(p => map.set(p.tipo_poste, (map.get(p.tipo_poste) || 0) + 1));
    return Array.from(map.entries());
  }, [postes]);

  // ── Validación ──
  const filasIncompletas = postes.filter(p => !p.codigo_plaquita.trim() || !p.fecha_fabricacion).length;
  const plaquitasDuplicadas = useMemo(() => {
    const vistas = new Map<string, number>();
    const dups: string[] = [];
    postes.forEach(p => {
      const k = p.codigo_plaquita.trim().toLowerCase();
      if (!k) return;
      vistas.set(k, (vistas.get(k) || 0) + 1);
    });
    vistas.forEach((count, k) => { if (count > 1) dups.push(k); });
    return dups;
  }, [postes]);

  const puedeGuardar =
    numeroGuia.trim() &&
    destinatario.trim() &&
    fechaDespacho &&
    postes.length > 0 &&
    filasIncompletas === 0 &&
    plaquitasDuplicadas.length === 0;

  // ── Guardar ──
  const guardar = () => {
    if (!puedeGuardar || !planta || !user) return;
    setSaving(true);

    const nuevo: Despacho = {
      id: `dsp-${Date.now()}`,
      planta_id: planta.id,
      fecha_despacho: fechaDespacho,
      numero_guia: numeroGuia.trim(),
      destinatario: destinatario.trim(),
      transportista: transportista.trim() || undefined,
      patente_camion: patente.trim() || undefined,
      nombre_chofer: chofer.trim() || undefined,
      postes: postes.map(p => ({
        ...p,
        codigo_plaquita: p.codigo_plaquita.trim(),
      })),
      fotos_carga_urls: fotos,
      observaciones_despacho: obsDespacho.trim() || undefined,
      estado_recepcion: 'pendiente',
      fotos_recepcion_urls: [],
      created_by: user.id,
      created_at: new Date().toISOString(),
    };

    addDespacho(nuevo);
    addAuditLog({
      id: `audit-dsp-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      hora: new Date().toTimeString().slice(0, 5),
      usuario_id: user.id,
      usuario_nombre: user.nombre,
      rol: user.rol,
      accion: 'registrar_despacho',
      modulo: 'despacho',
      detalle: `Despacho ${nuevo.numero_guia} — ${postes.length} postes a ${destinatario}. ${user.nombre} (${ROL_LABELS[user.rol]}) certifica inspección visual conforme.`,
      planta_id: planta.id,
    });

    setSaving(false);
    router.push(`/fabrica/despachos/${nuevo.id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/fabrica/despachos"><Button variant="outline" size="sm">← Volver</Button></Link>
        <div>
          <h1 className="text-2xl font-bold">Registrar despacho</h1>
          <p className="text-xs text-muted-foreground">Planta {planta?.nombre}</p>
        </div>
      </div>

      {/* 1. Datos del camión */}
      <Card className="bg-card/60 border-border/40">
        <CardHeader>
          <CardTitle className="text-sm">🚚 Datos del camión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Fecha de despacho <span className="text-status-red">*</span></Label>
              <Input type="date" value={fechaDespacho} onChange={e => setFechaDespacho(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Número de guía <span className="text-status-red">*</span></Label>
              <Input placeholder="Ej: G-2026-0123" value={numeroGuia} onChange={e => setNumeroGuia(e.target.value)} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
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

      {/* 2. Postes — agregar por lote y completar plaquita + fecha + inspección */}
      <Card className="bg-card/60 border-border/40">
        <CardHeader>
          <CardTitle className="text-sm">
            📦 Postes cargados — {postes.length} {postes.length === 1 ? 'unidad' : 'unidades'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Selector tipo + cantidad para agregar lotes */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1.5 flex-1 min-w-[180px]">
                <Label className="text-xs">Tipo de poste</Label>
                <select
                  className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
                  value={tipoNuevo}
                  onChange={e => setTipoNuevo(e.target.value as TipoPoste)}
                >
                  {TIPOS_POSTE.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5 w-24">
                <Label className="text-xs">Cantidad</Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={cantidadNueva}
                  onChange={e => setCantidadNueva(parseInt(e.target.value) || 1)}
                />
              </div>
              <Button onClick={agregarLote} size="default">+ Agregar al despacho</Button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Puedes agregar varios lotes de distintos tipos. Cada poste se inspecciona
              individualmente abajo.
            </p>
          </div>

          {/* Resumen por tipo */}
          {resumenPorTipo.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {resumenPorTipo.map(([tipo, cantidad]) => {
                const lbl = TIPOS_POSTE.find(t => t.value === tipo)?.label || tipo;
                return (
                  <span key={tipo} className="text-xs px-3 py-1 rounded-md bg-muted/40 border border-border/30 font-medium">
                    <span className="font-bold">{cantidad}×</span> {lbl}
                  </span>
                );
              })}
            </div>
          )}

          {/* Tabla de postes */}
          {postes.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border/40 rounded-lg">
              Aún no se han cargado postes. Selecciona tipo y cantidad arriba para empezar.
            </div>
          ) : (
            <div className="rounded-lg border border-border/40 overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/30 border-b border-border/40">
                  <tr>
                    <th className="text-left px-2 py-2 font-medium text-muted-foreground w-8">#</th>
                    <th className="text-left px-2 py-2 font-medium text-muted-foreground">Tipo</th>
                    <th className="text-left px-2 py-2 font-medium text-muted-foreground">Código plaquita <span className="text-status-red">*</span></th>
                    <th className="text-left px-2 py-2 font-medium text-muted-foreground">Fecha fabricación <span className="text-status-red">*</span></th>
                    <th className="text-left px-2 py-2 font-medium text-muted-foreground" colSpan={PUNTOS_INSPECCION_DESPACHO.length}>
                      Inspección visual SAESA — los 5 puntos vienen ✅ por defecto, toca para reportar hallazgo
                    </th>
                    <th className="px-2 py-2 w-8"></th>
                  </tr>
                  <tr className="bg-muted/20 border-b border-border/30">
                    <th colSpan={4}></th>
                    {PUNTOS_INSPECCION_DESPACHO.map(p => (
                      <th
                        key={p.key}
                        className="px-1 py-1 text-[9px] font-normal text-muted-foreground text-center"
                        title={p.descripcion}
                      >
                        {p.label.replace(/^Sin /, '').replace(/^Punto /, 'Pto ')}
                      </th>
                    ))}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {postes.map((p, idx) => {
                    const lblTipo = TIPOS_POSTE.find(t => t.value === p.tipo_poste)?.label || p.tipo_poste;
                    const incompleta = !p.codigo_plaquita.trim() || !p.fecha_fabricacion;
                    return (
                      <tr
                        key={idx}
                        className={`border-b border-border/20 ${incompleta ? 'bg-status-amber/5' : 'hover:bg-muted/10'}`}
                      >
                        <td className="px-2 py-1.5 text-muted-foreground">{idx + 1}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs">{lblTipo}</td>
                        <td className="px-1 py-1">
                          <Input
                            value={p.codigo_plaquita}
                            onChange={e => updatePoste(idx, { codigo_plaquita: e.target.value })}
                            placeholder="ej: TMC-001"
                            className="h-8 text-xs font-mono"
                          />
                        </td>
                        <td className="px-1 py-1">
                          <Input
                            type="date"
                            value={p.fecha_fabricacion || ''}
                            onChange={e => updatePoste(idx, { fecha_fabricacion: e.target.value })}
                            className="h-8 text-xs"
                          />
                        </td>
                        {PUNTOS_INSPECCION_DESPACHO.map(punto => {
                          const conforme = p[punto.key];
                          return (
                            <td key={punto.key} className="px-1 py-1 text-center">
                              <button
                                type="button"
                                onClick={() => togglePuntoInspeccion(idx, punto.key)}
                                className={`w-7 h-7 rounded-md border text-base transition-all ${
                                  conforme
                                    ? 'bg-status-green/15 border-status-green/30 text-status-green hover:bg-status-green/25'
                                    : 'bg-status-red/15 border-status-red/30 text-status-red'
                                }`}
                                title={`${punto.label} — ${punto.descripcion}. Toca para reportar hallazgo (baja el poste del camión).`}
                              >
                                {conforme ? '✓' : '✗'}
                              </button>
                            </td>
                          );
                        })}
                        <td className="px-1 py-1 text-center">
                          <button
                            type="button"
                            onClick={() => bajarPoste(idx)}
                            className="text-muted-foreground hover:text-status-red text-sm w-6 h-6"
                            title="Quitar del camión"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Validaciones inline */}
          {filasIncompletas > 0 && (
            <p className="text-xs text-status-amber">
              ⚠️ Quedan {filasIncompletas} fila{filasIncompletas === 1 ? '' : 's'} sin código de plaquita o sin fecha de fabricación.
            </p>
          )}
          {plaquitasDuplicadas.length > 0 && (
            <p className="text-xs text-status-red">
              ⚠️ Códigos de plaquita duplicados: {plaquitasDuplicadas.join(', ')}. Cada poste tiene un código único.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 3. Fotos del camión */}
      <Card className="bg-card/60 border-border/40">
        <CardHeader>
          <CardTitle className="text-sm">📷 Fotos del camión cargado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Tomar fotos generales del camión antes de la partida. Evidencia del estado en
            que los postes salieron de la fábrica.
          </p>
          <PhotoUploader
            label=""
            fotos={fotos}
            onAdd={nombres => setFotos(prev => [...prev, ...nombres])}
            onRemove={i => setFotos(prev => prev.filter((_, idx) => idx !== i))}
            hint="En tablet se abre la cámara trasera automáticamente."
          />
          <div className="space-y-1.5">
            <Label className="text-xs">Observaciones del despacho</Label>
            <textarea
              className="w-full min-h-[60px] rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="Estiba, condiciones de carga, instrucciones especiales..."
              value={obsDespacho}
              onChange={e => setObsDespacho(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Banner de responsabilidad + confirmar */}
      {postes.length > 0 && user && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-xs space-y-1.5">
            <p className="font-medium text-foreground">
              ✍️ Al confirmar este despacho certifico que:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
              <li>Los {postes.length} postes cargados cumplen los 5 puntos de inspección visual SAESA</li>
              <li>Cada poste lleva su plaquita física con el código registrado</li>
              <li>La carga está estibada correctamente para el transporte</li>
            </ul>
            <p className="pt-1 text-foreground/80">
              <span className="font-semibold">{user.nombre}</span> — <span className="text-muted-foreground">{ROL_LABELS[user.rol]}</span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Acciones — sticky */}
      <div className="flex gap-3 sticky bottom-4 bg-background/80 backdrop-blur-sm p-2 rounded-xl">
        <Button onClick={guardar} disabled={!puedeGuardar || saving} size="lg" className="flex-1">
          {saving ? 'Guardando...' : `🚚 Confirmar despacho · ${postes.length} postes`}
        </Button>
        <Link href="/fabrica/despachos">
          <Button variant="outline" size="lg">Cancelar</Button>
        </Link>
      </div>
    </div>
  );
}
