'use client';

import { use, useState, useEffect } from 'react';
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

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditarJornadaPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { user, can } = useAuth();
  const { getJornada, updateJornada, getMaterialesByPlanta, getTrabajadoresByPlanta, getCondicionesByPlanta, addAuditLog } = useApp();

  const jornada = getJornada(id);
  const canEdit = can('editar_jornada');

  const materiales = getMaterialesByPlanta(jornada?.planta_id || '').filter(m => m.activo);
  const trabajadores = getTrabajadoresByPlanta(jornada?.planta_id || '').filter(t => t.activo);
  const condiciones = getCondicionesByPlanta(jornada?.planta_id || '');

  // Form state
  const [tiposPoste, setTiposPoste] = useState<TipoPoste[]>([]);
  const [destino, setDestino] = useState<DestinoProduccion>('SAESA');
  const [temperatura, setTemperatura] = useState('');
  const [humedad, setHumedad] = useState('');
  const [medidas, setMedidas] = useState<MedidaProteccion[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Record<TipoMaterial, string>>({
    cemento: '', aridos: '', acero: '', aditivo: '',
  });
  const [cono, setCono] = useState('');
  const [opEnfierradura, setOpEnfierradura] = useState<string[]>([]);
  const [opMoldaje, setOpMoldaje] = useState<string[]>([]);
  const [opHormigonado, setOpHormigonado] = useState<string[]>([]);
  const [opCurado, setOpCurado] = useState<string[]>([]);

  // Populate from existing jornada
  useEffect(() => {
    if (!jornada) return;
    setTiposPoste(jornada.tipos_poste || []);
    setDestino(jornada.destino || 'SAESA');
    setTemperatura(jornada.temperatura?.toString() || '');
    setHumedad(jornada.humedad_relativa?.toString() || '');
    setMedidas(jornada.medidas_proteccion || []);
    setSelectedMaterials({
      cemento: jornada.material_cemento_id || '',
      aridos: jornada.material_aridos_id || '',
      acero: jornada.material_acero_id || '',
      aditivo: jornada.material_aditivo_id || '',
    });
    setCono(jornada.cono_abrams_mm?.toString() || '');
    setOpEnfierradura(jornada.operadores_enfierradura || []);
    setOpMoldaje(jornada.operadores_moldaje || []);
    setOpHormigonado(jornada.operadores_hormigonado || []);
    setOpCurado(jornada.operadores_curado || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!jornada) {
    return <div className="text-center py-20 text-muted-foreground">Jornada no encontrada</div>;
  }

  if (!canEdit) {
    return <div className="text-center py-20 text-muted-foreground">No tiene permisos para editar esta jornada</div>;
  }

  if (jornada.estado === 'cerrada') {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted-foreground">Esta jornada está cerrada y no puede ser editada.</p>
        <Button onClick={() => router.push(`/fabrica/jornadas/${id}`)}>← Volver a jornada</Button>
      </div>
    );
  }

  const toggleTipo = (tipo: TipoPoste) => {
    setTiposPoste(prev => prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]);
  };
  const toggleMedida = (medida: MedidaProteccion) => {
    setMedidas(prev => prev.includes(medida) ? prev.filter(m => m !== medida) : [...prev, medida]);
  };

  // Cono validation
  const conoVal = parseInt(cono);
  const conoStatus = isNaN(conoVal) ? null : conoVal >= RANGO_CONO_ABRAMS.min && conoVal <= RANGO_CONO_ABRAMS.max ? 'ok' : 'warn';

  // Certificate check
  const getCertificateStatus = (materialId: string) => {
    if (!materialId) return null;
    const mat = materiales.find(m => m.id === materialId);
    if (!mat?.certificado_id) return null;
    const cert = condiciones.find(c => c.id === mat.certificado_id);
    return cert?.estado || null;
  };

  const getSelectedMaterialInfo = (tipo: TipoMaterial) => {
    const matId = selectedMaterials[tipo];
    if (!matId) return null;
    return materiales.find(m => m.id === matId) || null;
  };

  // Capacitación check
  const isCapacitacionVencida = (trabajadorId: string) => {
    const t = trabajadores.find(tr => tr.id === trabajadorId);
    if (!t?.fecha_ultima_capacitacion) return false;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return new Date(t.fecha_ultima_capacitacion) < sixMonthsAgo;
  };

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
    const matCemento = materiales.find(m => m.id === selectedMaterials.cemento);
    const matAridos = materiales.find(m => m.id === selectedMaterials.aridos);
    const matAcero = materiales.find(m => m.id === selectedMaterials.acero);
    const matAditivo = materiales.find(m => m.id === selectedMaterials.aditivo);

    // Build changes log
    const changes: string[] = [];
    if (destino !== jornada.destino) changes.push(`Destino: ${jornada.destino} → ${destino}`);
    if (JSON.stringify(tiposPoste.sort()) !== JSON.stringify((jornada.tipos_poste || []).sort())) changes.push('Tipos de poste modificados');
    if (selectedMaterials.cemento !== (jornada.material_cemento_id || '')) changes.push('Lote de cemento modificado');
    if (selectedMaterials.acero !== (jornada.material_acero_id || '')) changes.push('Lote de acero modificado');

    updateJornada(id, {
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
    });

    // Audit log
    if (changes.length > 0) {
      addAuditLog({
        id: `audit-${Date.now()}`,
        fecha: new Date().toISOString().slice(0, 10),
        hora: new Date().toTimeString().slice(0, 5),
        usuario_id: user?.id || '',
        usuario_nombre: user?.nombre || '',
        rol: user?.rol || 'jefe_planta',
        accion: 'editar_jornada',
        modulo: 'jornadas',
        detalle: `Jornada ${jornada.codigo} editada: ${changes.join('; ')}`,
        planta_id: jornada.planta_id,
      });
    }

    router.push(`/fabrica/jornadas/${id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">✏️ Editar Jornada {jornada.codigo}</h1>
        <p className="text-muted-foreground text-sm mt-1">{jornada.fecha} — Editando como {user?.nombre}</p>
      </div>

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
        </CardContent>
      </Card>

      {/* Equipo del Día */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base">Equipo del Día</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-1.5 mb-1.5"><span>🔩</span> Enfierradura</Label>
              <MultiSelectDropdown options={getOperatorOptions('enfierradura')} selected={opEnfierradura} onChange={setOpEnfierradura} placeholder="Seleccionar..." />
            </div>
            <div>
              <Label className="flex items-center gap-1.5 mb-1.5"><span>📐</span> Moldaje</Label>
              <MultiSelectDropdown options={getOperatorOptions('moldaje')} selected={opMoldaje} onChange={setOpMoldaje} placeholder="Seleccionar..." />
            </div>
            <div>
              <Label className="flex items-center gap-1.5 mb-1.5"><span>🏗️</span> Hormigonado</Label>
              <MultiSelectDropdown options={getOperatorOptions('hormigonado')} selected={opHormigonado} onChange={setOpHormigonado} placeholder="Seleccionar..." />
            </div>
            <div>
              <Label className="flex items-center gap-1.5 mb-1.5"><span>💧</span> Curado</Label>
              <MultiSelectDropdown options={getOperatorOptions('curado')} selected={opCurado} onChange={setOpCurado} placeholder="Seleccionar..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materiales */}
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
                      <option value="">Seleccionar...</option>
                      {activos.map(mat => (
                        <option key={mat.id} value={mat.id}>
                          {mat.codigo_lote}{mat.proveedor ? ` — ${mat.proveedor}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                  {selectedInfo && (
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">
                        {selectedInfo.proveedor && `${selectedInfo.proveedor}`}
                        {selectedInfo.fecha_recepcion && ` · ${selectedInfo.fecha_recepcion}`}
                      </span>
                      {certStatus === 'vencido' && <span className="text-[10px] text-status-red">⚠️ Cert. vencido</span>}
                      {certStatus === 'por_vencer' && <span className="text-[10px] text-status-yellow">⚠️ Cert. por vencer</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

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
        <Button variant="outline" onClick={() => router.push(`/fabrica/jornadas/${id}`)}>Cancelar</Button>
        <Button onClick={handleSave} disabled={tiposPoste.length === 0} size="lg">💾 Guardar cambios</Button>
      </div>
    </div>
  );
}
