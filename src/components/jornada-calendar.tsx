'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { Jornada, EstadoJornada } from '@/lib/types';
import { ESTADOS_JORNADA_LABELS } from '@/lib/constants';

interface JornadaCalendarProps {
  jornadas: Jornada[];
  usuarios?: { id: string; nombre: string; rol: string }[];
  onDayClick?: (jornada: Jornada) => void;
  canToggleVisibility?: boolean;
  onToggleVisibility?: (jornadaId: string, nuevoEstado: boolean) => void;
  jornadasConHallazgos?: Set<string>;
}

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const estadoColors: Record<EstadoJornada, { bg: string; dot: string; border: string }> = {
  abierta: { bg: 'bg-status-blue/15', dot: 'bg-status-blue', border: 'border-status-blue/30' },
  fabricacion_verificada: { bg: 'bg-status-yellow/15', dot: 'bg-status-yellow', border: 'border-status-yellow/30' },
  desmolde_registrado: { bg: 'bg-[oklch(0.7_0.15_30)]/15', dot: 'bg-[oklch(0.7_0.15_30)]', border: 'border-[oklch(0.7_0.15_30)]/30' },
  producto_terminado: { bg: 'bg-status-green/15', dot: 'bg-status-green', border: 'border-status-green/30' },
  cerrada: { bg: 'bg-status-green/20', dot: 'bg-status-green', border: 'border-status-green/40' },
};

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
}

export function JornadaCalendar({ jornadas, usuarios, onDayClick, canToggleVisibility, onToggleVisibility, jornadasConHallazgos }: JornadaCalendarProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const jornadaMap = useMemo(() => {
    const map = new Map<string, Jornada>();
    jornadas.forEach(j => map.set(j.fecha, j));
    return map;
  }, [jornadas]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = getMonday(firstDay);
    const days: { date: Date; inMonth: boolean }[] = [];

    const current = new Date(startDate);
    // Fill calendar grid (always 6 weeks to maintain consistent height)
    for (let i = 0; i < 42; i++) {
      days.push({
        date: new Date(current),
        inMonth: current.getMonth() === month,
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [year, month]);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };
  const goToday = () => { setYear(new Date().getFullYear()); setMonth(new Date().getMonth()); };

  const today = new Date().toISOString().slice(0, 10);

  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">{MESES[month]} {year}</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center hover:bg-muted/30 transition-colors text-sm">←</button>
          <button onClick={goToday} className="px-3 h-8 rounded-lg border border-border/50 flex items-center justify-center hover:bg-muted/30 transition-colors text-xs font-medium">Hoy</button>
          <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center hover:bg-muted/30 transition-colors text-sm">→</button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30">
        {/* Day names header */}
        <div className="grid grid-cols-7 border-b border-border/30">
          {DIAS_SEMANA.map(dia => (
            <div key={dia} className="py-2 text-center text-xs font-medium text-muted-foreground">
              {dia}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dateStr = day.date.toISOString().slice(0, 10);
            const jornada = jornadaMap.get(dateStr);
            const isToday = dateStr === today;
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
            const colors = jornada ? estadoColors[jornada.estado] : null;

            return (
              <div
                key={idx}
                className={cn(
                  'relative min-h-[72px] p-1.5 border-b border-r border-border/15 transition-all duration-150',
                  !day.inMonth && 'opacity-30',
                  isWeekend && 'bg-muted/5',
                  jornada && day.inMonth && 'cursor-pointer hover:bg-muted/20',
                  isToday && 'ring-1 ring-inset ring-primary/40',
                )}
                onClick={() => jornada && day.inMonth && onDayClick?.(jornada)}
                onMouseEnter={() => jornada && day.inMonth && setHoveredDay(dateStr)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Date number */}
                <div className={cn(
                  'text-xs font-medium mb-1',
                  isToday ? 'text-primary font-bold' : day.inMonth ? 'text-foreground/80' : 'text-foreground/30',
                )}>
                  {day.date.getDate()}
                </div>

                {/* Jornada indicator */}
                {jornada && day.inMonth && colors && (
                  <div className={cn('rounded-md px-1.5 py-1 border', colors.bg, colors.border)}>
                    <div className="flex items-center gap-1">
                      <span className={cn('w-2 h-2 rounded-full shrink-0', colors.dot)} />
                      <span className="text-[10px] font-medium truncate flex-1">{jornada.codigo}</span>
                      {/* Hallazgos pendientes indicator */}
                      {jornadasConHallazgos?.has(jornada.id) && (
                        <span className="shrink-0 text-[9px] leading-none text-status-yellow" title="Hallazgos pendientes de revisión">⚠️</span>
                      )}
                      {/* Visibility icon for cerrada jornadas */}
                      {jornada.estado === 'cerrada' && canToggleVisibility && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleVisibility?.(jornada.id, !jornada.visible_externo);
                          }}
                          className={cn(
                            'shrink-0 w-4 h-4 flex items-center justify-center rounded transition-all text-[9px] leading-none',
                            jornada.visible_externo
                              ? 'text-status-blue hover:text-status-blue/70'
                              : 'text-muted-foreground/50 hover:text-foreground/70'
                          )}
                          title={jornada.visible_externo ? 'Visible al auditor — click para ocultar' : 'Solo interno — click para publicar'}
                        >
                          {jornada.visible_externo ? '👁️' : '🔒'}
                        </button>
                      )}
                      {/* Read-only icon when user can't toggle */}
                      {jornada.estado === 'cerrada' && !canToggleVisibility && (
                        <span className={cn(
                          'shrink-0 text-[9px] leading-none',
                          jornada.visible_externo ? 'text-status-blue' : 'text-muted-foreground/40'
                        )}>
                          {jornada.visible_externo ? '👁️' : '🔒'}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tooltip on hover */}
                {hoveredDay === dateStr && jornada && day.inMonth && (
                  <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-1 w-52 p-3 rounded-lg bg-popover border border-border/50 shadow-xl text-xs space-y-1.5 pointer-events-none">
                    <div className="font-semibold">{jornada.codigo}</div>
                    <div className="flex items-center gap-1.5">
                      <span className={cn('w-2 h-2 rounded-full', colors!.dot)} />
                      <span>{ESTADOS_JORNADA_LABELS[jornada.estado]}</span>
                    </div>
                    <div className="text-muted-foreground">Destino: {jornada.destino}</div>
                    <div className="text-muted-foreground">Tipos: {jornada.tipos_poste.join(', ')}</div>
                    {jornada.temperatura && <div className="text-muted-foreground">{jornada.temperatura}°C · {jornada.humedad_relativa}% HR</div>}
                    {jornada.estado === 'cerrada' && (
                      <div className={cn(
                        'flex items-center gap-1 pt-1 border-t border-border/30 mt-1',
                        jornada.visible_externo ? 'text-status-blue' : 'text-muted-foreground'
                      )}>
                        <span>{jornada.visible_externo ? '👁️' : '🔒'}</span>
                        <span>{jornada.visible_externo ? 'Visible al auditor externo' : 'Solo uso interno'}</span>
                      </div>
                    )}
                    {jornada.created_by && usuarios && (() => {
                      const u = usuarios.find(u => u.id === jornada.created_by);
                      return u ? (
                        <div className="text-muted-foreground/50 italic pt-0.5">por {u.nombre}</div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        {Object.entries(estadoColors).map(([estado, colors]) => (
          <div key={estado} className="flex items-center gap-1.5">
            <span className={cn('w-2.5 h-2.5 rounded-full', colors.dot)} />
            <span className="text-muted-foreground">{ESTADOS_JORNADA_LABELS[estado]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
