'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PUNTOS_PRODUCTO_TERMINADO, METODOS_CURADO } from '@/lib/constants';
import type { PuntoVerificacion, MetodoCurado } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Props {
  params: Promise<{ id: string }>;
}

const PUNTO_BUTTONS = [
  { value: 'C' as PuntoVerificacion, label: 'C', color: 'border-status-green/30 text-status-green hover:bg-status-green/10', activeColor: 'bg-status-green text-white border-status-green' },
  { value: 'NC' as PuntoVerificacion, label: 'NC', color: 'border-status-red/30 text-status-red hover:bg-status-red/10', activeColor: 'bg-status-red text-white border-status-red' },
  { value: 'NA' as PuntoVerificacion, label: 'NA', color: 'border-muted-foreground/30 text-muted-foreground hover:bg-muted/30', activeColor: 'bg-muted text-foreground border-muted' },
];

export default function ProductoTerminadoPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { user, planta, can } = useAuth();
  const { getJornada, getNCByJornada, getProductoTerminadoByJornada, addProductoTerminado, updateJornada } = useApp();
  const jornada = getJornada(id);
  const existingPT = getProductoTerminadoByJornada(id);

  const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [metodoCurado, setMetodoCurado] = useState<MetodoCurado>('membrana_cavecur');
  const [puntos, setPuntos] = useState<Record<string, PuntoVerificacion>>(() => {
    const initial: Record<string, PuntoVerificacion> = {};
    PUNTOS_PRODUCTO_TERMINADO.forEach(p => { initial[p.id] = null as any; });
    return initial;
  });
  const [requiereRevision, setRequiereRevision] = useState(false);
  const [liberacion, setLiberacion] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [yaGuardado, setYaGuardado] = useState(false);

  // Pre-cargar datos existentes si ya hay un PT guardado
  useEffect(() => {
    if (existingPT) {
      setFecha(existingPT.fecha);
      if (existingPT.metodo_curado) setMetodoCurado(existingPT.metodo_curado);
      const loaded: Record<string, PuntoVerificacion> = {};
      PUNTOS_PRODUCTO_TERMINADO.forEach(p => {
        loaded[p.id] = (existingPT as any)[p.id] || null;
      });
      setPuntos(loaded);
      setRequiereRevision(!!existingPT.nc_detectadas);
      setObservaciones(existingPT.observaciones || '');
      setYaGuardado(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!jornada) return <div className="text-center py-20 text-muted-foreground">Jornada no encontrada</div>;

  const allCompleted = Object.values(puntos).every(v => v !== null);
  const hasNC = Object.values(puntos).some(v => v === 'NC');
  const ncsAbiertas = getNCByJornada(id).filter(nc => nc.estado === 'abierta');

  const handleSave = () => {
    const puedeLiberar = can('liberar_producto');
    const hayProblemas = hasNC || requiereRevision || ncsAbiertas.length > 0;
    const cerrarDirectamente = puedeLiberar && liberacion && !hayProblemas;

    addProductoTerminado({
      id: existingPT ? existingPT.id : `pt-new-${Date.now()}`,
      jornada_id: id,
      fecha,
      metodo_curado: metodoCurado,
      ...Object.fromEntries(
        PUNTOS_PRODUCTO_TERMINADO.map(p => [p.id, puntos[p.id]])
      ),
      observaciones: observaciones || undefined,
      resultado: hasNC ? 'no_conforme' : 'conforme',
      nc_detectadas: requiereRevision,
      liberacion_confirmada: cerrarDirectamente,
      created_by: user?.id,
    } as any);

    updateJornada(id, { estado: cerrarDirectamente ? 'cerrada' : 'producto_terminado' });
    router.push(`/fabrica/jornadas/${id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Producto Terminado</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Jornada {jornada.codigo}
            {yaGuardado && <span className="ml-2 text-status-blue">(registro existente)</span>}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>&#8592; Volver</Button>
      </div>

      {yaGuardado && (
        <div className="p-3 rounded-lg bg-status-blue/10 border border-status-blue/20 text-xs text-status-blue">
          Este reporte ya fue guardado previamente. Los datos mostrados son los registrados. Puede modificarlos y guardar nuevamente.
        </div>
      )}

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha de verificaci&oacute;n</Label>
              <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>M&eacute;todo de curado</Label>
              <select
                value={metodoCurado}
                onChange={e => setMetodoCurado(e.target.value as MetodoCurado)}
                className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {METODOS_CURADO.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Verificaci&oacute;n de Producto Terminado (6 puntos)</CardTitle>
            <button
              onClick={() => {
                const updated: Record<string, PuntoVerificacion> = { ...puntos };
                PUNTOS_PRODUCTO_TERMINADO.forEach(p => { updated[p.id] = 'C'; });
                setPuntos(updated);
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 flex items-center gap-1.5',
                Object.values(puntos).every(v => v === 'C')
                  ? 'bg-status-green/15 border-status-green/30 text-status-green'
                  : 'bg-card border-border/50 hover:bg-status-green/10 hover:border-status-green/30 hover:text-status-green text-muted-foreground'
              )}
            >
              {Object.values(puntos).every(v => v === 'C') ? '✓' : '☐'} Cumple los 6
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          {PUNTOS_PRODUCTO_TERMINADO.map((punto, idx) => (
            <div key={punto.id} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted/10">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xs text-muted-foreground w-5 text-right shrink-0">{idx + 1}.</span>
                <span className="text-sm">{punto.texto}</span>
              </div>
              <div className="flex gap-1.5 shrink-0 ml-4">
                {PUNTO_BUTTONS.map(btn => (
                  <button
                    key={btn.value}
                    onClick={() => setPuntos(prev => ({ ...prev, [punto.id]: btn.value }))}
                    className={cn(
                      'w-11 h-11 rounded-lg border text-sm font-bold transition-all duration-200',
                      puntos[punto.id] === btn.value ? btn.activeColor : btn.color
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

      {allCompleted && (
        <div className={cn(
          'p-3 rounded-lg text-sm font-medium',
          hasNC ? 'bg-status-red/10 text-status-red border border-status-red/20' : 'bg-status-green/10 text-status-green border border-status-green/20'
        )}>
          Resultado: {hasNC ? 'No Conforme' : 'Conforme'}
        </div>
      )}

      <Separator />

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10">
            <div>
              <p className="text-sm font-medium">&#191;Requiere revisi&oacute;n de Jefatura/Calidad?</p>
              <p className="text-xs text-muted-foreground">Marcar si hay hallazgos que el Jefe de Planta o Encargado de Calidad deban revisar</p>
            </div>
            <Switch checked={requiereRevision} onCheckedChange={setRequiereRevision} />
          </div>

          <div>
            <Label>Observaciones</Label>
            <Textarea className="mt-1.5" placeholder="Observaciones de la inspecci&oacute;n..." value={observaciones} onChange={e => setObservaciones(e.target.value)} />
          </div>

          <Separator />

          {ncsAbiertas.length > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-status-red/20 bg-status-red/5">
              <div>
                <p className="text-sm font-bold text-status-red">Liberaci&oacute;n bloqueada por NC abierta</p>
                <p className="text-xs text-status-red/80">
                  Existen {ncsAbiertas.length} No Conformidad(es) abierta(s) vinculada(s) a esta jornada.
                  Deben cerrarse antes de liberar.
                </p>
              </div>
            </div>
          )}

          {ncsAbiertas.length === 0 && (hasNC || requiereRevision) && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-status-yellow/20 bg-status-yellow/5">
              <div>
                <p className="text-sm font-medium text-status-yellow">Pendiente de revisi&oacute;n</p>
                <p className="text-xs text-muted-foreground">
                  {hasNC ? 'Se detectaron puntos No Conformes en la inspecci&oacute;n. ' : ''}
                  {requiereRevision ? 'El operador solicit&oacute; revisi&oacute;n. ' : ''}
                  El Jefe de Planta o Encargado de Calidad debe revisar antes de liberar.
                  {can('liberar_producto') && ' Si tras revisar considera que no amerita NC, puede liberar directamente.'}
                </p>
              </div>
            </div>
          )}

          {ncsAbiertas.length === 0 && !hasNC && !requiereRevision && can('liberar_producto') && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-status-green/20 bg-status-green/5 transition-opacity">
              <input type="checkbox" checked={liberacion} onChange={e => setLiberacion(e.target.checked)} className="w-5 h-5 accent-[var(--status-green)]" />
              <div>
                <p className="text-sm font-medium">Confirmo la liberaci&oacute;n</p>
                <p className="text-xs text-muted-foreground">Los postes de esta jornada est&aacute;n conformes para su destino.</p>
              </div>
            </div>
          )}

          {ncsAbiertas.length === 0 && !hasNC && !requiereRevision && !can('liberar_producto') && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-status-blue/20 bg-status-blue/5">
              <div>
                <p className="text-sm font-medium text-status-blue">Reporte listo para liberar</p>
                <p className="text-xs text-muted-foreground">El Jefe de Planta o Encargado de Calidad deber&aacute; revisar este reporte y liberar la jornada.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!allCompleted} size="lg">
          {can('liberar_producto') && liberacion && !hasNC && !requiereRevision && ncsAbiertas.length === 0
            ? 'Guardar y cerrar jornada'
            : yaGuardado ? 'Actualizar reporte' : 'Guardar reporte de inspecci\u00f3n'}
        </Button>
      </div>
    </div>
  );
}