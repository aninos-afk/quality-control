import type {
  Fabrica, Usuario, Molde, Trabajador, CondicionHabilitante,
  Jornada, VerificacionFabricacion, RegistroDesmolde,
  RegistroProductoTerminado, NoConformidad, AccionCorrectiva,
  EnsayoCompresion,
} from './types';

// =============================================
// FÁBRICAS
// =============================================

export const MOCK_FABRICAS: Fabrica[] = [
  { id: 'fab-tmc', nombre: 'Planta Temuco', codigo: 'TMC', direccion: 'Temuco, Región de La Araucanía', created_at: '2026-01-01' },
  { id: 'fab-prl', nombre: 'Planta Parral', codigo: 'PRL', direccion: 'Parral, Región del Maule', created_at: '2026-01-01' },
  { id: 'fab-osr', nombre: 'Planta Osorno', codigo: 'OSR', direccion: 'Osorno, Región de Los Lagos', created_at: '2026-01-01' },
];

// =============================================
// USUARIOS
// =============================================

export const MOCK_USUARIOS: Usuario[] = [
  { id: 'usr-1', fabrica_id: 'fab-tmc', nombre: 'Carlos Muñoz', rol: 'encargado_calidad', email: 'carlos@planta.cl' },
  { id: 'usr-2', fabrica_id: 'fab-tmc', nombre: 'Roberto Soto', rol: 'jefe_planta', email: 'roberto@planta.cl' },
  { id: 'usr-3', nombre: 'Andrea Villalobos', rol: 'auditor', email: 'andrea@auditoria.cl' },
  { id: 'usr-4', fabrica_id: 'fab-prl', nombre: 'Patricia Riquelme', rol: 'encargado_calidad', email: 'patricia@planta.cl' },
];

// =============================================
// MOLDES
// =============================================

export const MOCK_MOLDES: Molde[] = [
  { id: 'mol-1', fabrica_id: 'fab-tmc', numero: 'M-001', tipo_poste: '8.70-350', activo: true },
  { id: 'mol-2', fabrica_id: 'fab-tmc', numero: 'M-002', tipo_poste: '8.70-350', activo: true },
  { id: 'mol-3', fabrica_id: 'fab-tmc', numero: 'M-003', tipo_poste: '10-600', activo: true },
  { id: 'mol-4', fabrica_id: 'fab-tmc', numero: 'M-004', tipo_poste: '10-600', activo: true },
  { id: 'mol-5', fabrica_id: 'fab-tmc', numero: 'M-005', tipo_poste: '11.5-1000', activo: true },
  { id: 'mol-6', fabrica_id: 'fab-prl', numero: 'M-001', tipo_poste: '10-350', activo: true },
  { id: 'mol-7', fabrica_id: 'fab-prl', numero: 'M-002', tipo_poste: '10-600', activo: true },
];

// =============================================
// TRABAJADORES
// =============================================

export const MOCK_TRABAJADORES: Trabajador[] = [
  { id: 'trb-1', fabrica_id: 'fab-tmc', nombre: 'Juan Pérez', actividades_habilitadas: ['enfierradura', 'moldaje'], fecha_ultima_capacitacion: '2026-02-15', activo: true },
  { id: 'trb-2', fabrica_id: 'fab-tmc', nombre: 'Pedro López', actividades_habilitadas: ['moldaje', 'hormigonado'], fecha_ultima_capacitacion: '2026-01-20', activo: true },
  { id: 'trb-3', fabrica_id: 'fab-tmc', nombre: 'María González', actividades_habilitadas: ['hormigonado', 'curado'], fecha_ultima_capacitacion: '2026-03-01', activo: true },
  { id: 'trb-4', fabrica_id: 'fab-tmc', nombre: 'Luis Martínez', actividades_habilitadas: ['enfierradura'], fecha_ultima_capacitacion: '2025-06-10', activo: true },
  { id: 'trb-5', fabrica_id: 'fab-tmc', nombre: 'Diego Fernández', actividades_habilitadas: ['curado', 'moldaje'], fecha_ultima_capacitacion: '2026-02-28', activo: true },
  { id: 'trb-6', fabrica_id: 'fab-tmc', nombre: 'Ana Torres', actividades_habilitadas: ['enfierradura', 'hormigonado'], fecha_ultima_capacitacion: '2026-03-10', activo: true },
  { id: 'trb-7', fabrica_id: 'fab-tmc', nombre: 'Felipe Rojas', actividades_habilitadas: ['moldaje', 'curado'], fecha_ultima_capacitacion: '2026-01-05', activo: true },
  { id: 'trb-8', fabrica_id: 'fab-tmc', nombre: 'Sebastián Vargas', actividades_habilitadas: ['hormigonado', 'enfierradura'], fecha_ultima_capacitacion: '2026-02-20', activo: true },
];

// =============================================
// CONDICIONES HABILITANTES
// =============================================

export const MOCK_CONDICIONES: CondicionHabilitante[] = [
  { id: 'cond-1', fabrica_id: 'fab-tmc', tipo: 'certificado_mp', descripcion: 'Certificado cemento NCh 148', norma_referencia: 'NCh 148', frecuencia_descripcion: 'Semestral', fecha_emision: '2026-01-15', fecha_vencimiento: '2026-07-15', entidad_emisora: 'Cementos Bío Bío', estado: 'vigente' },
  { id: 'cond-2', fabrica_id: 'fab-tmc', tipo: 'certificado_mp', descripcion: 'Certificado áridos NCh 163/165', norma_referencia: 'NCh 163', frecuencia_descripcion: 'Anual', fecha_emision: '2025-11-10', fecha_vencimiento: '2026-11-10', entidad_emisora: 'Lab. Geotécnico Sur', estado: 'vigente' },
  { id: 'cond-3', fabrica_id: 'fab-tmc', tipo: 'certificado_mp', descripcion: 'Certificado acero NCh 204', norma_referencia: 'NCh 204', frecuencia_descripcion: 'Semestral', fecha_emision: '2025-12-01', fecha_vencimiento: '2026-06-01', entidad_emisora: 'AZA', estado: 'vigente' },
  { id: 'cond-4', fabrica_id: 'fab-tmc', tipo: 'calibracion', descripcion: 'Calibración planta hormigonera', norma_referencia: 'NCh-ISO 17025', frecuencia_descripcion: 'Anual', fecha_emision: '2025-08-20', fecha_vencimiento: '2026-08-20', entidad_emisora: 'Lab. Metrología Temuco', estado: 'vigente' },
  { id: 'cond-5', fabrica_id: 'fab-tmc', tipo: 'calibracion', descripcion: 'Calibración balanzas', norma_referencia: 'OIML R76-1', frecuencia_descripcion: 'Cada 3 años', fecha_emision: '2024-05-15', fecha_vencimiento: '2027-05-15', entidad_emisora: 'Lab. Metrología Temuco', estado: 'vigente' },
  { id: 'cond-6', fabrica_id: 'fab-tmc', tipo: 'mantencion', descripcion: 'Mantención betonera', frecuencia_descripcion: 'Trimestral', fecha_emision: '2026-01-10', fecha_vencimiento: '2026-04-10', entidad_emisora: 'Mantención interna', estado: 'por_vencer' },
  { id: 'cond-7', fabrica_id: 'fab-tmc', tipo: 'mantencion', descripcion: 'Mantención sistema de vibrado', frecuencia_descripcion: 'Semestral', fecha_emision: '2025-09-01', fecha_vencimiento: '2026-03-01', entidad_emisora: 'Mantención interna', estado: 'vencido' },
  { id: 'cond-8', fabrica_id: 'fab-tmc', tipo: 'capacitacion', descripcion: 'Capacitación personal: concreteros', frecuencia_descripcion: 'Según programa P905', fecha_emision: '2026-02-15', fecha_vencimiento: '2026-08-15', entidad_emisora: 'Empresa', estado: 'vigente' },
  { id: 'cond-9', fabrica_id: 'fab-tmc', tipo: 'mantencion', descripcion: 'Mantención moldes (base y volteo)', frecuencia_descripcion: 'Mensual', fecha_emision: '2026-03-05', fecha_vencimiento: '2026-04-05', entidad_emisora: 'Mantención interna', estado: 'por_vencer' },
  { id: 'cond-10', fabrica_id: 'fab-tmc', tipo: 'certificado_mp', descripcion: 'Certificado aditivos NCh 2182', norma_referencia: 'NCh 2182', frecuencia_descripcion: 'Cada partida', fecha_emision: '2026-03-20', fecha_vencimiento: '2026-09-20', entidad_emisora: 'Sika Chile', estado: 'vigente' },
];

// =============================================
// JORNADAS
// =============================================

export const MOCK_JORNADAS: Jornada[] = [
  {
    id: 'jrn-1', fabrica_id: 'fab-tmc', fecha: '2026-03-20', codigo: 'TMC-260320',
    tipos_poste: ['8.70-350', '10-600'], destino: 'SAESA',
    temperatura: 12, humedad_relativa: 68,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-2026-03-A', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-02', aditivo_detalle: 'Plastificante 0.5%',
    cono_abrams_mm: 15,
    operadores_enfierradura: ['trb-1'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-3'], operadores_curado: ['trb-5'],
    jefe_planta_id: 'usr-2', encargado_calidad_id: 'usr-1',
    estado: 'cerrada', alertas: [], created_at: '2026-03-20',
  },
  {
    id: 'jrn-2', fabrica_id: 'fab-tmc', fecha: '2026-03-21', codigo: 'TMC-260321',
    tipos_poste: ['10-600'], destino: 'SAESA',
    temperatura: 9, humedad_relativa: 72,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-2026-03-A', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-02', aditivo_detalle: 'Plastificante 0.5%',
    cono_abrams_mm: 14,
    operadores_enfierradura: ['trb-6'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-3'], operadores_curado: ['trb-5'],
    jefe_planta_id: 'usr-2', encargado_calidad_id: 'usr-1',
    estado: 'desmolde_registrado', alertas: [], created_at: '2026-03-21',
  },
  {
    id: 'jrn-3', fabrica_id: 'fab-tmc', fecha: '2026-03-24', codigo: 'TMC-260324',
    tipos_poste: ['8.70-350', '11.5-1000'], destino: 'SAESA',
    temperatura: 7, humedad_relativa: 80,
    medidas_proteccion: ['mantas_termicas'],
    lote_cemento: 'CB-2026-03-B', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-03', aditivo_detalle: 'Plastificante 0.5%',
    cono_abrams_mm: 16,
    operadores_enfierradura: ['trb-1', 'trb-8'], operadores_moldaje: ['trb-7'], operadores_hormigonado: ['trb-3'], operadores_curado: ['trb-5'],
    jefe_planta_id: 'usr-2', encargado_calidad_id: 'usr-1',
    estado: 'fabricacion_verificada', alertas: [], created_at: '2026-03-24',
  },
  {
    id: 'jrn-4', fabrica_id: 'fab-tmc', fecha: '2026-03-25', codigo: 'TMC-260325',
    tipos_poste: ['10-600', '13.5-1000'], destino: 'SAESA',
    temperatura: 4, humedad_relativa: 85,
    medidas_proteccion: ['aditivos', 'agua_caliente', 'mantas_termicas'],
    lote_cemento: 'CB-2026-03-B', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-03',
    cono_abrams_mm: 18,
    operadores_enfierradura: ['trb-6', 'trb-4'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-8'], operadores_curado: ['trb-3'],
    jefe_planta_id: 'usr-2', encargado_calidad_id: 'usr-1',
    estado: 'abierta',
    alertas: ['Operador Luis Martínez (enfierradura) tiene capacitación vencida (10/06/2025)'],
    created_at: '2026-03-25',
  },
  {
    id: 'jrn-5', fabrica_id: 'fab-prl', fecha: '2026-03-24', codigo: 'PRL-260324',
    tipos_poste: ['10-350', '10-600'], destino: 'otro_cliente',
    temperatura: 11, humedad_relativa: 65,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-PRL-03', partida_aridos: 'AR-PRL-Q1', lote_acero: 'AZ-PRL-02',
    cono_abrams_mm: 15,
    operadores_enfierradura: [], operadores_moldaje: [], operadores_hormigonado: [], operadores_curado: [],
    jefe_planta_id: undefined, encargado_calidad_id: 'usr-4',
    estado: 'fabricacion_verificada', alertas: [], created_at: '2026-03-24',
  },
];

// =============================================
// VERIFICACIONES
// =============================================

export const MOCK_VERIFICACIONES: VerificacionFabricacion[] = [
  {
    id: 'ver-1', jornada_id: 'jrn-1', tipo_poste: '8.70-350', molde_id: 'mol-1', codigo_elemento: 'TMC-260320-01',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme',
  },
  {
    id: 'ver-2', jornada_id: 'jrn-1', tipo_poste: '10-600', molde_id: 'mol-3', codigo_elemento: 'TMC-260320-02',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'NC', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    observaciones: 'Se detectó óxido grado C en una barra. Se realizó limpieza previa.',
    resultado: 'no_conforme',
  },
];

// =============================================
// DESMOLDES
// =============================================

export const MOCK_DESMOLDES: RegistroDesmolde[] = [
  { id: 'des-1', jornada_id: 'jrn-1', fecha: '2026-03-21', eslinga_dos_puntos: true, defectos_detectados: false },
  { id: 'des-2', jornada_id: 'jrn-2', fecha: '2026-03-22', eslinga_dos_puntos: true, defectos_detectados: true, observaciones: '1 poste con despunte menor en base' },
];

// =============================================
// PRODUCTO TERMINADO
// =============================================

export const MOCK_PRODUCTO_TERMINADO: RegistroProductoTerminado[] = [
  {
    id: 'pt-1', jornada_id: 'jrn-1', fecha: '2026-03-24', metodo_curado: 'membrana_cavecur',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true,
  },
];

// =============================================
// NO CONFORMIDADES
// =============================================

export const MOCK_NC: NoConformidad[] = [
  {
    id: 'nc-1', fabrica_id: 'fab-tmc', numero: 'TMC-2026-001', jornada_id: 'jrn-1',
    fecha_deteccion: '2026-03-20', origen: 'verificacion_fabricacion', tipo_poste: '10-600',
    molde_id: 'mol-3', tipo_defecto: 'otro', detalle: 'Óxido grado C detectado en barra de refuerzo',
    accion_inmediata: 'Limpieza manual de la barra', disposicion: 'liberar_concesion', apto_saesa: true,
    estado: 'cerrada', fecha_cierre: '2026-03-20',
  },
  {
    id: 'nc-2', fabrica_id: 'fab-tmc', numero: 'TMC-2026-002', jornada_id: 'jrn-2',
    fecha_deteccion: '2026-03-22', origen: 'desmolde', tipo_poste: '10-600',
    molde_id: 'mol-4', tipo_defecto: 'despunte_desprendimiento', detalle: 'Despunte menor en base del poste',
    accion_inmediata: 'Segregación del poste', disposicion: 'reparar', apto_saesa: false,
    estado: 'abierta',
  },
  {
    id: 'nc-3', fabrica_id: 'fab-tmc', numero: 'TMC-2026-003',
    fecha_deteccion: '2026-03-23', origen: 'manual', tipo_defecto: 'fisura_superficial',
    detalle: 'Fisura superficial detectada en poste de stock', ancho_fisura_mm: 0.15,
    disposicion: 'liberar_concesion', apto_saesa: true,
    estado: 'abierta',
  },
];

// =============================================
// ACCIONES CORRECTIVAS
// =============================================

export const MOCK_AC: AccionCorrectiva[] = [];

// =============================================
// ENSAYOS DE COMPRESIÓN
// =============================================

export const MOCK_ENSAYOS: EnsayoCompresion[] = [
  { id: 'ens-1', fabrica_id: 'fab-tmc', jornada_id: 'jrn-1', fecha_muestra: '2026-02-15', tipo_hormigon: 'H-35', resultado_7d_mpa: 22.5, resultado_28d_mpa: 33.2, laboratorio: 'Lab. Materiales Temuco', cumple: true },
  { id: 'ens-2', fabrica_id: 'fab-tmc', fecha_muestra: '2026-01-20', tipo_hormigon: 'H-35', resultado_7d_mpa: 21.0, resultado_28d_mpa: 31.8, laboratorio: 'Lab. Materiales Temuco', cumple: true },
  { id: 'ens-3', fabrica_id: 'fab-tmc', fecha_muestra: '2025-12-15', tipo_hormigon: 'H-35', resultado_7d_mpa: 20.3, resultado_28d_mpa: 30.1, laboratorio: 'Lab. Materiales Temuco', cumple: true },
  { id: 'ens-4', fabrica_id: 'fab-tmc', fecha_muestra: '2025-11-18', tipo_hormigon: 'H-35', resultado_7d_mpa: 19.8, resultado_28d_mpa: 28.5, laboratorio: 'Lab. Materiales Temuco', cumple: true },
  { id: 'ens-5', fabrica_id: 'fab-prl', fecha_muestra: '2026-02-28', tipo_hormigon: 'H-30', resultado_7d_mpa: 18.2, resultado_28d_mpa: 27.0, laboratorio: 'Lab. Materiales Linares', cumple: true },
];
