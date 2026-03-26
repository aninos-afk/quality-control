'use client';

import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Semaforo } from '@/components/semaforo';
import { StatCard } from '@/components/stat-card';
import Link from 'next/link';

export default function FabricasAuditorPage() {
  const { fabricas } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fábricas</h1>
        <p className="text-muted-foreground text-sm mt-1">{fabricas.length} fábricas registradas</p>
      </div>

      <div className="space-y-3">
        {fabricas.map(fab => (
          <Link key={fab.id} href={`/auditor/fabricas/${fab.id}`}>
            <Card className="bg-card/50 border-border/50 hover:bg-muted/20 transition-all cursor-pointer mb-3">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl">🏭</div>
                    <div>
                      <h3 className="font-semibold">{fab.nombre}</h3>
                      <p className="text-xs text-muted-foreground">{fab.codigo} — {fab.direccion}</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
