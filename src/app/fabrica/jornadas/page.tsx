'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { EstadoJornadaBadge } from '@/components/estado-badge';
import { JornadaCalendar } from '@/components/jornada-calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DESTINOS_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type ViewMode = 'calendario' | 'lista';

export default function JornadasPage() {
  const router = useRouter();
  const { currentFabricaId, getJornadasByFabrica } = useApp();
  const jornadas = getJornadasByFabrica(currentFabricaId).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const [view, setView] = useState<ViewMode>('calendario');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plan de Inspección</h1>
          <p className="text-muted-foreground text-sm mt-1">{jornadas.length} inspecciones registradas</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border border-border/50 overflow-hidden">
            <button
              onClick={() => setView('calendario')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium transition-colors',
                view === 'calendario' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/30'
              )}
            >
              📅 Calendario
            </button>
            <button
              onClick={() => setView('lista')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium transition-colors',
                view === 'lista' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/30'
              )}
            >
              📋 Lista
            </button>
          </div>
          <Link href="/fabrica/jornadas/nueva">
            <Button>+ Nueva jornada</Button>
          </Link>
        </div>
      </div>

      {view === 'calendario' ? (
        <JornadaCalendar
          jornadas={jornadas}
          onDayClick={(jornada) => router.push(`/fabrica/jornadas/${jornada.id}`)}
        />
      ) : (
        <div className="space-y-3">
          {jornadas.map(j => (
            <Link key={j.id} href={`/fabrica/jornadas/${j.id}`}>
              <Card className="bg-card/50 border-border/50 hover:bg-muted/20 transition-all duration-200 cursor-pointer mb-3">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg">📅</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold">{j.codigo}</span>
                          <EstadoJornadaBadge estado={j.estado} />
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{j.fecha}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{DESTINOS_LABELS[j.destino]}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{j.tipos_poste.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-muted-foreground text-sm">→</span>
                  </div>
                  {j.alertas && j.alertas.length > 0 && (
                    <div className="mt-3 px-3 py-2 rounded-lg bg-status-yellow/10 border border-status-yellow/20">
                      <p className="text-xs text-status-yellow">{j.alertas[0]}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
