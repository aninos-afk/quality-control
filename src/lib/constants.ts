import type { TipoPoste, TipoDefecto, DisposicionPNC, MedidaProteccion, MetodoCurado, TipoCondicion } from './types';

// =============================================
// PUNTOS DE VERIFICACIÓN (Doc 03 §8.2)
// =============================================

export const PUNTOS_ARMADURA = [
  { id: 'arm_diametro_cantidades', texto: 'Diámetro y cantidades de fierros de refuerzo según plano' },
  { id: 'arm_fierros_segun_plano', texto: 'La armadura presenta todos los fierros que indica el plano' },
  { id: 'arm_dimensiones_fierros', texto: 'Verifica las dimensiones de los fierros que indica el plano' },
  { id: 'arm_distanciamiento_estribos', texto: 'Se respeta el distanciamiento entre estribos' },
  { id: 'arm_union_alambres', texto: 'Los elementos están unidos por alambres' },
  { id: 'arm_sin_oxido', texto: 'Los elementos no presentan óxido en grado inaceptable' },
  { id: 'arm_ducto_puesta_tierra', texto: 'La armadura cuenta con ducto de puesta a tierra' },
] as const;

export const PUNTOS_MOLDAJE = [
  { id: 'mol_pernos_candados', texto: 'El molde presenta todos los pernos, candados, bujes y pasadores' },
  { id: 'mol_apuntalamiento', texto: 'Verifica el apuntalamiento del molde' },
  { id: 'mol_estanqueidad', texto: 'Cumple con la estanqueidad requerida' },
  { id: 'mol_alineamiento', texto: 'Verifica el alineamiento interno' },
  { id: 'mol_limpieza', texto: 'Se encuentra limpio de elementos externos' },
  { id: 'mol_desmoldante', texto: 'Presenta desmoldante en todas sus paredes' },
] as const;

export const PUNTOS_HORMIGONADO = [
  { id: 'hor_equipos_vibrado', texto: 'Se presentan equipos de vibrado e izaje en buen estado' },
  { id: 'hor_armadura_completa', texto: 'La armadura presenta todos los elementos que indica el plano' },
  { id: 'hor_recubrimiento', texto: 'Se respeta el recubrimiento con separadores y/o alambre' },
  { id: 'hor_bordes_llenado', texto: 'Se hormigona respetando bordes de llenado del molde' },
  { id: 'hor_marcas_bajorrelieve', texto: 'Se agregan marcas bajo relieve' },
  { id: 'hor_retiro_bujes', texto: 'Se quitan bujes cuando el hormigón alcanza la resistencia' },
  { id: 'hor_membrana_curado', texto: 'Se aplica membrana de curado' },
] as const;

export const PUNTOS_PRODUCTO_TERMINADO = [
  { id: 'pt_sin_hallazgos_estructurales', texto: 'El poste se presenta sin hallazgos estructurales o de serviciabilidad' },
  { id: 'pt_marcas_bajorrelieve', texto: 'Presenta marcas bajo relieve en la posición que corresponde' },
  { id: 'pt_eslinga_tenazas', texto: 'Se utiliza eslinga y dos tenazas o estrobos para transportar' },
  { id: 'pt_acopio_listones', texto: 'El acopio se encuentra con listones alineados en la misma vertical' },
  { id: 'pt_acopio_sin_hallazgos', texto: 'El poste en acopio final se encuentra sin hallazgos' },
  { id: 'pt_pintado', texto: 'El poste se encuentra pintado según requerimiento' },
] as const;

// =============================================
// CATÁLOGOS
// =============================================

export const TIPOS_POSTE: { value: TipoPoste; label: string }[] = [
  { value: '8.70-350', label: '8,70 m — 350 kg' },
  { value: '10-350', label: '10 m — 350 kg' },
  { value: '10-600', label: '10 m — 600 kg' },
  { value: '11.5-600', label: '11,5 m — 600 kg' },
  { value: '11.5-1000', label: '11,5 m — 1000 kg' },
  { value: '13.5-1000', label: '13,5 m — 1000 kg' },
  { value: '15-1300', label: '15 m — 1300 kg' },
];

export const TIPOS_DEFECTO: { value: TipoDefecto; label: string }[] = [
  { value: 'fisura_superficial', label: 'Fisura superficial (retracción)' },
  { value: 'fisura_flexion', label: 'Fisura de flexión' },
  { value: 'despunte_desprendimiento', label: 'Despunte / desprendimiento' },
  { value: 'nido', label: 'Nido' },
  { value: 'ducto_tapado', label: 'Ducto tapado' },
  { value: 'perforacion_tapada', label: 'Perforación tapada' },
  { value: 'otro', label: 'Otro' },
];

export const DISPOSICIONES_PNC: { value: DisposicionPNC; label: string }[] = [
  { value: 'liberar_concesion', label: 'Liberar por concesión' },
  { value: 'reparar', label: 'Reparar' },
  { value: 'reciclar', label: 'Reciclar' },
  { value: 'eliminar', label: 'Eliminar' },
];

export const MEDIDAS_PROTECCION: { value: MedidaProteccion; label: string }[] = [
  { value: 'aditivos', label: 'Aditivos utilizados' },
  { value: 'agua_caliente', label: 'Agua caliente' },
  { value: 'mantas_termicas', label: 'Mantas térmicas' },
  { value: 'ninguna_requerida', label: 'Ninguna requerida' },
];

export const METODOS_CURADO: { value: MetodoCurado; label: string }[] = [
  { value: 'membrana_cavecur', label: 'Membrana Cavecur' },
  { value: 'riego_manual', label: 'Riego manual' },
  { value: 'aspersion', label: 'Aspersión' },
  { value: 'mantas_termicas_riego', label: 'Mantas térmicas y riego' },
];

export const TIPOS_CONDICION: { value: TipoCondicion; label: string }[] = [
  { value: 'certificado_mp', label: 'Certificado materia prima' },
  { value: 'calibracion', label: 'Calibración' },
  { value: 'mantencion', label: 'Mantención' },
  { value: 'capacitacion', label: 'Capacitación' },
];

export const ACTIVIDADES = ['enfierradura', 'moldaje', 'hormigonado', 'curado'] as const;

export const ESTADOS_JORNADA_LABELS: Record<string, string> = {
  abierta: 'Abierta',
  fabricacion_verificada: 'Fabricación verificada',
  desmolde_registrado: 'Desmolde registrado',
  producto_terminado: 'Producto terminado',
  cerrada: 'Cerrada',
};

export const DESTINOS_LABELS: Record<string, string> = {
  SAESA: 'SAESA',
  otro_cliente: 'Otro cliente',
  stock: 'Stock',
};
