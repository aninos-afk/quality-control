'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

interface Props {
  params: Promise<{ id: string }>;
}

export default function DesmoldePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { user, planta } = useAuth();
  const { getJornada, addDesmolde, updateJornada } = useApp();
  const jornada = getJornada(id);

  const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [eslinga, setEslinga] = useState(true);
  const [defectos, setDefectos] = useState(false);
  const [observaciones, setObservaciones] = useState('');

  if (!jornada) return <div className="text-center py-20 text-muted-foreground">Jornada no encontrada</div>;

  const handleSave = () => {
    addDesmolde({
      id: `des-new-${Date.now()}`,
      jornada_id: id,
      fecha,
      eslinga_dos_puntos: eslinga,
      defectos_detectados: defectos,
      observaciones: observaciones || undefined,
      created_by: user?.id,
    });

    // Nota: los defectos detectados en desmolde se corrigen en el acto.
    // Solo se registra la observación. Si amerita NC formal, el Jefe de Planta
    // o Encargado de Calidad la crea manualmente desde la revisión de producto terminado.

    updateJornada(id, { estado: 'desmolde_registrado' });
    router.push(`/fabrica/jornadas/${id}`);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Registro de Desmolde</h1>
          <p className="text-muted-foreground text-sm mt-1">Jornada {jornada.codigo}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>← Volver</Button>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-base">Datos del desmolde</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Fecha de desmolde</Label>
            <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="mt-1.5 max-w-xs" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10">
            <div>
              <p className="text-sm font-medium">¿Desmolde con eslinga de 2 puntos?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Exigido por instructivo I7130</p>
            </div>
            <Switch checked={eslinga} onCheckedChange={setEslinga} />
          </div>

          {!eslinga && (
            <div className="p-3 rounded-lg bg-status-yellow/10 border border-status-yellow/20 text-xs text-status-yellow">
              ⚠️ El instructivo de fabricación exige desmolde con eslinga de 2 puntos.
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10">
            <div>
              <p className="text-sm font-medium">¿Se detectaron defectos visibles?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Fisuras, despuntes, nidos u otros</p>
            </div>
            <Switch checked={defectos} onCheckedChange={setDefectos} />
          </div>

          {defectos && (
            <div className="p-4 rounded-xl border border-status-yellow/20 bg-status-yellow/5 space-y-3">
              <p className="text-sm font-medium text-status-yellow">Registrar corrección realizada</p>
              <p className="text-xs text-muted-foreground">
                📝 Describa el defecto detectado y la corrección aplicada. Esta observación quedará registrada en la trazabilidad de la jornada.
              </p>
              <Textarea placeholder="Ej: Despunte menor en base, se realizó limpieza manual..." value={observaciones} onChange={e => setObservaciones(e.target.value)} />
            </div>
          )}

          {!defectos && (
            <div>
              <Label>Observaciones (opcional)</Label>
              <Textarea className="mt-1.5" placeholder="Observaciones adicionales..." value={observaciones} onChange={e => setObservaciones(e.target.value)} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">Guardar desmolde</Button>
      </div>
    </div>
  );
}
