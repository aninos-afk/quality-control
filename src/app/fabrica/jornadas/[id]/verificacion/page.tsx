'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { PUNTOS_ARMADURA, PUNTOS_MOLDAJE, PUNTOS_HORMIGONADO } from '@/lib/constants';
import type { PuntoVerificacion, VerificacionFabricacion } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

type PuntoButton = { value: PuntoVerificacion; label: string; color: string; activeColor: string };
const PUNTO_BUTTONS: PuntoButton[] = [
  { value: 'C', label: 'C', color: 'border-status-green/30 text-status-green hover:bg-status-green/10', activeColor: 'bg-status-green text-white border-status-green' },
  { value: 'NC', label: 'NC', color: 'border-status-red/30 text-status-red hover:bg-status-red/10', activeColor: 'bg-status-red text-white border-status-red' },
  { value: 'NA', label: 'NA', color: 'border-muted-foreground/30 text-muted-foreground hover:bg-muted/30', activeColor: 'bg-muted text-foreground border-muted' },
];

export default function VerificacionPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { user, planta } = useAuth();
  const { getJornada, getMoldesByPlanta, addVerificacion, updateJornada } = useApp();
  const jornada = getJornada(id);
  const moldes = getMoldesByPlanta(planta?.id || '');

  const [activeTab, setActiveTab] = useState(0);
  const [forms, setForms] = useState<Record<string, Record<string, PuntoVerificacion>>>(() => {
    const initial: Record<string, Record<string, PuntoVerificacion>> = {};
    jornada?.tipos_poste.forEach(tp => {
      initial[tp] = {};
      [...PUNTOS_ARMADURA, ...PUNTOS_MOLDAJE, ...PUNTOS_HORMIGONADO].forEach(p => {
        initial[tp][p.id] = null;
      });
    });
    return initial;
  });
  const [observations, setObservations] = useState<Record<string, string>>({});

  if (!jornada) return <div className="text-center py-20 text-muted-foreground">Jornada no encontrada</div>;

  const currentTipo = jornada.tipos_poste[activeTab];
  const currentForm = forms[currentTipo] || {};

  const setPunto = (puntoId: string, value: PuntoVerificacion) => {
    setForms(prev => ({
      ...prev,
      [currentTipo]: { ...prev[currentTipo], [puntoId]: value },
    }));
  };

  const allCompleted = Object.values(currentForm).every(v => v !== null);
  const hasNC = Object.values(currentForm).some(v => v === 'NC');

  const handleSave = () => {
    // Solo registra el resultado como dato histórico del proceso.
    // Los puntos NC son correcciones en proceso; no escalan automáticamente a NC formal.
    jornada!.tipos_poste.forEach((tp, idx) => {
      const form = forms[tp];
      const resultado = Object.values(form).some(v => v === 'NC') ? 'no_conforme' : 'conforme';
      const verificacion: VerificacionFabricacion = {
        id: `ver-new-${Date.now()}-${idx}`,
        jornada_id: id,
        tipo_poste: tp,
        ...Object.fromEntries(Object.entries(form)),
        observaciones: observations[tp] || undefined,
        resultado,
        created_by: user?.id,
      } as VerificacionFabricacion;
      addVerificacion(verificacion);
    });

    updateJornada(id, { estado: 'fabricacion_verificada' });
    router.push(`/fabrica/jornadas/${id}`);
  };

  const sections = [
    { title: 'Armadura', points: PUNTOS_ARMADURA, bg: '' },
    { title: 'Moldaje', points: PUNTOS_MOLDAJE, bg: 'bg-muted/10' },
    { title: 'Hormigonado', points: PUNTOS_HORMIGONADO, bg: '' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Verificación de Fabricación</h1>
          <p className="text-muted-foreground text-sm mt-1">Jornada {jornada.codigo} — 20 puntos de verificación</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>← Volver</Button>
      </div>

      {/* Tab selector for postes */}
      {jornada.tipos_poste.length > 1 && (
        <div className="flex gap-2">
          {jornada.tipos_poste.map((tp, idx) => (
            <button
              key={tp}
              onClick={() => setActiveTab(idx)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                activeTab === idx
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card/50 border-border/50 hover:bg-muted/30'
              )}
            >
              Poste {tp}
            </button>
          ))}
        </div>
      )}

      {/* Verification points */}
      {sections.map((section) => (
        <Card key={section.title} className={`bg-card/50 border-border/50 ${section.bg}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{section.title} ({section.points.length} puntos)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {section.points.map((punto, idx) => (
              <div key={punto.id} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted/10">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs text-muted-foreground w-5 text-right shrink-0">{idx + 1}.</span>
                  <span className="text-sm">{punto.texto}</span>
                </div>
                <div className="flex gap-1.5 shrink-0 ml-4">
                  {PUNTO_BUTTONS.map(btn => (
                    <button
                      key={btn.value}
                      onClick={() => setPunto(punto.id, btn.value)}
                      className={cn(
                        'w-11 h-11 rounded-lg border text-sm font-bold transition-all duration-200',
                        currentForm[punto.id] === btn.value ? btn.activeColor : btn.color
                      )}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Result and observations */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 space-y-4">
          {allCompleted && (
            <div className={cn(
              'p-3 rounded-lg text-sm font-medium',
              hasNC ? 'bg-status-red/10 text-status-red border border-status-red/20' : 'bg-status-green/10 text-status-green border border-status-green/20'
            )}>
              Resultado: {hasNC ? '❌ No Conforme' : '✅ Conforme'}
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Observaciones</label>
            <Textarea
              className="mt-1.5"
              placeholder="Observaciones adicionales..."
              value={observations[currentTipo] || ''}
              onChange={e => setObservations(prev => ({ ...prev, [currentTipo]: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!allCompleted} size="lg">
          Guardar verificación
        </Button>
      </div>
    </div>
  );
}
