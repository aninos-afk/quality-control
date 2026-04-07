'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const ACTIVIDADES = [
  { value: 'enfierradura', label: 'Enfierradura', icon: '🔩' },
  { value: 'moldaje', label: 'Moldaje', icon: '📐' },
  { value: 'hormigonado', label: 'Hormigonado', icon: '🏗️' },
  { value: 'curado', label: 'Curado', icon: '💧' },
];

export default function PersonalPage() {
  const { planta, can } = useAuth();
  const { getTrabajadoresByPlanta, addTrabajador, updateTrabajador } = useApp();
  const trabajadores = getTrabajadoresByPlanta(planta?.id || '');
  const canEdit = can('editar_configuracion');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [actividades, setActividades] = useState<string[]>([]);
  const [fechaCapacitacion, setFechaCapacitacion] = useState('');

  const resetForm = () => {
    setNombre('');
    setActividades([]);
    setFechaCapacitacion('');
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (id: string) => {
    const t = trabajadores.find(tr => tr.id === id);
    if (!t) return;
    setEditingId(id);
    setNombre(t.nombre);
    setActividades([...t.actividades_habilitadas]);
    setFechaCapacitacion(t.fecha_ultima_capacitacion || '');
    setShowForm(true);
  };

  const toggleActividad = (act: string) => {
    setActividades(prev => prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]);
  };

  const handleSave = () => {
    if (!nombre.trim() || actividades.length === 0) return;

    if (editingId) {
      updateTrabajador(editingId, {
        nombre: nombre.trim(),
        actividades_habilitadas: actividades,
        fecha_ultima_capacitacion: fechaCapacitacion || undefined,
      });
    } else {
      addTrabajador({
        id: `trb-new-${Date.now()}`,
        planta_id: planta?.id || '',
        nombre: nombre.trim(),
        actividades_habilitadas: actividades,
        fecha_ultima_capacitacion: fechaCapacitacion || undefined,
        activo: true,
      });
    }
    resetForm();
  };

  const toggleActivo = (id: string, activo: boolean) => {
    updateTrabajador(id, { activo: !activo });
  };

  const activos = trabajadores.filter(t => t.activo);
  const inactivos = trabajadores.filter(t => !t.activo);

  // Check if capacitación is expired (> 6 months)
  const isExpired = (fecha?: string) => {
    if (!fecha) return false;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return new Date(fecha) < sixMonthsAgo;
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
        <Link href="/fabrica/configuracion/personal" className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary">Personal</Link>
        <Link href="/fabrica/configuracion/materiales" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Materiales</Link>
      </div>

      {/* Add button */}
      {canEdit && !showForm && (
        <Button onClick={() => { resetForm(); setShowForm(true); }}>+ Agregar trabajador</Button>
      )}

      {/* Form — agregar / editar */}
      {showForm && (
        <Card className="bg-card/50 border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{editingId ? 'Editar trabajador' : 'Nuevo trabajador'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre completo *</Label>
                <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="ej: Pedro Soto" className="mt-1.5" />
              </div>
              <div>
                <Label>Última capacitación</Label>
                <Input type="date" value={fechaCapacitacion} onChange={e => setFechaCapacitacion(e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>Actividades habilitadas *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {ACTIVIDADES.map(act => (
                  <label
                    key={act.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      actividades.includes(act.value) ? 'border-primary bg-primary/5' : 'border-border/50 hover:bg-muted/20'
                    }`}
                  >
                    <Checkbox checked={actividades.includes(act.value)} onCheckedChange={() => toggleActividad(act.value)} />
                    <span className="text-sm">{act.icon} {act.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!nombre.trim() || actividades.length === 0}>
                {editingId ? 'Guardar cambios' : 'Agregar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active workers */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Personal Activo ({activos.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {activos.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No hay personal activo registrado</p>
          ) : (
            <div className="space-y-2">
              {activos.map(t => {
                const expired = isExpired(t.fecha_ultima_capacitacion);
                return (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/30">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{t.nombre}</span>
                        {expired && (
                          <Badge variant="outline" className="text-[10px] text-status-yellow border-status-yellow/30">
                            ⚠️ Cap. vencida
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {t.actividades_habilitadas.map(a => {
                          const act = ACTIVIDADES.find(ac => ac.value === a);
                          return (
                            <Badge key={a} variant="outline" className="text-[10px]">
                              {act?.icon} {act?.label || a}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right mr-2">
                        <p className="text-[10px] text-muted-foreground">Capacitación</p>
                        <p className={`text-xs font-medium ${expired ? 'text-status-yellow' : ''}`}>
                          {t.fecha_ultima_capacitacion || 'Sin registro'}
                        </p>
                      </div>
                      {canEdit && (
                        <>
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => startEdit(t.id)}>
                            ✏️
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => toggleActivo(t.id, t.activo)}>
                            Desactivar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inactive workers */}
      {inactivos.length > 0 && (
        <Card className="bg-card/50 border-border/50 opacity-70">
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">Personal Inactivo ({inactivos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inactivos.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/5 border border-border/20">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">{t.nombre}</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {t.actividades_habilitadas.map(a => {
                        const act = ACTIVIDADES.find(ac => ac.value === a);
                        return (
                          <Badge key={a} variant="outline" className="text-[10px] text-muted-foreground">
                            {act?.icon} {act?.label || a}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  {canEdit && (
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => toggleActivo(t.id, t.activo)}>
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
