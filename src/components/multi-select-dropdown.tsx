'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Checkbox } from '@/components/ui/checkbox';

interface Option {
  id: string;
  label: string;
  warning?: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  openUp: boolean;
}

export function MultiSelectDropdown({ options, selected, onChange, placeholder = 'Seleccionar...' }: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on scroll (reposition would be complex, simpler to close)
  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener('scroll', handler, true);
    return () => window.removeEventListener('scroll', handler, true);
  }, [open]);

  // Calculate position when opening
  const handleToggle = useCallback(() => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = Math.min(options.length * 40 + 8, 240); // estimate height
      const openUp = spaceBelow < dropdownHeight + 8;

      setPosition({
        top: openUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        openUp,
      });
    }
    setOpen(!open);
  }, [open, options.length]);

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };

  const selectedLabels = selected
    .map(id => options.find(o => o.id === id)?.label)
    .filter(Boolean);

  const displayText = selectedLabels.length === 0
    ? placeholder
    : selectedLabels.length <= 2
      ? selectedLabels.join(', ')
      : `${selectedLabels.slice(0, 2).join(', ')} +${selectedLabels.length - 2}`;

  return (
    <div ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`w-full h-10 rounded-md border bg-background px-3 text-sm text-left flex items-center justify-between transition-colors ${
          open ? 'border-primary ring-1 ring-primary/30' : 'border-input hover:border-primary/50'
        }`}
      >
        <span className={selected.length === 0 ? 'text-muted-foreground' : ''}>
          {displayText}
        </span>
        <span className="text-muted-foreground text-xs ml-2">{open ? '▲' : '▼'}</span>
      </button>

      {open && position && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width,
            zIndex: 9999,
          }}
          className="rounded-md border border-border bg-popover shadow-xl max-h-60 overflow-y-auto"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {options.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">Sin personal habilitado</p>
          ) : (
            options.map(opt => (
              <label
                key={opt.id}
                className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selected.includes(opt.id)}
                  onCheckedChange={() => toggle(opt.id)}
                />
                <span className="text-sm flex-1">{opt.label}</span>
                {opt.warning && (
                  <span className="text-[10px] text-status-yellow shrink-0">⚠️</span>
                )}
              </label>
            ))
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
