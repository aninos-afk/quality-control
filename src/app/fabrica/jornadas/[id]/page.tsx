'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { EstadoJornadaBadge } from '@/components/estado-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DESTINOS_LABELS } from '@/lib/constants';

interface Props {
  params: Promise<{ id: string }>;
}

export default function JornadaDetallePage({ params }: Props) {
  const { id } = use(params);
  const { getJornada, getVerificacionesByJornada, getDesmoldeByJornada, getProductoTerminadoByJornada, getNCByJornada, getDespachoByJornada, trabajadores, moldes, usuarios, updateJornada, addAuditLog } = useApp();
  const { user, can } = useAuth();
  const router = useRouter();

  const jornada = getJornada(id);
  if (!jornada) return <div className="text-center py-20 text-muted-foreground">Jornada no encontrada</div>;

  const handleLiberar = () => {
    updateJornada(id, { estado: 'cerrada' });
    addAuditLog({
      id: `audit-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      hora: new Date().toTimeString().slice(0, 5),
      usuario_id: user?.id || '',
      usuario_nombre: user?.nombre || '',
      rol: user?.rol || 'jefe_planta',
      accion: 'liberar_jornada',
      modulo: 'jornadas',
      detalle: `Jornada ${jornada.codigo} liberada`,
      planta_id: jornada.planta_id,
    });
    router.refresh();
  };

  const handleToggleVisibleExterno = () => {
    const nuevoEstado = !jornada.visible_externo;
    updateJornada(id, { visible_externo: nuevoEstado });
    addAuditLog({
      id: `audit-vis-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      hora: new Date().toTimeString().slice(0, 5),
      usuario_id: user?.id || '',
      usuario_nombre: user?.nombre || '',
      rol: user?.rol || 'jefe_planta',
      accion: nuevoEstado ? 'publicar_jornada' : 'ocultar_jornada',
      modulo: 'jornadas',
      detalle: `Jornada ${jornada.codigo} ${nuevoEstado ? 'publicada al auditor externo' : 'retirada de visibilidad externa'}`,
      planta_id: jornada.planta_id,
    });
    router.refresh();
  };

  const verificaciones = getVerificacionesByJornada(id);
  const desmolde = getDesmoldeByJornada(id);
  const productoTerminado = getProductoTerminadoByJornada(id);
  const despacho = getDespachoByJornada(id);
  const ncs = getNCByJornada(id);

  const getStepStatus = (step: number) => {
    const estados: Record<number, { done: boolean; locked: boolean }> = {
      1: { done: true, locked: false },
      2: { done: verificaciones.length > 0, locked: false },
      3: { done: !!desmolde, locked: verificaciones.length === 0 },
      4: { done: !!productoTerminado, locked: !desmolde },
      5: { done: !!despacho, locked: jornada.estado !== 'cerrada' && jornada.estado !== 'despachada' },
    };
    return estados[step] || { done: false, locked: true };
  };

  const getWorkerNames = (ids: string[]) => ids.map(id => trabajadores.find(t => t.id === id)?.nombre || id).join(', ');

  const ROL_LABELS: Record<string, string> = {
    jefe_planta: 'Jefe de Planta',
    encargado_calidad: 'Enc. Calidad',
    encargado_patio: 'Enc. Patio',
    auditor_externo: 'Auditor',
    auditor_plataforma: 'Admin',
  };
  const getUserLabel = (userId?: string) => {
    if (!userId) return null;
    const u = usuarios.find(u => u.id === userId);
    if (!u) return null;
    return `${u.nombre} (${ROL_LABELS[u.rol] || u.rol})`;
  };

  const tieneHallazgos = productoTerminado && (productoTerminado.nc_detectadas || productoTerminado.resultado === 'no_conforme');
  const ncsAbiertas = ncs.filter(nc => nc.estado === 'abierta');

  const ptDesc = productoTerminado
    ? [
        `${productoTerminado.fecha}`,
        productoTerminado.resultado === 'conforme' ? 'Conforme' : 'No conforme',
        productoTerminado.nc_detectadas ? '⚠️ Requiere revisión' : '',
      ].filter(Boolean).join(' — ')
    : '';

  const verCreatedBy = verificaciones.length > 0 ? getUserLabel(verificaciones[0].created_by) : null;
  const desCreatedBy = desmolde ? getUserLabel(desmolde.created_by) : null;
  const ptCreatedBy = productoTerminado ? getUserLabel(productoTerminado.created_by) : null;
  const jrnCreatedBy = getUserLabel(jornada.created_by);

  const despachoDesc = despacho
    ? [
        `Guía ${despacho.numero_guia}`,
        despacho.destinatario,
        despacho.postes.reduce((s, p) => s + p.cantidad, 0) + ' postes',
        despacho.estado_recepcion === 'conforme' ? '✅ Recibido conforme'
          : despacho.estado_recepcion === 'con_danos' ? '⚠️ Con daños en recepción'
          : '⏳ Pendiente de recepción',
      ].join(' · ')
    : '';

  const steps = [
    { num: 1, label: 'Jornada', desc: `${jornada.temperatura}°C | ${jornada.humedad_relativa}% HR | Cemento: ${jornada.lote_cemento}`, href: null, createdBy: jrnCreatedBy },
    { num: 2, label: 'Verificación', desc: verificaciones.length > 0 ? verificaciones.map(v => {
      const molde = v.molde_id ? moldes.find((m: { id: string; numero: string }) => m.id === v.molde_id) : null;
      const parts: string[] = [v.tipo_poste];
      if (molde) parts.push(molde.numero);
      if (v.codigo_elemento) parts.push(v.codigo_elemento);
      parts.push(v.resultado === 'conforme' ? 'Conforme' : 'No conforme');
      return parts.join(' · ');
    }).join(' | ') : '', href: `/fabrica/jornadas/${id}/verificacion`, createdBy: verCreatedBy },
    { num: 3, label: 'Desmolde', desc: desmolde ? `${desmolde.fecha} — ${desmolde.defectos_detectados ? 'Con defectos corregidos' : 'Sin defectos'}` : '', href: `/fabrica/jornadas/${id}/desmolde`, createdBy: desCreatedBy },
    { num: 4, label: 'Producto terminado', desc: ptDesc, href: `/fabrica/jornadas/${id}/terminado`, createdBy: ptCreatedBy },
    { num: 5, label: 'Despacho', desc: despachoDesc, href: `/fabrica/jornadas/${id}/despacho`, createdBy: null },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Jornada {jornada.codigo}</h1>
            <EstadoJornadaBadge estado={jornada.estado} />
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {jornada.fecha} | Destino: {DESTINOS_LABELS[jornada.destino]} | Tipos: {jornada.tipos_poste.join(', ')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {can('toggle_visible_externo') && jornada.estado === 'cerrada' && (
            <button
              onClick={handleToggleVisibleExterno}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                jornada.visible_externo
                  ? 'bg-status-blue/10 border-status-blue/30 text-status-blue hover:bg-status-blue/20'
                  : 'bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {jornada.visible_externo ? '👁️ Visible al auditor' : '🔒 Solo interno'}
            </button>
          )}
          {can('liberar_producto') && jornada.estado === 'producto_terminado' && !tieneHallazgos && ncsAbiertas.length === 0 && (
            <Button size="sm" className="bg-status-green hover:bg-status-green/90 text-white" onClick={handleLiberar}>
              ✅ Liberar Jornada
            </Button>
          )}
          {can('editar_jornada') && jornada.estado !== 'cerrada' && (
            <Link href={`/fabrica/jornadas/${id}/editar`}><Button variant="outline" size="sm">✏️ Editar</Button></Link>
          )}
          <Link href="/fabrica/jornadas"><Button variant="outline" size="sm">← Volver</Button></Link>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map(step => {
          const status = getStepStatus(step.num);
          return (
            <Card key={step.num} className={`bg-card/50 border-border/50 ${status.locked ? 'opacity-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold" style={{
                      background: status.done ? 'var(--status-green)' : status.locked ? 'var(--muted)' : 'var(--status-blue)',
                      color: '#fff',
                      opacity: status.locked ? 0.5 : 1,
                    }}>
                      {status.done ? '✓' : status.locked ? '🔒' : step.num}
                    </div>
                    <div>
                      <div className="font-medium">Etapa {step.num}: {step.label}</div>
                      {step.desc && <div className="text-xs text-muted-foreground mt-0.5">{step.desc}</div>}
                      {step.createdBy && status.done && (
                        <div className="text-[10px] text-muted-foreground/60 mt-0.5 italic">por {step.createdBy}</div>
                      )}
                    </div>
                  </div>
                  {step.href && !status.locked && (
                    <Link href={step.href}>
                      <Button size="sm" variant={status.done ? 'outline' : 'default'}>
                        {status.done ? 'Ver' : 'Registrar'}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hallazgos pendientes de revisión */}
      {jornada.estado === 'producto_terminado' && tieneHallazgos && (
        <Card className="bg-status-yellow/5 border-status-yellow/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-status-yellow">Hallazgos pendientes de revisión</h3>
                <p className="text-xs text-muted-foreground">
                  El encargado de patio reportó hallazgos en esta jornada que requieren su revisión.
                </p>
                {productoTerminado?.resultado === 'no_conforme' && (
                  <p className="text-xs text-status-red">Resultado de inspección: No Conforme (puntos NC detectados)</p>
                )}
                {productoTerminado?.nc_detectadas && (
                  <p className="text-xs text-status-yellow">El operador solicitó revisión de Jefatura/Calidad</p>
                )}
                {productoTerminado?.observaciones && (
                  <div className="mt-2 p-2 rounded-lg bg-muted/20 border border-border/30">
                    <p className="text-xs text-muted-foreground">Observaciones del operador:</p>
                    <p className="text-sm mt-0.5 italic">"{productoTerminado.observaciones}"</p>
                  </div>
                )}
              </div>
            </div>
            {can('liberar_producto') && (
              <div className="flex items-center gap-2 pt-2 border-t border-status-yellow/20">
                <Button size="sm" variant="outline" className="text-xs border-status-yellow/30 text-status-yellow hover:bg-status-yellow/10" onClick={handleLiberar}>
                  Liberar sin NC (hallazgo menor)
                </Button>
                <span className="text-[10px] text-muted-foreground">o cree una NC formal desde el módulo de No Conformidades</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* NC abiertas bloqueando liberación */}
      {jornada.estado === 'producto_terminado' && ncsAbiertas.length > 0 && (
        <Card className="bg-status-red/5 border-status-red/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🚫</span>
              <div>
                <h3 className="text-sm font-semibold text-status-red">Liberación bloqueada</h3>
                <p className="text-xs text-muted-foreground">
                  Existen {ncsAbiertas.length} No Conformidad(es) abierta(s) vinculada(s). Deben cerrarse antes de liberar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Datos de jornada */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-base">Datos de la Jornada</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Temperatura:</span> <span className="font-medium">{jornada.temperatura}°C</span></div>
            <div><span className="text-muted-foreground">Humedad:</span> <span className="font-medium">{jornada.humedad_relativa}%</span></div>
            <div><span className="text-muted-foreground">Cemento:</span> <span className="font-medium">{jornada.lote_cemento}</span></div>
            <div><span className="text-muted-foreground">Áridos:</span> <span className="font-medium">{jornada.partida_aridos}</span></div>
            <div><span className="text-muted-foreground">Acero:</span> <span className="font-medium">{jornada.lote_acero}</span></div>
            <div><span className="text-muted-foreground">Cono Abrams:</span> <span className="font-medium">{jornada.cono_abrams_mm} mm</span></div>
            <div><span className="text-muted-foreground">Enfierradura:</span> <span className="font-medium">{getWorkerNames(jornada.operadores_enfierradura)}</span></div>
            <div><span className="text-muted-foreground">Moldaje:</span> <span className="font-medium">{getWorkerNames(jornada.operadores_moldaje)}</span></div>
            <div><span className="text-muted-foreground">Hormigonado:</span> <span className="font-medium">{getWorkerNames(jornada.operadores_hormigonado)}</span></div>
            <div><span className="text-muted-foreground">Curado:</span> <span className="font-medium">{getWorkerNames(jornada.operadores_curado)}</span></div>
          </div>
          {jrnCreatedBy && (
            <div className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground/60 italic">
              Creada por {jrnCreatedBy} el {jornada.created_at}
            </div>
          )}
        </CardContent>
      </Card>

      {/* NCs vinculadas */}
      {ncs.length > 0 && (
        <Card className="bg-card/50 border-status-red/20">
          <CardHeader><CardTitle className="text-base">No Conformidades ({ncs.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ncs.map(nc => (
                <div key={nc.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                  <div>
                    <span className="font-mono text-xs">{nc.numero}</span>
                    <span className="text-xs text-muted-foreground ml-2">{nc.tipo_defecto.replace(/_/g, ' ')}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${nc.estado === 'abierta' ? 'bg-status-red/15 text-status-red' : 'bg-status-green/15 text-status-green'}`}>
                    {nc.estado}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas */}
      {jornada.alertas && jornada.alertas.length > 0 && (
        <Card className="bg-status-yellow/5 border-status-yellow/20">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-status-yellow mb-2">⚠️ Alertas</h3>
            {jornada.alertas.map((alerta, i) => (
              <p key={i} className="text-xs text-status-yellow/80">{alerta}</p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
