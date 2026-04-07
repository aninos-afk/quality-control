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
import { TIPOS_POSTE } from '@/lib/constants';
import type { TipoPoste } from '@/lib/types';

export default function MoldesPage() {
  const { planta, can } = useAuth();
  const { getMoldesByPlanta, addMolde, updateMolde } = useApp();
  const moldes = getMoldesByPlanta(planta?.id || '');
  const canEdit = can('editar_configuracion');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [numero, setNumero] = useState('');
  const [tipoPoste, setTipoPoste] = useState<TipoPoste | ''>('');

  const resetForm = () => {
    setNumero('');
    setTipoPoste('');
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (id: string) => {
    const m = moldes.find(mol => mol.id === id);
    if (!m) return;
    setEditingId(id);
    setNumero(m.numero);
    setTipoPoste(m.tipo_poste || '');
    setShowForm(true);
  };

  const handleSave = () => {
    if (!numero.trim()) return;

    if (editingId) {
      updateMolde(editingId, {
        numero: numero.trim(),
        tipo_poste: tipoPoste || undefined,
      });
    } else {
      addMolde({
        id: `mol-new-${Date.now()}`,
        planta_id: planta?.id || '',
        numero: numero.trim(),
        tipo_poste: tipoPoste || undefined,
        activo: true,
      });
    }
    resetForm();
  };

  const toggleActivo = (id: string, activo: boolean) => {
    updateMolde(id, { activo: !activo });
  };

  const activos = moldes.filter(m => m.activo);
  const inactivos = moldes.filter(m => !m.activo);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground text-sm mt-1">Moldes, personal y materiales de la planta</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/50 pb-2">
        <Link href="/fabrica/configuracion/moldes" className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary">Moldes</Link>
        <Link href="/fabrica/configuracion/personal" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Personal</Link>
        <Link href="/fabrica/configuracion/materiales" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Materiales</Link>
      </div>

      {/* Add button */}
      {canEdit && !showForm && (
        <Button onClick={() => { resetForm(); setShowForm(true); }}>+ Agregar molde</Button>
      )}

      {/* Form — agregar / editar */}
      {showForm && (
        <Card className="bg-card/50 border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{editingId ? 'Editar molde' : 'Nuevo molde'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Número de molde *</Label>
                <Input value={numero} onChange={e => setNumero(e.target.value)} placeholder="ej: M-006" className="mt-1.5" />
              </div>
              <div>
                <Label>Tipo de poste asignado</Label>
                <select
                  value={tipoPoste}
                  onChange={e => setTipoPoste(e.target.value as TipoPoste | '')}
                  className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Sin asignar</option>
                  {TIPOS_POSTE.map(tp => (
                    <option key={tp.value} value={tp.value}>{tp.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!numero.trim()}>
                {editingId ? 'Guardar cambios' : 'Agregar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active moldes */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Moldes Activos ({activos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {activos.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No hay moldes activos registrados</p>
          ) : (
            <div className="space-y-2">
              {activos.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{m.numero}</span>
                      <Badge variant="outline" className="text-[10px] text-status-green border-status-green/30">Activo</Badge>
                    </div>
                    {m.tipo_poste && (
                      <p className="text-xs text-muted-foreground">
                        Tipo: {TIPOS_POSTE.find(tp => tp.value === m.tipo_poste)?.label || m.tipo_poste}
                      </p>
                    )}
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => startEdit(m.id)}>
                        ✏️
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => toggleActivo(m.id, m.activo)}>
                        Desactivar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inactive moldes */}
      {inactivos.length > 0 && (
        <Card className="bg-card/50 border-border/50 opacity-70">
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">Moldes Inactivos ({inactivos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inactivos.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/5 border border-border/20">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-muted-foreground">{m.numero}</span>
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">Inactivo</Badge>
                    </div>
                    {m.tipo_poste && (
                      <p className="text-xs text-muted-foreground">
                        Tipo: {TIPOS_POSTE.find(tp => tp.value === m.tipo_poste)?.label || m.tipo_poste}
                      </p>
                    )}
                  </div>
                  {canEdit && (
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => toggleActivo(m.id, m.activo)}>
                      Reactivar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
