'use client';

import { useState, useRef, useCallback } from 'react';
import type { DocumentoTecnico } from '@/lib/documentos-tecnicos';

interface Props {
  documento: DocumentoTecnico;
  onClose: () => void;
}

export function VisorDocumento({ documento, onClose }: Props) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const zoomIn = () => setZoom(z => Math.min(z + 0.25, 4));
  const zoomOut = () => {
    setZoom(z => {
      const next = Math.max(z - 0.25, 0.5);
      if (next <= 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  };
  const resetZoom = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, [zoom]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset(o => ({ x: o.x + dx, y: o.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  // Touch support for tablet
  const lastTouch = useRef({ x: 0, y: 0 });
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom > 1) {
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, [zoom]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom > 1) {
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setOffset(o => ({ x: o.x + dx, y: o.y + dy }));
    }
  }, [zoom]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
      {/* Barra superior */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 shrink-0">
        <span className="text-white text-sm font-medium truncate max-w-[60vw]">{documento.label}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            className="w-9 h-9 rounded-lg bg-white/10 text-white text-lg font-bold flex items-center justify-center disabled:opacity-30 hover:bg-white/20 active:bg-white/30"
          >
            −
          </button>
          <button
            onClick={resetZoom}
            className="px-3 h-9 rounded-lg bg-white/10 text-white text-xs font-mono hover:bg-white/20 active:bg-white/30"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={zoomIn}
            disabled={zoom >= 4}
            className="w-9 h-9 rounded-lg bg-white/10 text-white text-lg font-bold flex items-center justify-center disabled:opacity-30 hover:bg-white/20 active:bg-white/30"
          >
            +
          </button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:bg-white/30 text-lg"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Área del documento */}
      <div
        className="flex-1 overflow-hidden flex items-center justify-center"
        style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onMouseUp}
      >
        {documento.tipo === 'pdf' ? (
          <iframe
            src={`${documento.url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-0"
            style={{
              transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
              transformOrigin: 'center center',
              pointerEvents: zoom > 1 ? 'none' : 'auto',
            }}
            title={documento.label}
          />
        ) : (
          <img
            src={documento.url}
            alt={documento.label}
            draggable={false}
            className="max-w-none select-none"
            style={{
              transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
              transformOrigin: 'center center',
            }}
          />
        )}
      </div>

      {zoom > 1 && (
        <p className="text-center text-white/40 text-xs pb-2 shrink-0">
          Arrastra para mover
        </p>
      )}
    </div>
  );
}
