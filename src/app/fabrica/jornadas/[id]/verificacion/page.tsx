'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PUNTOS_ARMADURA, PUNTOS_MOLDAJE, PUNTOS_HORMIGONADO } from '@/lib/constants';
import type { PuntoVerificacion, VerificacionFabricacion, TipoPoste } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

const ALL_PUNTOS = [...PUNTOS_ARMADURA, ...PUNTOS_MOLDAJE, ...PUNTOS_HORMIGONADO];

type PuntoButton = { value: PuntoVerificacion; label: string; color: string; activeColor: string };
const PUNTO_BUTTONS: PuntoButton[] = [
  { value: 'C', label: 'C', color: 'border-status-green/30 text-status-green hover:bg-status-green/10', activeColor: 'bg-status-green text-white border-status-green' },
  { value: 'NC', label: 'NC', color: 'border-status-red/30 text-status-red hover:bg-status-red/10', activeColor: 'bg-status-red text-white border-status-red' },
  { value: 'NA', label: 'NA', color: 'border-muted-foreground/30 text-muted-foreground hover:bg-muted/30', activeColor: 'bg-muted text-foreground border-muted' },
];

interface PosteVerificacion {
  tipo_poste: TipoPoste;
  molde_id: string;
  codigo_elemento: string;
  puntos: Record<string, PuntoVerificacion>;
  observaciones: string;
  // Overrides
  override_operadores: boolean;
  operadores_enfierradura: string[];
  operadores_moldaje: string[];
  operadores_hormigonado: string[];
  operadores_curado: string[];
  override_materiales: boolean;
  lote_cemento: string;
  partida_aridos: string;
  lote_acero: string;
  aditivo_detalle: string;
}

function emptyPuntos(): Record<string, PuntoVerificacion> {
  const p: Record<string, PuntoVerificacion> = {};
  ALL_PUNTOS.forEach(pt => { p[pt.id] = null as any; });
  return p;
}

export default function VerificacionPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { user, planta } = useAuth();
  const { getJornada, getMoldesByPlanta, getVerificacionesByJornada, getTrabajadoresByPlanta, replaceVerificacionesByJornada, updateJornada } = useApp();
  const jornada = getJornada(id);
  const allMoldes = getMoldesByPlanta(planta?.id || '');
  const trabajadores = getTrabajadoresByPlanta(planta?.id || '');
  const existingVerificaciones = getVerificacionesByJornada(id);

  const makeNewPoste = (tp: TipoPoste, idx: number): PosteVerificacion => ({
    tipo_poste: tp,
    molde_id: '',
    codigo_elemento: jornada ? `${jornada.codigo}-${String(idx + 1).padStart(2, '0')}` : '',
    puntos: emptyPuntos(),
    observaciones: '',
    override_operadores: false,
    operadores_enfierradura: jornada?.operadores_enfierradura || [],
    operadores_moldaje: jornada?.operadores_moldaje || [],
    operadores_hormigonado: jornada?.operadores_hormigonado || [],
    operadores_curado: jornada?.operadores_curado || [],
    override_materiales: false,
    lote_cemento: jornada?.lote_cemento || '',
    partida_aridos: jornada?.partida_aridos || '',
    lote_acero: jornada?.lote_acero || '',
    aditivo_detalle: jornada?.aditivo_detalle || '',
  });

  const [postes, setPostes] = useState<PosteVerificacion[]>(() => {
    if (existingVerificaciones.length > 0) {
      return existingVerificaciones.map(v => ({
        tipo_poste: v.tipo_poste,
        molde_id: v.molde_id || '',
        codigo_elemento: v.codigo_elemento || '',
        puntos: ALL_PUNTOS.reduce((acc, pt) => {
          acc[pt.id] = (v as any)[pt.id] || null;
          return acc;
        }, {} as Record<string, PuntoVerificacion>),
        observaciones: v.observaciones || '',
        override_operadores: v.override_operadores || false,
        operadores_enfierradura: v.operadores_enfierradura || jornada?.operadores_enfierradura || [],
        operadores_moldaje: v.operadores_moldaje || jornada?.operadores_moldaje || [],
        operadores_hormigonado: v.operadores_hormigonado || jornada?.operadores_hormigonado || [],
        operadores_curado: v.operadores_curado || jornada?.operadores_curado || [],
        override_materiales: v.override_materiales || false,
        lote_cemento: v.lote_cemento || jornada?.lote_cemento || '',
        partida_aridos: v.partida_aridos || jornada?.partida_aridos || '',
        lote_acero: v.lote_acero || jornada?.lote_acero || '',
        aditivo_detalle: v.aditivo_detalle || jornada?.aditivo_detalle || '',
      }));
    }
    return jornada?.tipos_poste.map((tp, idx) => makeNewPoste(tp, idx)) || [];
  });

  const [activeIdx, setActiveIdx] = useState(0);

  if (!jornada) return <div className="text-center py-20 text-muted-foreground">Jornada no encontrada</div>;

  const addPoste = () => {
    const nextIdx = postes.length;
    setPostes(prev => [...prev, makeNewPoste(jornada.tipos_poste[0], nextIdx)]);
    setActiveIdx(postes.length);
  };

  const removePoste = (idx: number) => {
    if (postes.length <= 1) return;
    setPostes(prev => prev.filter((_, i) => i !== idx));
    if (activeIdx >= postes.length - 1) setActiveIdx(Math.max(0, postes.length - 2));
  };

  const updatePoste = (idx: number, updates: Partial<PosteVerificacion>) => {
    setPostes(prev => prev.map((p, i) => i === idx ? { ...p, ...updates } : p));
  };

  const setPunto = (idx: number, puntoId: string, value: PuntoVerificacion) => {
    setPostes(prev => prev.map((p, i) =>
      i === idx ? { ...p, puntos: { ...p.puntos, [puntoId]: value } } : p
    ));
  };

  const toggleOperador = (idx: number, field: string, trabId: string) => {
    setPostes(prev => prev.map((p, i) => {
      if (i !== idx) return p;
      const current = (p as any)[field] as string[];
      const updated = current.includes(trabId)
        ? current.filter((id: string) => id !== trabId)
        : [...current, trabId];
      return { ...p, [field]: updated };
    }));
  };

  const isPosteComplete = (p: PosteVerificacion) => Object.values(p.puntos).every(v => v !== null);
  const posteHasNC = (p: PosteVerificacion) => Object.values(p.puntos).some(v => v === 'NC');
  const allPostesComplete = postes.every(isPosteComplete);
  const totalPostes = postes.length;
  const completedPostes = postes.filter(isPosteComplete).length;

  const setSectionCumple = (sectionPoints: readonly { id: string; texto: string }[]) => {
    setPostes(prev => prev.map((p, i) => {
      if (i !== activeIdx) return p;
      const updated = { ...p.puntos };
      sectionPoints.forEach(pt => { updated[pt.id] = 'C'; });
      return { ...p, puntos: updated };
    }));
  };

  const isSectionAllCumple = (sectionPoints: readonly { id: string; texto: string }[]) =>
    sectionPoints.every(pt => current?.puntos[pt.id] === 'C');

  const handleSave = () => {
    const nuevas: VerificacionFabricacion[] = postes.map((poste, idx) => {
      const resultado = posteHasNC(poste) ? 'no_conforme' : 'conforme';
      return {
        id: `ver-new-${Date.now()}-${idx}`,
        jornada_id: id,
        tipo_poste: poste.tipo_poste,
        molde_id: poste.molde_id || undefined,
        codigo_elemento: poste.codigo_elemento || undefined,
        override_operadores: poste.override_operadores || undefined,
        operadores_enfierradura: poste.override_operadores ? poste.operadores_enfierradura : undefined,
        operadores_moldaje: poste.override_operadores ? poste.operadores_moldaje : undefined,
        operadores_hormigonado: poste.override_operadores ? poste.operadores_hormigonado : undefined,
        operadores_curado: poste.override_operadores ? poste.operadores_curado : undefined,
        override_materiales: poste.override_materiales || undefined,
        lote_cemento: poste.override_materiales ? poste.lote_cemento : undefined,
        partida_aridos: poste.override_materiales ? poste.partida_aridos : undefined,
        lote_acero: poste.override_materiales ? poste.lote_acero : undefined,
        aditivo_detalle: poste.override_materiales ? poste.aditivo_detalle : undefined,
        ...Object.fromEntries(Object.entries(poste.puntos)),
        observaciones: poste.observaciones || undefined,
        resultado,
        created_by: user?.id,
      } as VerificacionFabricacion;
    });

    replaceVerificacionesByJornada(id, nuevas);
    updateJornada(id, { estado: 'fabricacion_verificada' });
    router.push(`/fabrica/jornadas/${id}`);
  };

  const sections = [
    { title: 'Armadura', points: PUNTOS_ARMADURA },
    { title: 'Moldaje', points: PUNTOS_MOLDAJE },
    { title: 'Hormigonado', points: PUNTOS_HORMIGONADO },
  ];

  const current = postes[activeIdx];
  const moldesParaTipo = allMoldes.filter(m => m.activo && m.tipo_poste === current?.tipo_poste);
  const otrosMoldes = allMoldes.filter(m => m.activo && m.tipo_poste !== current?.tipo_poste);

  const getWorkerName = (wId: string) => trabajadores.find(t => t.id === wId)?.nombre || wId;
  const actividadFields = [
    { field: 'operadores_enfierradura', label: 'Enfierradura' },
    { field: 'operadores_moldaje', label: 'Moldaje' },
    { field: 'operadores_hormigonado', label: 'Hormigonado' },
    { field: 'operadores_curado', label: 'Curado' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Verificaci&oacute;n de Fabricaci&oacute;n</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Jornada {jornada.codigo} &mdash; {totalPostes} poste(s) &mdash; {completedPostes}/{totalPostes} completos
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>&#8592; Volver</Button>
      </div>

      {/* Lista de postes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Postes a verificar</h2>
          <Button size="sm" variant="outline" onClick={addPoste}>+ Agregar poste</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {postes.map((poste, idx) => {
            const complete = isPosteComplete(poste);
            const hasNC = posteHasNC(poste);
            const molde = poste.molde_id ? allMoldes.find(m => m.id === poste.molde_id) : null;
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs font-medium transition-all border flex items-center gap-2',
                  activeIdx === idx
                    ? 'bg-primary text-primary-foreground border-primary'
                    : complete
                      ? hasNC
                        ? 'bg-status-red/10 border-status-red/30 text-status-red'
                        : 'bg-status-green/10 border-status-green/30 text-status-green'
                      : 'bg-card/50 border-border/50 hover:bg-muted/30'
                )}
              >
                <span className="font-bold">{idx + 1}</span>
                <span>{poste.tipo_poste}</span>
                {molde && <span className="opacity-70">{molde.numero}</span>}
                {(poste.override_operadores || poste.override_materiales) && <span title="Tiene ajustes">&#9998;</span>}
                {complete && <span>{hasNC ? '\u274c' : '\u2705'}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {current && (
        <>
          {/* Encabezado del poste */}
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Poste {activeIdx + 1} de {totalPostes}</h3>
                {postes.length > 1 && (
                  <Button size="sm" variant="ghost" className="text-xs text-status-red hover:text-status-red" onClick={() => removePoste(activeIdx)}>
                    Quitar poste
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Tipo de poste</Label>
                  <select
                    value={current.tipo_poste}
                    onChange={e => updatePoste(activeIdx, { tipo_poste: e.target.value as TipoPoste, molde_id: '' })}
                    className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {jornada.tipos_poste.map(tp => (
                      <option key={tp} value={tp}>{tp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Molde</Label>
                  <select
                    value={current.molde_id}
                    onChange={e => updatePoste(activeIdx, { molde_id: e.target.value })}
                    className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Seleccionar...</option>
                    {moldesParaTipo.length > 0 && (
                      <optgroup label={`Moldes ${current.tipo_poste}`}>
                        {moldesParaTipo.map(m => (
                          <option key={m.id} value={m.id}>{m.numero}</option>
                        ))}
                      </optgroup>
                    )}
                    {otrosMoldes.length > 0 && (
                      <optgroup label="Otros">
                        {otrosMoldes.map(m => (
                          <option key={m.id} value={m.id}>{m.numero} ({m.tipo_poste})</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
                <div>
                  <Label>C&oacute;digo elemento</Label>
                  <Input
                    className="mt-1.5"
                    value={current.codigo_elemento}
                    onChange={e => updatePoste(activeIdx, { codigo_elemento: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Toggle: Operadores diferentes a la jornada */}
          <Card className={cn('border-border/50', current.override_operadores ? 'bg-amber-500/5 border-amber-500/20' : 'bg-card/50')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Operadores</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {current.override_operadores
                      ? 'Operadores ajustados para este poste'
                      : `Heredados de jornada: ${jornada.operadores_enfierradura.map(getWorkerName).join(', ').substring(0, 60)}...`
                    }
                  </p>
                </div>
                <button
                  onClick={() => updatePoste(activeIdx, { override_operadores: !current.override_operadores })}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    current.override_operadores
                      ? 'bg-amber-500/20 border-amber-500/30 text-amber-600'
                      : 'bg-card border-border/50 hover:bg-muted/30'
                  )}
                >
                  {current.override_operadores ? '&#10003; Ajustados' : 'Cambiar operadores'}
                </button>
              </div>

              {current.override_operadores && (
                <div className="mt-4 space-y-3">
                  {actividadFields.map(({ field, label }) => (
                    <div key={field}>
                      <Label className="text-xs">{label}</Label>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {trabajadores.filter(t => t.activo !== false).map(trab => {
                          const selected = ((current as any)[field] as string[]).includes(trab.id);
                          return (
                            <button
                              key={trab.id}
                              onClick={() => toggleOperador(activeIdx, field, trab.id)}
                              className={cn(
                                'px-2.5 py-1 rounded-md text-xs border transition-all',
                                selected
                                  ? 'bg-primary/15 border-primary/30 text-primary font-medium'
                                  : 'bg-card border-border/50 hover:bg-muted/20'
                              )}
                            >
                              {trab.nombre}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Toggle: Materiales diferentes a la jornada */}
          <Card className={cn('border-border/50', current.override_materiales ? 'bg-amber-500/5 border-amber-500/20' : 'bg-card/50')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Materiales</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {current.override_materiales
                      ? 'Materiales ajustados para este poste'
                      : `Heredados: Cemento ${jornada.lote_cemento || '-'} | Acero ${jornada.lote_acero || '-'}`
                    }
                  </p>
                </div>
                <button
                  onClick={() => updatePoste(activeIdx, { override_materiales: !current.override_materiales })}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    current.override_materiales
                      ? 'bg-amber-500/20 border-amber-500/30 text-amber-600'
                      : 'bg-card border-border/50 hover:bg-muted/30'
                  )}
                >
                  {current.override_materiales ? '&#10003; Ajustados' : 'Cambiar materiales'}
                </button>
              </div>

              {current.override_materiales && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Lote cemento</Label>
                    <Input className="mt-1 h-8 text-xs" value={current.lote_cemento} onChange={e => updatePoste(activeIdx, { lote_cemento: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Partida &aacute;ridos</Label>
                    <Input className="mt-1 h-8 text-xs" value={current.partida_aridos} onChange={e => updatePoste(activeIdx, { partida_aridos: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Lote acero</Label>
                    <Input className="mt-1 h-8 text-xs" value={current.lote_acero} onChange={e => updatePoste(activeIdx, { lote_acero: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Aditivo</Label>
                    <Input className="mt-1 h-8 text-xs" value={current.aditivo_detalle} onChange={e => updatePoste(activeIdx, { aditivo_detalle: e.target.value })} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 20 puntos de verificacion */}
          {sections.map((section, sIdx) => {
            const allCumple = isSectionAllCumple(section.points);
            return (
            <Card key={section.title} className={`bg-card/50 border-border/50 ${sIdx % 2 === 1 ? 'bg-muted/5' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{section.title} ({section.points.length} puntos)</CardTitle>
                  <button
                    onClick={() => setSectionCumple(section.points)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 flex items-center gap-1.5',
                      allCumple
                        ? 'bg-status-green/15 border-status-green/30 text-status-green'
                        : 'bg-card border-border/50 hover:bg-status-green/10 hover:border-status-green/30 hover:text-status-green text-muted-foreground'
                    )}
                  >
                    {allCumple ? '✓' : '☐'} Cumple los {section.points.length}
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                {section.points.map((punto, pIdx) => (
                  <div key={punto.id} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted/10">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5 text-right shrink-0">{pIdx + 1}.</span>
                      <span className="text-sm">{punto.texto}</span>
                    </div>
                    <div className="flex gap-1.5 shrink-0 ml-4">
                      {PUNTO_BUTTONS.map(btn => (
                        <button
                          key={btn.value}
                          onClick={() => setPunto(activeIdx, punto.id, btn.value)}
                          className={cn(
                            'w-11 h-11 rounded-lg border text-sm font-bold transition-all duration-200',
                            current.puntos[punto.id] === btn.value ? btn.activeColor : btn.color
                          )}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
          })}

          {/* Resultado + observaciones */}
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 space-y-4">
              {isPosteComplete(current) && (
                <div className={cn(
                  'p-3 rounded-lg text-sm font-medium',
                  posteHasNC(current)
                    ? 'bg-status-red/10 text-status-red border border-status-red/20'
                    : 'bg-status-green/10 text-status-green border border-status-green/20'
                )}>
                  Resultado poste {activeIdx + 1}: {posteHasNC(current) ? '\u274c No Conforme' : '\u2705 Conforme'}
                </div>
              )}
              <div>
                <Label>Observaciones</Label>
                <Textarea
                  className="mt-1.5"
                  placeholder="Observaciones para este poste..."
                  value={current.observaciones}
                  onChange={e => updatePoste(activeIdx, { observaciones: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Navegacion entre postes */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" disabled={activeIdx === 0} onClick={() => setActiveIdx(prev => prev - 1)}>
              &#8592; Poste anterior
            </Button>
            <span className="text-xs text-muted-foreground">{activeIdx + 1} de {totalPostes}</span>
            {activeIdx < totalPostes - 1 ? (
              <Button variant="outline" size="sm" onClick={() => setActiveIdx(prev => prev + 1)}>
                Poste siguiente &#8594;
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={addPoste}>
                + Otro poste
              </Button>
            )}
          </div>
        </>
      )}

      <Separator />

      {/* Resumen */}
      {postes.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Resumen ({totalPostes} postes)</h3>
            <div className="space-y-1.5">
              {postes.map((poste, idx) => {
                const complete = isPosteComplete(poste);
                const hasNC = posteHasNC(poste);
                const molde = poste.molde_id ? allMoldes.find(m => m.id === poste.molde_id) : null;
                const completedCount = Object.values(poste.puntos).filter(v => v !== null).length;
                return (
                  <div key={idx} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-muted/10 cursor-pointer" onClick={() => setActiveIdx(idx)}>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-mono text-xs w-5 text-right">{idx + 1}.</span>
                      <span className="font-medium">{poste.tipo_poste}</span>
                      {molde && <span className="text-muted-foreground">{molde.numero}</span>}
                      {poste.codigo_elemento && <span className="text-xs text-muted-foreground font-mono">{poste.codigo_elemento}</span>}
                      {(poste.override_operadores || poste.override_materiales) && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">ajustado</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{completedCount}/20</span>
                      {complete ? (
                        <span className={cn('text-xs px-2 py-0.5 rounded font-medium',
                          hasNC ? 'bg-status-red/15 text-status-red' : 'bg-status-green/15 text-status-green'
                        )}>
                          {hasNC ? 'No Conforme' : 'Conforme'}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded bg-muted/30 text-muted-foreground">Pendiente</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!allPostesComplete} size="lg">
          Guardar ({totalPostes} poste{totalPostes !== 1 ? 's' : ''})
        </Button>
      </div>
    </div>
  );
}
