'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TIPOS_POSTE, MEDIDAS_PROTECCION } from '@/lib/constants';
import type { TipoPoste, DestinoProduccion, MedidaProteccion } from '@/lib/types';
import { format } from 'date-fns';

export default function NuevaJornadaPage() {
  const router = useRouter();
  const { currentFabricaId, getTrabajadoresByFabrica, addJornada, getJornadasByFabrica, getFabrica } = useApp();
  const fabrica = getFabrica(currentFabricaId);
  const trabajadores = getTrabajadoresByFabrica(currentFabricaId).filter(t => t.activo);
  const jornadas = getJornadasByFabrica(currentFabricaId);

  const hoy = format(new Date(), 'yyyy-MM-dd');
  const codigoFecha = format(new Date(), 'yyMMdd');
  const codigo = `${fabrica?.codigo || 'TMC'}-${codigoFecha}`;

  const [tiposPoste, setTiposPoste] = useState<TipoPoste[]>([]);
  const [destino, setDestino] = useState<DestinoProduccion>('SAESA');
  const [temperatura, setTemperatura] = useState('');
  const [humedad, setHumedad] = useState('');
  const [medidas, setMedidas] = useState<MedidaProteccion[]>([]);
  const [loteCemento, setLoteCemento] = useState('');
  const [partidaAridos, setPartidaAridos] = useState('');
  const [loteAcero, setLoteAcero] = useState('');
  const [aditivo, setAditivo] = useState('');
  const [cono, setCono] = useState('');

  const already = jornadas.find(j => j.fecha === hoy);

  const toggleTipo = (tipo: TipoPoste) => {
    setTiposPoste(prev => prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]);
  };

  const toggleMedida = (medida: MedidaProteccion) => {
    setMedidas(prev => prev.includes(medida) ? prev.filter(m => m !== medida) : [...prev, medida]);
  };

  const temp = parseFloat(temperatura);
  const alertaTemp = !isNaN(temp) && temp < 5 && !medidas.includes('aditivos') && !medidas.includes('agua_caliente');
  const mes = new Date().getMonth() + 1;
  const alertaEpoca = (mes >= 5 && mes <= 9) && !medidas.includes('mantas_termicas');

  const handleSave = () => {
    const alertas: string[] = [];
    if (alertaTemp) alertas.push('Temperatura < 5°C sin medidas de protección adecuadas.');
    if (alertaEpoca) alertas.push('Período mayo-septiembre sin mantas térmicas.');

    addJornada({
      id: `jrn-new-${Date.now()}`,
      fabrica_id: currentFabricaId,
      fecha: hoy,
      codigo,
      tipos_poste: tiposPoste,
      destino,
      temperatura: parseFloat(temperatura) || undefined,
      humedad_relativa: parseInt(humedad) || undefined,
      medidas_proteccion: medidas,
      lote_cemento: loteCemento || undefined,
      partida_aridos: partidaAridos || undefined,
      lote_acero: loteAcero || undefined,
      aditivo_detalle: aditivo || undefined,
      cono_abrams_mm: parseInt(cono) || undefined,
      operadores_enfierradura: [],
      operadores_moldaje: [],
      operadores_hormigonado: [],
      operadores_curado: [],
      estado: 'abierta',
      alertas,
      created_at: hoy,
    });
    router.push('/fabrica/jornadas');
  };

  if (already) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted-foreground">Ya existe una jornada para hoy ({already.codigo}).</p>
        <Button onClick={() => router.push(`/fabrica/jornadas/${already.id}`)}>Ver jornada →</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Nueva Jornada de Fabricación</h1>
        <p className="text-muted-foreground text-sm mt-1">{fabrica?.nombre} — {hoy} — {codigo}</p>
      </div>

      {/* Encabezado */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base">Encabezado</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground">Planta:</span> <span className="font-medium">{fabrica?.codigo}</span></div>
            <div><span className="text-muted-foreground">Fecha:</span> <span className="font-medium">{hoy}</span></div>
            <div><span className="text-muted-foreground">Código:</span> <span className="font-mono font-medium">{codigo}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Producción */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base">Producción del Día</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tipos de poste</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {TIPOS_POSTE.map(tp => (
                <label key={tp.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${tiposPoste.includes(tp.value) ? 'border-primary bg-primary/5' : 'border-border/50 hover:bg-muted/20'}`}>
                  <Checkbox checked={tiposPoste.includes(tp.value)} onCheckedChange={() => toggleTipo(tp.value)} />
                  <span className="text-sm">{tp.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label>Destino</Label>
            <select value={destino} onChange={e => setDestino(e.target.value as DestinoProduccion)} className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="SAESA">SAESA</option>
              <option value="otro_cliente">Otro cliente</option>
              <option value="stock">Stock</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Condiciones ambientales */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base">Condiciones Ambientales</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Temperatura (°C)</Label>
              <Input type="number" step="0.1" value={temperatura} onChange={e => setTemperatura(e.target.value)} placeholder="ej: 12.5" className="mt-1.5" />
            </div>
            <div>
              <Label>Humedad relativa (%)</Label>
              <Input type="number" value={humedad} onChange={e => setHumedad(e.target.value)} placeholder="ej: 75" className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Medidas de protección</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {MEDIDAS_PROTECCION.map(m => (
                <label key={m.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${medidas.includes(m.value) ? 'border-primary bg-primary/5' : 'border-border/50 hover:bg-muted/20'}`}>
                  <Checkbox checked={medidas.includes(m.value)} onCheckedChange={() => toggleMedida(m.value)} />
                  <span className="text-sm">{m.label}</span>
                </label>
              ))}
            </div>
          </div>
          {alertaTemp && (
            <div className="p-3 rounded-lg bg-status-yellow/10 border border-status-yellow/20 text-xs text-status-yellow">
              ⚠️ Temperatura inferior a 5°C. El instructivo exige uso de aditivos y agua caliente.
            </div>
          )}
          {alertaEpoca && (
            <div className="p-3 rounded-lg bg-status-yellow/10 border border-status-yellow/20 text-xs text-status-yellow">
              ⚠️ Período mayo-septiembre: el instructivo requiere curado con mantas térmicas.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Materiales + Dosificación */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base">Materiales y Dosificación</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Lote cemento</Label><Input value={loteCemento} onChange={e => setLoteCemento(e.target.value)} placeholder="ej: CB-2026-03-A" className="mt-1.5" /></div>
            <div><Label>Partida áridos</Label><Input value={partidaAridos} onChange={e => setPartidaAridos(e.target.value)} placeholder="ej: AR-2026-Q1" className="mt-1.5" /></div>
            <div><Label>Lote acero</Label><Input value={loteAcero} onChange={e => setLoteAcero(e.target.value)} placeholder="ej: AZ-2026-02" className="mt-1.5" /></div>
            <div><Label>Aditivo</Label><Input value={aditivo} onChange={e => setAditivo(e.target.value)} placeholder="ej: Plastificante 0.5%" className="mt-1.5" /></div>
          </div>
          <div className="max-w-xs">
            <Label>Cono de Abrams (mm)</Label>
            <Input type="number" value={cono} onChange={e => setCono(e.target.value)} placeholder="10-20 mm" className="mt-1.5" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button onClick={handleSave} disabled={tiposPoste.length === 0} size="lg">Guardar jornada</Button>
      </div>
    </div>
  );
}
