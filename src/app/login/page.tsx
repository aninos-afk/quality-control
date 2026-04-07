'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { MOCK_USUARIOS } from '@/lib/mock-data';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small delay for UX feel
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        const foundUser = MOCK_USUARIOS.find(u => u.email.toLowerCase() === email.toLowerCase());
        const dest = foundUser?.rol === 'auditor_plataforma' || foundUser?.rol === 'auditor_externo'
          ? '/auditor'
          : foundUser?.rol === 'encargado_patio'
            ? '/fabrica/jornadas'
            : '/fabrica';
        router.push(dest);
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Calidad</h1>
          <p className="text-muted-foreground text-sm">
            Sistema de gestión y trazabilidad de producción
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Iniciar sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@empresa.cl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo info */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Modo demostración.</span>{' '}
            Use cualquiera de los siguientes correos con contraseña <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs font-mono">demo1234</code>:
          </p>
        <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <p><span className="text-foreground font-medium">Auditor Externo:</span> alejandro@madlan.cl</p>
            <p><span className="text-foreground font-medium">Enc. Calidad:</span> sebastian@hormisur.cl</p>
            <p><span className="text-foreground font-medium">Jefe Planta:</span> claudio@hormisur.cl</p>
            <p><span className="text-foreground font-medium">Enc. Patio:</span> juan@hormisur.cl</p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/60">
          Sistema de gestión y trazabilidad de producción
        </p>
      </div>
    </div>
  );
}
