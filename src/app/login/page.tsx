'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/lib/store';
import type { RolUsuario } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useApp();
  const [selected, setSelected] = useState<RolUsuario | null>(null);

  const handleLogin = () => {
    if (!selected) return;
    setRole(selected);
    router.push(selected === 'auditor' ? '/auditor' : '/fabrica');
  };

  const roles: { value: RolUsuario; label: string; icon: string; desc: string }[] = [
    { value: 'encargado_calidad', label: 'Encargado de Calidad', icon: '🔬', desc: 'Registro de verificaciones, condiciones y no conformidades' },
    { value: 'jefe_planta', label: 'Jefe de Planta', icon: '🏭', desc: 'Confirmación de jornadas y liberación de producto' },
    { value: 'auditor', label: 'Auditor', icon: '🔍', desc: 'Vista consolidada de todas las fábricas e indicadores' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Control de Calidad</h1>
          <p className="text-muted-foreground text-sm">
            Sistema de monitoreo continuo — Postes de hormigón armado
          </p>
        </div>

        {/* Info notice */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Modo demostración.</span>{' '}
            En la versión final, el acceso será mediante usuario y contraseña, que determinará 
            automáticamente el rol asignado: <span className="text-foreground">Encargado de Calidad</span>, <span className="text-foreground">Jefe de Planta</span> o <span className="text-foreground">Auditor</span>.
            En esta etapa, selecciona un rol para explorar el funcionamiento general del sistema.
          </p>
        </div>

        {/* Role Selection */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Selecciona tu rol</CardTitle>
            <CardDescription>
              Elige cómo quieres acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => setSelected(role.value)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  selected === role.value
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                    : 'border-border/50 hover:border-border hover:bg-muted/30'
                }`}
              >
                <span className="text-2xl mt-0.5">{role.icon}</span>
                <div>
                  <div className="font-medium">{role.label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{role.desc}</div>
                </div>
              </button>
            ))}

            <Button
              className="w-full mt-4 h-12 text-base font-semibold"
              size="lg"
              disabled={!selected}
              onClick={handleLogin}
            >
              Ingresar al sistema
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground/60">
          Plataforma de trazabilidad y calidad
        </p>
      </div>
    </div>
  );
}
