'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelectDropdown } from '@/components/multi-select-dropdown';
import { TIPOS_POSTE, MEDIDAS_PROTECCION, TIPOS_MATERIAL, RANGO_CONO_ABRAMS } from '@/lib/constants';
import type { TipoPoste, DestinoProduccion, MedidaProteccion, TipoMaterial } from '@/lib/types';
import { format } from 'date-fns';

export default function NuevaJornadaPage() {
  const router = useRouter();
  const { user, planta } = useAuth();
  const { getTrabajadoresByPlanta, getMaterialesByPlanta, getCondicionesByPlanta, addJornada, getJornadasByPlanta } = useApp();
  const trabajadores = getTrabajadoresByPlanta(planta?.id || '').filter(t => t.activo);
  const materiales = getMaterialesByPlanta(planta?.id || '').filter(m => m.activo);
  const condiciones = getCondicionesByPlanta(planta?.id || '');
  const jornadas = getJornadasByPlanta(planta?.id || '');

  const hoy = format(new Date(), 'yyyy-MM-dd');
  const codigoFecha = format(new Date(), 'yyMMdd');

  // Múltiples lotes por día: calcular secuencia y heredar materiales del último lote de hoy
  const jornadasHoy = jornadas.filter(j => j.fecha === hoy);
  const ultimaJornadaHoy = [...jornadasHoy].sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  const secuencia = jornadasHoy.length + 1;
  const codigo = `${planta?.codigo || 'XXX'}-${codigoFecha}-${secuencia}`;

  // --- Producción ---
  const [tiposPoste, setTiposPoste] = useState<TipoPoste[]>([]);
  const [destino, setDestino] = useState<DestinoProduccion>(
    (ultimaJornadaHoy?.destino as DestinoProduccion) ?? 'SAESA'
  );

  // --- Condiciones ambientales ---
  const [temperatura, setTemperatura] = useState('');
  const [humedad, setHumedad] = useState('');
  const [medidas, setMedidas] = useState<MedidaProteccion[]>([]);

  // --- Materiales (selección por ID) ---
  const [selectedMaterials, setSelectedMaterials] = useState<Record<TipoMaterial, string>>({
    cemento: '',
    aridos: '',
    acero: '',
    aditivo: '',
  });
  const [cono, setCono] = useState('');

  // --- Operadores ---
  const [opEnfierradura, setOpEnfierradura] = useState<string[]>([]);
  const [opMoldaje, setOpMoldaje] = useState<string[]>([]);
  const [opHormigonado, setOpHormigonado] = useState<string[]>([]);
  const [opCurado, setOpCurado] = useState<string[]>([]);

  // Auto-select materials when there's only one active per type
  useEffect(() => {
    const autoSelect: Record<TipoMaterial, string> = { cemento: '', aridos: '', acero: '', aditivo: '' };
    if (ultimaJornadaHoy) {
      // Heredar IDs de materiales del último lote del mismo día
      autoSelect.cemento = ultimaJornadaHoy.material_cemento_id || '';
      autoSelect.aridos  = ultimaJornadaHoy.material_aridos_id  || '';
      autoSelect.acero   = ultimaJornadaHoy.material_acero_id   || '';
      autoSelect.aditivo = ultimaJornadaHoy.material_aditivo_id || '';
    } else {
      // Sin lotes previos hoy: auto-seleccionar si hay un único activo por tipo
      for (const tipo of ['cemento', 'aridos', 'acero', 'aditivo'] as TipoMaterial[]) {
        const activos = materiales.filter(m => m.tipo === tipo);
        if (activos.length === 1) autoSelect[tipo] = activos[0].id;
      }
    }
    setSelectedMaterials(autoSelect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const toggleTipo = (tipo: TipoPoste) => {
    setTiposPoste(prev => prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]);
  };

  const toggleMedida = (medida: MedidaProteccion) => {
    setMedidas(prev => prev.includes(medida) ? prev.filter(m => m !== medida) : [...prev, medida]);
  };

  // Alertas
  const temp = parseFloat(temperatura);
  const alertaTemp = !isNaN(temp) && temp < 5 && !medidas.includes('aditivos') && !medidas.includes('agua_caliente');
  const mes = new Date().getMonth() + 1;
  const alertaEpoca = (mes >= 5 && mes <= 9) && !medidas.includes('mantas_termicas');

  // Cono validation
  const conoVal = parseInt(cono);
  const conoStatus = isNaN(conoVal) ? null : conoVal >= RANGO_CONO_ABRAMS.min && conoVal <= RANGO_CONO_ABRAMS.max ? 'ok' : 'warn';

  // Certificate status for selected materials
  const getCertificateStatus = (materialId: string) => {
    if (!materialId) return null;
    const mat = materiales.find(m => m.id === materialId);
    if (!mat?.certificado_id) return null;
    const cert = condiciones.find(c => c.id === mat.certificado_id);
    return cert?.estado || null;
  };

  // Get selected material info
  const getSelectedMaterialInfo = (tipo: TipoMaterial) => {
    const id = selectedMaterials[tipo];
    if (!id) return null;
    return materiales.find(m => m.id === id) || null;
  };

  // Capacitación check
  const isCapacitacionVencida = (trabajadorId: string) => {
    const t = trabajadores.find(tr => tr.id === trabajadorId);
    if (!t?.fecha_ultima_capacitacion) return false;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return new Date(t.fecha_ultima_capacitacion) < sixMonthsAgo;
  };

  // Build operator options for multi-select
  const getOperatorOptions = (actividad: string) => {
    return trabajadores
      .filter(t => t.actividades_habilitadas.includes(actividad))
      .map(t => ({
        id: t.id,
        label: t.nombre,
        warning: isCapacitacionVencida(t.id) ? 'Cap. vencida' : undefined,
      }));
  };

  const handleSave = () => {
    const alertas: string[] = [];
    if (alertaTemp) alertas.push('Temperatura < 5°C sin medidas de protección adecuadas.');
    if (alertaEpoca) alertas.push('Período mayo-septiembre sin mantas térmicas.');

    // Check for expired certifications on workers
    const allOps = [...new Set([...opEnfierradura, ...opMoldaje, ...opHormigonado, ...opCurado])];
    allOps.forEach(opId => {
      if (isCapacitacionVencida(opId)) {
        const t = trabajadores.find(tr => tr.id === opId);
        alertas.push(`Operador ${t?.nombre || opId} tiene capacitación vencida.`);
      }
    });

    // Resolve material codes for backward compatibility
    const matCemento = materiales.find(m => m.id === selectedMaterials.cemento);
    const matAridos = materiales.find(m => m.id === selectedMaterials.aridos);
    const matAcero = materiales.find(m => m.id === selectedMaterials.acero);
    const matAditivo = materiales.find(m => m.id === selectedMaterials.aditivo);

    addJornada({
      id: `jrn-new-${Date.now()}`,
      planta_id: planta?.id || '',
      fecha: hoy,
      codigo,
      tipos_poste: tiposPoste,
      destino,
      temperatura: parseFloat(temperatura) || undefined,
      humedad_relativa: parseInt(humedad) || undefined,
      medidas_proteccion: medidas,
      lote_cemento: matCemento?.codigo_lote || undefined,
      partida_aridos: matAridos?.codigo_lote || undefined,
      lote_acero: matAcero?.codigo_lote || undefined,
      aditivo_detalle: matAditivo ? `${matAditivo.descripcion || matAditivo.codigo_lote}` : undefined,
      material_cemento_id: selectedMaterials.cemento || undefined,
      material_aridos_id: selectedMaterials.aridos || undefined,
      material_acero_id: selectedMaterials.acero || undefined,
      material_aditivo_id: selectedMaterials.aditivo || undefined,
      cono_abrams_mm: parseInt(cono) || undefined,
      operadores_enfierradura: opEnfierradura,
      operadores_moldaje: opMoldaje,
      operadores_hormigonado: opHormigonado,
      operadores_curado: opCurado,
      estado: 'abierta',
      alertas,
      created_by: user?.id,
      created_at: hoy,
    });
    router.push('/fabrica/jornadas');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Nueva Jornada de Fabricación</h1>
        <p className="text-muted-foreground text-sm mt-1">{planta?.nombre} — {hoy} — {codigo}</p>
      </div>

      {/* Banner informativo si ya hay lotes hoy */}
      {jornadasHoy.length > 0 && (
        <div className="p-3 rounded-lg bg-status-blue/10 border border-status-blue/20 text-xs text-status-blue flex items-start gap-2">
          <span className="shrink-0 mt-0.5">ℹ️</span>
          <span>
            Ya hay <strong>{jornadasHoy.length}</strong> lote(s) registrado(s) hoy
            ({jornadasHoy.map(j => j.codigo).join(', ')}).
            Este será el <strong>lote #{secuencia}</strong>.
            Los materiales fueron heredados del lote anterior.
          </span>
        </div>
      )}

      {/* Encabezado */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base">Encabezado</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground">Planta:</span> <span className="font-medium">{planta?.codigo}</span></div>
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

      {/* Equipo del Día — Multi-select dropdowns 2×2 */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base">Equipo del Día</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-1.5 mb-1.5">
                <span>🔩</span> Enfierradura
              </Label>
              <MultiSelectDropdown
                options={getOperatorOptions('enfierradura')}
                selected={opEnfierradura}
                onChange={setOpEnfierradura}
                placeholder="Seleccionar..."
              />
            </div>
            <div>
              <Label className="flex items-center gap-1.5 mb-1.5">
                <span>📐</span> Moldaje
              </Label>
              <MultiSelectDropdown
                options={getOperatorOptions('moldaje')}
                selected={opMoldaje}
                onChange={setOpMoldaje}
                placeholder="Seleccionar..."
              />
            </div>
            <div>
              <Label className="flex items-center gap-1.5 mb-1.5">
                <span>🏗️</span> Hormigonado
              </Label>
              <MultiSelectDropdown
                options={getOperatorOptions('hormigonado')}
                selected={opHormigonado}
                onChange={setOpHormigonado}
                placeholder="Seleccionar..."
              />
            </div>
            <div>
              <Label className="flex items-center gap-1.5 mb-1.5">
                <span>💧</span> Curado
              </Label>
              <MultiSelectDropdown
                options={getOperatorOptions('curado')}
                selected={opCurado}
                onChange={setOpCurado}
                placeholder="Seleccionar..."
              />
            </div>
          </div>

          {/* Resumen de asignados */}
          {(opEnfierradura.length + opMoldaje.length + opHormigonado.length + opCurado.length) > 0 && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground/70">Asignados: </span>
                {[...new Set([...opEnfierradura, ...opMoldaje, ...opHormigonado, ...opCurado])].map(id => {
                  const t = trabajadores.find(tr => tr.id === id);
                  const roles: string[] = [];
                  if (opEnfierradura.includes(id)) roles.push('E');
                  if (opMoldaje.includes(id)) roles.push('M');
                  if (opHormigonado.includes(id)) roles.push('H');
                  if (opCurado.includes(id)) roles.push('C');
                  return `${t?.nombre || id} (${roles.join(',')})`;
                }).join(' · ')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Materiales y Dosificación — Dropdowns 2×2 */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base">Materiales y Dosificación</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {TIPOS_MATERIAL.map(tipoMat => {
              const activos = materiales.filter(m => m.tipo === tipoMat.value);
              const selected = selectedMaterials[tipoMat.value];
              const selectedInfo = getSelectedMaterialInfo(tipoMat.value);
              const certStatus = selected ? getCertificateStatus(selected) : null;

              return (
                <div key={tipoMat.value}>
                  <Label className="flex items-center gap-1.5 mb-1.5">
                    <span>{tipoMat.icon}</span> {tipoMat.label}
                  </Label>
                  {activos.length === 0 ? (
                    <div className="h-10 rounded-md border border-status-yellow/30 bg-status-yellow/5 flex items-center px-3">
                      <span className="text-xs text-status-yellow">⚠️ Sin lotes registrados</span>
                    </div>
                  ) : (
                    <select
                      value={selected}
                      onChange={e => setSelectedMaterials(prev => ({ ...prev, [tipoMat.value]: e.target.value }))}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {activos.length > 1 && <option value="">Seleccionar...</option>}
                      {activos.map(mat => (
                        <option key={mat.id} value={mat.id}>
                          {mat.codigo_lote}{mat.proveedor ? ` — ${mat.proveedor}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                  {/* Info del material seleccionado */}
                  {selectedInfo && (
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">
                        {selectedInfo.proveedor && `${selectedInfo.proveedor}`}
                        {selectedInfo.fecha_recepcion && ` · ${selectedInfo.fecha_recepcion}`}
                      </span>
                      {certStatus === 'vencido' && (
                        <span className="text-[10px] text-status-red">⚠️ Cert. vencido</span>
                      )}
                      {certStatus === 'por_vencer' && (
                        <span className="text-[10px] text-status-yellow">⚠️ Cert. por vencer</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cono de Abrams */}
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-xs">
              <Label className="flex items-center gap-1.5 mb-1.5">
                Cono de Abrams
                <span className="text-xs text-muted-foreground font-normal">({RANGO_CONO_ABRAMS.min}–{RANGO_CONO_ABRAMS.max} {RANGO_CONO_ABRAMS.unidad})</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input type="number" value={cono} onChange={e => setCono(e.target.value)} placeholder={`${RANGO_CONO_ABRAMS.min}-${RANGO_CONO_ABRAMS.max}`} />
                <span className="text-sm text-muted-foreground shrink-0">mm</span>
              </div>
            </div>
            {conoStatus === 'ok' && <span className="text-xs text-status-green pb-2.5">✅ Rango OK</span>}
            {conoStatus === 'warn' && <span className="text-xs text-status-yellow pb-2.5">⚠️ Fuera de rango</span>}
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
