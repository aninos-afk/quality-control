'use client';

import { useRef } from 'react';
import { Label } from '@/components/ui/label';

interface PhotoUploaderProps {
  label: string;
  hint?: string;
  fotos: string[];
  onAdd: (nombres: string[]) => void;
  onRemove?: (index: number) => void;
  variant?: 'primary' | 'muted';
}

// Componente táctil para captura de fotos.
// En tablet: capture="environment" abre la cámara trasera directamente.
// En desktop: se comporta como selector de archivos normal.
// Hoy guarda nombres de archivo (modo demo). En producción se reemplaza por
// upload a storage (S3/Supabase) — la interfaz del componente no cambia.
export function PhotoUploader({ label, hint, fotos, onAdd, onRemove, variant = 'primary' }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).map(f => f.name);
    if (files.length > 0) onAdd(files);
    // Reset para permitir volver a elegir el mismo archivo
    if (inputRef.current) inputRef.current.value = '';
  };

  const triggerClass = variant === 'primary'
    ? 'border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary'
    : 'border-border/50 bg-muted/20 hover:bg-muted/40 text-muted-foreground';

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 items-center">
        <label className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg border border-dashed text-sm font-medium transition-colors ${triggerClass}`}>
          <span className="text-base">📷</span>
          <span>Tomar foto / Adjuntar</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            className="hidden"
            onChange={handleFiles}
          />
        </label>
        <span className="text-[11px] text-muted-foreground">{fotos.length} foto{fotos.length === 1 ? '' : 's'}</span>
      </div>
      {fotos.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {fotos.map((f, i) => (
            <span
              key={i}
              className="text-[11px] px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium inline-flex items-center gap-1.5"
            >
              📷 {f}
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="text-muted-foreground hover:text-status-red text-xs"
                  aria-label="Quitar foto"
                >
                  ✕
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
