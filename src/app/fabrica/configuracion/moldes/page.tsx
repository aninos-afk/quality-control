'use client';

import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MoldesPage() {
  const { currentFabricaId, getMoldesByFabrica } = useApp();
  const moldes = getMoldesByFabrica(currentFabricaId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground text-sm mt-1">Moldes y personal de la planta</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/50 pb-2">
        <a href="/fabrica/configuracion/moldes" className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary">Moldes</a>
        <a href="/fabrica/configuracion/personal" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Personal</a>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-base">Moldes Registrados ({moldes.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {moldes.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/30">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold">{m.numero}</span>
                  {m.tipo_poste && <Badge variant="outline" className="text-[10px]">{m.tipo_poste}</Badge>}
                </div>
                <Badge variant="outline" className={m.activo ? 'text-status-green border-status-green/30 text-[10px]' : 'text-muted-foreground text-[10px]'}>
                  {m.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
