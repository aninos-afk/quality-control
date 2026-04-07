'use client';

import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { EstadoNCBadge, EstadoJornadaBadge } from '@/components/estado-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TIPOS_DEFECTO, DISPOSICIONES_PNC } from '@/lib/constants';
import Link from 'next/link';

export default function NoConformidadesPage() {
  const { planta } = useAuth();
  const { getNCByPlanta, getJornadasByPlanta, productoTerminado } = useApp();
  const plantaId = planta?.id || '';
  const ncs = getNCByPlanta(plantaId).sort((a, b) => b.fecha_deteccion.localeCompare(a.fecha_deteccion));
  const ncAbiertas = ncs.filter(nc => nc.estado === 'abierta');
  const ncCerradas = ncs.filter(nc => nc.estado === 'cerrada');

  // Jornadas con hallazgos pendientes de revision (PT con nc_detectadas o resultado no_conforme, jornada no cerrada)
  const jornadasPlanta = getJornadasByPlanta(plantaId);
  const jornadasPendientes = jornadasPlanta
    .filter(j => j.estado === 'producto_terminado')
    .filter(j => {
      const pt = productoTerminado.find(p => p.jornada_id === j.id);
      return pt && (pt.nc_detectadas || pt.resultado === 'no_conforme');
    })
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const origenLabels: Record<string, string> = {
    verificacion_fabricacion: 'Verificacion',
    desmolde: 'Desmolde',
    producto_terminado: 'Producto terminado',
    manual: 'Manual',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">No Conformidades</h1>
        <p className="text-muted-foreground text-sm mt-1">{ncAbiertas.length} abiertas - {ncCerradas.length} cerradas</p>
      </div>

      {/* Summary */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-red/10 border border-status-red/20">
          <span className="text-sm font-bold text-status-red">{ncAbiertas.length}</span>
          <span className="text-xs text-status-red">Abiertas</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-green/10 border border-status-green/20">
          <span className="text-sm font-bold text-status-green">{ncCerradas.length}</span>
          <span className="text-xs text-status-green">Cerradas</span>
        </div>
        {jornadasPendientes.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-yellow/10 border border-status-yellow/20">
            <span className="text-sm font-bold text-status-yellow">{jornadasPendientes.length}</span>
            <span className="text-xs text-status-yellow">Pendientes de revision</span>
          </div>
        )}
      </div>

      {/* Pendientes de revision - jornadas flaggeadas por patio */}
      {jornadasPendientes.length > 0 && (
        <>
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="text-status-yellow">&#9888;&#65039;</span> Pendientes de revision
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Jornadas con hallazgos reportados por el encargado de patio que requieren su revision.
              Puede crear una NC formal o liberar directamente si no amerita.
            </p>
          </div>

          <div className="space-y-3">
            {jornadasPendientes.map(j => {
              const pt = productoTerminado.find(p => p.jornada_id === j.id);
              return (
                <Link key={j.id} href={`/fabrica/jornadas/${j.id}`}>
                  <Card className="bg-status-yellow/5 border-status-yellow/20 hover:bg-status-yellow/10 transition-all duration-200 cursor-pointer mb-3">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold">{j.codigo}</span>
                            <EstadoJornadaBadge estado={j.estado} />
                            {pt?.resultado === 'no_conforme' && (
                              <Badge variant="outline" className="bg-status-red/10 text-status-red border-status-red/20 text-[10px]">
                                Puntos NC
                              </Badge>
                            )}
                            {pt?.nc_detectadas && (
                              <Badge variant="outline" className="bg-status-yellow/10 text-status-yellow border-status-yellow/20 text-[10px]">
                                Requiere revision
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{j.fecha} - {j.tipos_poste.join(', ')}</p>
                          {pt?.observaciones && (
                            <p className="text-xs text-foreground/70 italic">"{pt.observaciones}"</p>
                          )}
                        </div>
                        <Button variant="outline" size="sm">Revisar</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <Separator />
        </>
      )}

      {/* NC formales */}
      {ncs.length > 0 && (
        <h2 className="text-lg font-semibold">No Conformidades formales</h2>
      )}
      <div className="space-y-3">
        {ncs.map(nc => {
          const tipoLabel = TIPOS_DEFECTO.find(t => t.value === nc.tipo_defecto)?.label || nc.tipo_defecto;
          const dispLabel = nc.disposicion ? DISPOSICIONES_PNC.find(d => d.value === nc.disposicion)?.label : 'Sin disposicion';

          return (
            <Card key={nc.id} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{nc.numero}</span>
                      <EstadoNCBadge estado={nc.estado} />
                      <Badge variant="outline" className="text-[10px]">{origenLabels[nc.origen]}</Badge>
                    </div>
                    <p className="text-sm">{tipoLabel}</p>
                    {nc.detalle && <p className="text-xs text-muted-foreground">{nc.detalle}</p>}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{nc.fecha_deteccion}</span>
                      {nc.tipo_poste && <span>Poste: {nc.tipo_poste}</span>}
                      {nc.ancho_fisura_mm && <span>Fisura: {nc.ancho_fisura_mm} mm</span>}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs text-muted-foreground">{dispLabel}</p>
                    {nc.apto_saesa !== undefined && (
                      <Badge variant="outline" className={nc.apto_saesa ? 'bg-status-green/10 text-status-green border-status-green/20 text-[10px]' : 'bg-status-red/10 text-status-red border-status-red/20 text-[10px]'}>
                        {nc.apto_saesa ? 'Apto SAESA' : 'NO APTO SAESA'}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {ncs.length === 0 && jornadasPendientes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Sin registros</p>
          <p className="text-sm mt-1">No hay No Conformidades ni hallazgos pendientes en esta planta.</p>
        </div>
      )}
    </div>
  );
}
