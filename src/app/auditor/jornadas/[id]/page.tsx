'use client';

import { useApp } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { use } from 'react';

// ─── Helpers ────────────────────────────────────────────
function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${y}`;
}

const MEDIDAS_LABEL: Record<string, string> = {
  ninguna_requerida: 'Ninguna requerida',
  aditivos: 'Aditivos acelerantes',
  agua_caliente: 'Agua caliente',
  mantas_termicas: 'Mantas térmicas',
  calefaccion: 'Calefacción',
};

const CURADO_LABEL: Record<string, string> = {
  membrana_cavecur: 'Membrana Cavecut',
  riego_manual: 'Riego manual',
  aspersion: 'Aspersión',
  mantas_termicas_riego: 'Mantas térmicas + riego',
};

function Divider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mt-8 mb-4">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</span>
      <div className="flex-1 h-px bg-border/50" />
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-border/20 last:border-0 gap-4">
      <span className="text-xs text-muted-foreground shrink-0 w-44">{label}</span>
      <span className={`text-xs font-medium text-right ${highlight ? 'text-status-green' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}

// ─── Ficha Component ─────────────────────────────────────
export default function FichaTrazabilidad({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {
    jornadas, verificaciones, desmoldes, productoTerminado,
    ensayos, usuarios, plantas, empresas, materiales,
  } = useApp();
  const router = useRouter();

  const jornada = jornadas.find(j => j.id === id);

  // Guard: no existe o no es visible
  if (!jornada) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-3">
        <p className="text-4xl">🔒</p>
        <h2 className="text-lg font-semibold">Documento no disponible</h2>
        <p className="text-sm text-muted-foreground">Este registro no existe o no está publicado.</p>
        <button onClick={() => router.back()} className="text-xs text-primary hover:underline">← Volver al portal</button>
      </div>
    );
  }

  if (!jornada.visible_externo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-3">
        <p className="text-4xl">🔒</p>
        <h2 className="text-lg font-semibold">Registro confidencial</h2>
        <p className="text-sm text-muted-foreground">La fábrica no ha publicado este registro para revisión externa.</p>
        <button onClick={() => router.back()} className="text-xs text-primary hover:underline">← Volver al portal</button>
      </div>
    );
  }

  // Data lookup
  const planta = plantas.find(p => p.id === jornada.planta_id);
  const empresa = empresas.find(e => e.id === planta?.empresa_id);
  const jefePlanta = usuarios.find(u => u.id === jornada.jefe_planta_id);
  const encCalidad = usuarios.find(u => u.id === jornada.encargado_calidad_id);
  const verifs = verificaciones.filter(v => v.jornada_id === id);
  const desmolde = desmoldes.find(d => d.jornada_id === id);
  const pt = productoTerminado.find(p => p.jornada_id === id);
  const ensayo = ensayos.find(e => e.jornada_id === id);
  const materialesPlanta = materiales.filter(m => m.planta_id === jornada.planta_id && m.activo);

  const nConforme = verifs.filter(v => v.resultado === 'conforme').length;
  const nTotal = verifs.length;

  return (
    <div className="max-w-3xl mx-auto space-y-2">

      {/* Back */}
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2">
        ← Volver al portal
      </button>

      {/* Header premium */}
      <div className="rounded-2xl overflow-hidden border border-border/40">
        <div className="bg-gradient-to-r from-primary/25 to-primary/5 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Ficha de Trazabilidad</p>
              <h1 className="text-xl font-bold">Producción de Postes de Hormigón Armado</h1>
              <p className="text-sm text-muted-foreground mt-1">{empresa?.nombre} — {planta?.nombre}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-lg font-bold text-foreground">{jornada.codigo}</p>
              <p className="text-xs text-muted-foreground">{formatDate(jornada.fecha)}</p>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-status-green/15 text-status-green font-semibold uppercase tracking-wide">
                Producto Liberado
              </span>
            </div>
          </div>
        </div>

        {/* Postes producidos */}
        <div className="bg-card/60 px-6 py-4 border-t border-border/30 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground mr-2">Tipos de poste:</span>
          {jornada.tipos_poste.map(t => (
            <span key={t} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
              🏗 {t}
            </span>
          ))}
          {jornada.destino && (
            <span className="ml-auto text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium">
              Destino: {jornada.destino}
            </span>
          )}
        </div>
      </div>

      {/* Datos de producción */}
      <Card className="bg-card/60 border-border/40">
        <CardContent className="px-6 py-4">
          <Divider title="Datos de Producción" />
          <Row label="Temperatura ambiente" value={`${jornada.temperatura}°C`} />
          <Row label="Humedad relativa" value={`${jornada.humedad_relativa}%`} />
          <Row label="Cono de Abrams" value={`${jornada.cono_abrams_mm} mm`} />
          {jornada.medidas_proteccion?.length > 0 && (
            <Row
              label="Medidas de protección"
              value={jornada.medidas_proteccion.map(m => MEDIDAS_LABEL[m] || m).join(', ')}
            />
          )}
          {jornada.aditivo_detalle && (
            <Row label="Aditivo" value={jornada.aditivo_detalle} />
          )}
        </CardContent>
      </Card>

      {/* Materiales */}
      <Card className="bg-card/60 border-border/40">
        <CardContent className="px-6 py-4">
          <Divider title="Materiales Utilizados" />
          <Row label="Lote cemento" value={jornada.lote_cemento || '—'} />
          <Row label="Partida áridos" value={jornada.partida_aridos || '—'} />
          <Row label="Lote acero" value={jornada.lote_acero || '—'} />

          {/* Certificados activos */}
          {materialesPlanta.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground mt-4 mb-2">Materiales activos certificados en planta</p>
              <div className="space-y-1">
                {materialesPlanta.slice(0, 4).map(mat => (
                  <div key={mat.id} className="flex items-center justify-between text-xs py-1.5 border-b border-border/15 last:border-0">
                    <span className="capitalize text-muted-foreground">{mat.tipo}</span>
                    <span className="font-medium">{mat.proveedor}</span>
                    <span className="font-mono text-muted-foreground">{mat.codigo_lote}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Control de calidad */}
      <Card className="bg-card/60 border-border/40">
        <CardContent className="px-6 py-4">
          <Divider title="Control de Calidad" />

          {/* Inspección fabricación */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium">Inspección de fabricación</p>
              {nTotal > 0 ? (
                <span className={`text-xs font-semibold ${nConforme === nTotal ? 'text-status-green' : 'text-status-amber'}`}>
                  {nConforme}/{nTotal} conformes
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Sin registros</span>
              )}
            </div>
            {nTotal > 0 && (
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${nConforme === nTotal ? 'bg-status-green' : 'bg-status-amber'}`}
                  style={{ width: `${(nConforme / nTotal) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Desmolde */}
          {desmolde && (
            <Row
              label="Desmolde"
              value={`${formatDate(desmolde.fecha)} · ${desmolde.defectos_detectados ? 'Defectos detectados' : 'Sin defectos'} · Eslingado: ${desmolde.eslinga_dos_puntos ? 'Correcto' : 'No registrado'}`}
              highlight={!desmolde.defectos_detectados}
            />
          )}

          {/* Producto terminado */}
          {pt && (
            <>
              <Row
                label="Producto terminado"
                value={`${formatDate(pt.fecha)} · ${pt.resultado === 'conforme' ? 'Conforme ✅' : 'No conforme ❌'}`}
                highlight={pt.resultado === 'conforme'}
              />
              {pt.metodo_curado && (
                <Row label="Método de curado" value={CURADO_LABEL[pt.metodo_curado] || pt.metodo_curado} />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Ensayo de compresión */}
      {ensayo && (
        <Card className={`border-2 ${ensayo.cumple ? 'border-status-green/30 bg-status-green/5' : 'border-status-red/30 bg-status-red/5'}`}>
          <CardContent className="px-6 py-4">
            <Divider title="Ensayo de Compresión" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              <div className="text-center p-3 rounded-xl bg-card/60">
                <p className="text-xs text-muted-foreground mb-1">Tipo hormigón</p>
                <p className="text-lg font-bold">{ensayo.tipo_hormigon}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-card/60">
                <p className="text-xs text-muted-foreground mb-1">7 días</p>
                <p className="text-lg font-bold">{ensayo.resultado_7d_mpa} <span className="text-xs font-normal">MPa</span></p>
              </div>
              <div className={`text-center p-3 rounded-xl ${ensayo.cumple ? 'bg-status-green/15' : 'bg-status-red/15'}`}>
                <p className="text-xs text-muted-foreground mb-1">28 días</p>
                <p className="text-lg font-bold">{ensayo.resultado_28d_mpa} <span className="text-xs font-normal">MPa</span></p>
              </div>
              <div className="text-center p-3 rounded-xl bg-card/60">
                <p className="text-xs text-muted-foreground mb-1">Resultado</p>
                <p className={`text-base font-bold ${ensayo.cumple ? 'text-status-green' : 'text-status-red'}`}>
                  {ensayo.cumple ? '✅ Cumple' : '❌ No cumple'}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Muestra: {formatDate(ensayo.fecha_muestra)} · Laboratorio: {ensayo.laboratorio}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Responsables */}
      <Card className="bg-card/60 border-border/40">
        <CardContent className="px-6 py-4">
          <Divider title="Responsables" />
          {jefePlanta && <Row label="Jefe de Planta" value={jefePlanta.nombre} />}
          {encCalidad && <Row label="Encargado de Calidad" value={encCalidad.nombre} />}
          <Row label="Fecha de cierre" value={formatDate(jornada.created_at)} />
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground py-4">
        <p>Documento generado por el Sistema de Gestión de Calidad | Grupo SAESA</p>
        <p className="mt-0.5">Este documento acredita la trazabilidad del proceso de fabricación según registros internos auditados.</p>
      </div>

    </div>
  );
}
