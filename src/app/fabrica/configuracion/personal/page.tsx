'use client';

import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PersonalPage() {
  const { currentFabricaId, getTrabajadoresByFabrica } = useApp();
  const trabajadores = getTrabajadoresByFabrica(currentFabricaId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground text-sm mt-1">Moldes y personal de la planta</p>
      </div>

      <div className="flex gap-2 border-b border-border/50 pb-2">
        <a href="/fabrica/configuracion/moldes" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Moldes</a>
        <a href="/fabrica/configuracion/personal" className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary">Personal</a>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-base">Personal Registrado ({trabajadores.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {trabajadores.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/30">
                <div className="space-y-1">
                  <span className="text-sm font-medium">{t.nombre}</span>
                  <div className="flex gap-1.5">
                    {t.actividades_habilitadas.map(a => (
                      <Badge key={a} variant="outline" className="text-[10px] capitalize">{a}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Última capacitación</p>
                  <p className="text-xs font-medium">{t.fecha_ultima_capacitacion || 'Sin registro'}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
