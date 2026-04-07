'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TIPOS_MATERIAL } from '@/lib/constants';
import type { TipoMaterial } from '@/lib/types';

export default function MaterialesPage() {
  const { user, planta, can } = useAuth();
  const { getMaterialesByPlanta, getCondicionesByPlanta, addMaterial, updateMaterial } = useApp();
  const materiales = getMaterialesByPlanta(planta?.id || '');
  const condiciones = getCondicionesByPlanta(planta?.id || '').filter(c => c.tipo === 'certificado_mp');
  const canEdit = can('gestionar_materiales');

  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState<TipoMaterial>('cemento');
  const [codigoLote, setCodigoLote] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaRecepcion, setFechaRecepcion] = useState('');
  const [certificadoId, setCertificadoId] = useState('');

  const resetForm = () => {
    setCodigoLote('');
    setProveedor('');
    setDescripcion('');
    setFechaRecepcion('');
    setCertificadoId('');
    setShowForm(false);
  };

  const handleSave = () => {
    if (!codigoLote.trim()) return;
    addMaterial({
      id: `mat-new-${Date.now()}`,
      planta_id: planta?.id || '',
      tipo,
      codigo_lote: codigoLote.trim(),
      proveedor: proveedor.trim() || undefined,
      descripcion: descripcion.trim() || undefined,
      fecha_recepcion: fechaRecepcion || undefined,
      certificado_id: certificadoId || undefined,
      activo: true,
      created_by: user?.id || '',
      created_at: new Date().toISOString().slice(0, 10),
    });
    resetForm();
  };

  const toggleActivo = (id: string, activo: boolean) => {
    updateMaterial(id, { activo: !activo });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground text-sm mt-1">Moldes, personal y materiales de la planta</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/50 pb-2">
        <Link href="/fabrica/configuracion/moldes" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Moldes</Link>
        <Link href="/fabrica/configuracion/personal" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Personal</Link>
        <Link href="/fabrica/configuracion/materiales" className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary">Materiales</Link>
      </div>

      {/* Add button */}
      {canEdit && !showForm && (
        <Button onClick={() => setShowForm(true)}>+ Agregar material</Button>
      )}

      {/* Form */}
      {showForm && (
        <Card className="bg-card/50 border-primary/30">
          <CardHeader className="pb-2"><CardTitle className="text-base">Nuevo material</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de material</Label>
                <select
                  value={tipo}
                  onChange={e => setTipo(e.target.value as TipoMaterial)}
                  className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {TIPOS_MATERIAL.map(t => (
                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Código de lote *</Label>
                <Input value={codigoLote} onChange={e => setCodigoLote(e.target.value)} placeholder="ej: CB-2026-03-B" className="mt-1.5" />
              </div>
              <div>
                <Label>Proveedor</Label>
                <Input value={proveedor} onChange={e => setProveedor(e.target.value)} placeholder="ej: Cementos Bío Bío" className="mt-1.5" />
              </div>
              <div>
                <Label>Descripción</Label>
                <Input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="ej: Cemento Portland Puzolánico" className="mt-1.5" />
              </div>
              <div>
                <Label>Fecha de recepción</Label>
                <Input type="date" value={fechaRecepcion} onChange={e => setFechaRecepcion(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Certificado vinculado</Label>
                <select
                  value={certificadoId}
                  onChange={e => setCertificadoId(e.target.value)}
                  className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Sin certificado</option>
                  {condiciones.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.descripcion} ({c.estado})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!codigoLote.trim()}>Guardar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Materials by type */}
      {TIPOS_MATERIAL.map(tipoMat => {
        const items = materiales.filter(m => m.tipo === tipoMat.value);
        const activos = items.filter(m => m.activo);
        const inactivos = items.filter(m => !m.activo);

        return (
          <Card key={tipoMat.value} className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{tipoMat.icon}</span> {tipoMat.label}
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  {activos.length} activo{activos.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No hay materiales de tipo {tipoMat.label.toLowerCase()} registrados</p>
              ) : (
                <div className="space-y-2">
                  {[...activos, ...inactivos].map(m => (
                    <div key={m.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${m.activo ? 'bg-muted/10 border-border/30' : 'bg-muted/5 border-border/20 opacity-60'}`}>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold">{m.codigo_lote}</span>
                          <Badge variant="outline" className={`text-[10px] ${m.activo ? 'text-status-green border-status-green/30' : 'text-muted-foreground'}`}>
                            {m.activo ? 'Activo' : 'Agotado'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          {m.proveedor && <span>{m.proveedor}</span>}
                          {m.proveedor && m.fecha_recepcion && <span>•</span>}
                          {m.fecha_recepcion && <span>Recibido {m.fecha_recepcion}</span>}
                        </div>
                      </div>
                      {canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActivo(m.id, m.activo)}
                          className="text-xs shrink-0"
                        >
                          {m.activo ? 'Marcar agotado' : 'Reactivar'}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
