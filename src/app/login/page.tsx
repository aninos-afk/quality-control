'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { MOCK_USUARIOS } from '@/lib/mock-data';
import Image from 'next/image';

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
    <div className="min-h-screen flex relative overflow-hidden">

      {/* ── LEFT PANEL — Brand ── */}
      <div className="hidden lg:flex lg:w-[60%] relative flex-col justify-between p-14"
        style={{ background: 'linear-gradient(160deg, #080F1D 0%, #0C1A30 40%, #112240 100%)' }}
      >
        {/* Accent line top */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, #C9A84C, #E8C860, #C9A84C)' }} />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }} />

        {/* Soft radial glows */}
        <div className="absolute top-[15%] right-[10%] w-[400px] h-[400px] opacity-[0.04] rounded-full" style={{ background: 'radial-gradient(circle, #C9A84C, transparent 70%)' }} />
        <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] opacity-[0.03] rounded-full" style={{ background: 'radial-gradient(circle, #3B82F6, transparent 70%)' }} />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Image
            src="/grupo-saesa.png"
            alt="Grupo SAESA"
            width={280}
            height={84}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>

        {/* Center: Main messaging */}
        <div className="relative z-10 space-y-6 -mt-10">
          <div className="w-12 h-[2px] rounded-full" style={{ backgroundColor: '#C9A84C' }} />
          <h1 className="text-[2.6rem] font-bold leading-[1.15] tracking-tight text-white">
            Sistema de Gestión<br />
            <span className="text-white/60">y Trazabilidad</span>
          </h1>
          <p className="text-base text-white/35 leading-relaxed max-w-md">
            Control de calidad certificado para la producción<br />
            de postes de hormigón armado
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Trazabilidad', 'Multi-planta', 'Ensayos', 'Alertas', 'Expedientes'].map((feat) => (
              <span
                key={feat}
                className="text-[10px] font-medium px-3 py-1.5 rounded-full border text-white/40"
                style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }}
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom: Info */}
        <div className="relative z-10 flex items-center justify-between">
          <p className="text-[10px] text-white/20 tracking-wider uppercase">
            Programa de Calidad · 2026
          </p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#C9A84C' }} />
            <span className="text-[10px] text-white/30">Sistema activo</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Login ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-xs space-y-6">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-2">
            <div className="rounded-xl px-4 py-3" style={{ backgroundColor: '#0C1A30' }}>
              <Image src="/grupo-saesa.png" alt="Grupo SAESA" width={160} height={48} className="h-9 w-auto object-contain" priority />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Iniciar sesión</h2>
            <p className="text-xs text-muted-foreground">Ingrese sus credenciales</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-medium text-muted-foreground">Correo</label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.cl"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[11px] font-medium text-muted-foreground">Contraseña</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-10 text-sm"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-10 text-sm font-medium rounded-lg"
              style={{ backgroundColor: '#112240', color: 'white' }}
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>

          {/* Demo hint */}
          <div className="pt-2 border-t border-border/30">
            <p className="text-[10px] text-muted-foreground mb-2">
              Demo — contraseña: <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono">demo1234</code>
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
              <p><span className="text-foreground font-medium">Auditor:</span> alejandro@madlan.cl</p>
              <p><span className="text-foreground font-medium">Calidad:</span> sebastian@hormisur.cl</p>
              <p><span className="text-foreground font-medium">Jefe Planta:</span> claudio@hormisur.cl</p>
              <p><span className="text-foreground font-medium">Patio:</span> juan@hormisur.cl</p>
            </div>
          </div>

          <p className="text-center text-[9px] text-muted-foreground/40">
            © 2026 Grupo SAESA
          </p>
        </div>
      </div>
    </div>
  );
}
