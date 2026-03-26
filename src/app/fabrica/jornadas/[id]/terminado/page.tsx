'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
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
  const { getJornada, addProductoTerminado, updateJornada } = useApp();
  const jornada = getJornada(id);

  const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [metodoCurado, setMetodoCurado] = useState<MetodoCurado>('membrana_cavecur');
  const [puntos, setPuntos] = useState<Record<string, PuntoVerificacion>>(() => {
    const initial: Record<string, PuntoVerificacion> = {};
    PUNTOS_PRODUCTO_TERMINADO.forEach(p => { initial[p.id] = null; });
    return initial;
  });
  const [ncDetectadas, setNcDetectadas] = useState(false);
  const [liberacion, setLiberacion] = useState(false);
  const [observaciones, setObservaciones] = useState('');

  if (!jornada) return <div className="text-center py-20 text-muted-foreground">Jornada no encontrada</div>;

  const allCompleted = Object.values(puntos).every(v => v !== null);
  const hasNC = Object.values(puntos).some(v => v === 'NC');

  const handleSave = () => {
    addProductoTerminado({
      id: `pt-new-${Date.now()}`,
      jornada_id: id,
      fecha,
      metodo_curado: metodoCurado,
      ...Object.fromEntries(
        PUNTOS_PRODUCTO_TERMINADO.map(p => [p.id, puntos[p.id]])
      ),
      observaciones: observaciones || undefined,
      resultado: hasNC ? 'no_conforme' : 'conforme',
      nc_detectadas: ncDetectadas,
      liberacion_confirmada: liberacion,
    } as any);
    updateJornada(id, { estado: liberacion ? 'cerrada' : 'producto_terminado' });
    router.push(`/fabrica/jornadas/${id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Producto Terminado</h1>
          <p className="text-muted-foreground text-sm mt-1">Jornada {jornada.codigo}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>← Volver</Button>
      </div>

      {/* Info */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha de verificación</Label>
              <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Método de curado</Label>
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

      {/* 6 verification points */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Verificación de Producto Terminado (6 puntos)</CardTitle>
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
          Resultado: {hasNC ? '❌ No Conforme' : '✅ Conforme'}
        </div>
      )}

      <Separator />

      {/* NC detection */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10">
            <div>
              <p className="text-sm font-medium">¿Se detectaron postes no conformes?</p>
              <p className="text-xs text-muted-foreground">Defectos visuales detectados en inspección general</p>
            </div>
            <Switch checked={ncDetectadas} onCheckedChange={setNcDetectadas} />
          </div>

          <div>
            <Label>Observaciones</Label>
            <Textarea className="mt-1.5" placeholder="Observaciones..." value={observaciones} onChange={e => setObservaciones(e.target.value)} />
          </div>

          <Separator />

          <div className="flex items-center gap-3 p-4 rounded-xl border border-status-green/20 bg-status-green/5">
            <input type="checkbox" checked={liberacion} onChange={e => setLiberacion(e.target.checked)} className="w-5 h-5 accent-[var(--status-green)]" />
            <div>
              <p className="text-sm font-medium">Confirmo la liberación</p>
              <p className="text-xs text-muted-foreground">Los postes de esta jornada están conformes para su destino.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!allCompleted} size="lg">
          {liberacion ? 'Guardar y cerrar jornada' : 'Guardar producto terminado'}
        </Button>
      </div>
    </div>
  );
}
