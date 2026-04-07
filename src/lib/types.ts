// =============================================
// ENUMS
// =============================================

export type TipoPoste = '8.70-350' | '10-350' | '10-600' | '11.5-600' | '11.5-1000' | '13.5-1000' | '15-1300';

export type DestinoProduccion = 'SAESA' | 'otro_cliente' | 'stock';

export type EstadoJornada = 'abierta' | 'fabricacion_verificada' | 'desmolde_registrado' | 'producto_terminado' | 'cerrada';

export type PuntoVerificacion = 'C' | 'NC' | 'NA' | null;

export type ResultadoVerificacion = 'conforme' | 'no_conforme';

export type TipoDefecto = 'fisura_superficial' | 'fisura_flexion' | 'despunte_desprendimiento' | 'nido' | 'ducto_tapado' | 'perforacion_tapada' | 'otro';

export type DisposicionPNC = 'liberar_concesion' | 'reparar' | 'reciclar' | 'eliminar';

export type EstadoCondicion = 'vigente' | 'por_vencer' | 'vencido';

export type TipoCondicion = 'certificado_mp' | 'calibracion' | 'mantencion' | 'capacitacion';

export type OrigenNC = 'verificacion_fabricacion' | 'desmolde' | 'producto_terminado' | 'manual';

export type NivelNC = 'proceso' | 'producto';

export type EstadoNC = 'abierta' | 'cerrada';

export type EstadoAC = 'abierta' | 'en_ejecucion' | 'cerrada' | 'verificada_eficaz' | 'verificada_no_eficaz';

export type MedidaProteccion = 'aditivos' | 'agua_caliente' | 'mantas_termicas' | 'ninguna_requerida';

export type MetodoCurado = 'membrana_cavecur' | 'riego_manual' | 'aspersion' | 'mantas_termicas_riego';

export type RolUsuario = 'auditor_plataforma' | 'auditor_externo' | 'encargado_calidad' | 'jefe_planta' | 'encargado_patio';

export type TipoMaterial = 'cemento' | 'aridos' | 'acero' | 'aditivo';

// =============================================
// PLATFORM ENTITIES
// =============================================

export interface Empresa {
  id: string;
  nombre: string;
  slug: string;
  rut?: string;
  contacto?: string;
  created_at: string;
}

export interface Planta {
  id: string;
  empresa_id: string;
  nombre: string;
  codigo: string;
  direccion?: string;
  created_at: string;
}

export interface Usuario {
  id: string;
  empresa_id?: string;       // undefined for auditor (cross-company)
  planta_id?: string;         // undefined for enc_calidad (cross-plant) and auditor
  nombre: string;
  rol: RolUsuario;
  email: string;
  password: string;           // plain text for demo mode
}

// =============================================
// OPERATIONAL ENTITIES
// =============================================

export interface Molde {
  id: string;
  planta_id: string;
  numero: string;
  tipo_poste?: TipoPoste;
  activo: boolean;
}

export interface MaterialActivo {
  id: string;
  planta_id: string;
  tipo: TipoMaterial;
  codigo_lote: string;
  proveedor?: string;
  descripcion?: string;
  fecha_recepcion?: string;
  certificado_id?: string;       // link a CondicionHabilitante
  activo: boolean;
  created_by: string;
  created_at: string;
}

export interface Trabajador {
  id: string;
  planta_id: string;
  nombre: string;
  actividades_habilitadas: string[];
  fecha_ultima_capacitacion?: string;
  comprobante_url?: string;
  activo: boolean;
}

export interface CondicionHabilitante {
  id: string;
  planta_id: string;
  tipo: TipoCondicion;
  descripcion: string;
  norma_referencia?: string;
  frecuencia_descripcion?: string;
  fecha_emision?: string;
  fecha_vencimiento?: string;
  entidad_emisora?: string;
  documento_url?: string;
  estado: EstadoCondicion;
  created_by?: string;        // user id
  created_at?: string;
}

export interface Jornada {
  id: string;
  planta_id: string;
  fecha: string;
  codigo: string;
  tipos_poste: TipoPoste[];
  destino: DestinoProduccion;
  temperatura?: number;
  humedad_relativa?: number;
  medidas_proteccion: MedidaProteccion[];
  lote_cemento?: string;
  partida_aridos?: string;
  lote_acero?: string;
  aditivo_detalle?: string;
  // IDs de MaterialActivo seleccionados
  material_cemento_id?: string;
  material_aridos_id?: string;
  material_acero_id?: string;
  material_aditivo_id?: string;
  cono_abrams_mm?: number;
  operadores_enfierradura: string[];
  operadores_moldaje: string[];
  operadores_hormigonado: string[];
  operadores_curado: string[];
  jefe_planta_id?: string;
  encargado_calidad_id?: string;
  estado: EstadoJornada;
  alertas?: string[];
  visible_externo?: boolean;  // Fábrica controla si esta jornada es visible al auditor externo
  created_by?: string;
  created_at: string;
}

export interface VerificacionFabricacion {
  id: string;
  jornada_id: string;
  tipo_poste: TipoPoste;
  molde_id?: string;
  codigo_elemento?: string;
  // Armadura (7)
  arm_diametro_cantidades: PuntoVerificacion;
  arm_fierros_segun_plano: PuntoVerificacion;
  arm_dimensiones_fierros: PuntoVerificacion;
  arm_distanciamiento_estribos: PuntoVerificacion;
  arm_union_alambres: PuntoVerificacion;
  arm_sin_oxido: PuntoVerificacion;
  arm_ducto_puesta_tierra: PuntoVerificacion;
  // Moldaje (6)
  mol_pernos_candados: PuntoVerificacion;
  mol_apuntalamiento: PuntoVerificacion;
  mol_estanqueidad: PuntoVerificacion;
  mol_alineamiento: PuntoVerificacion;
  mol_limpieza: PuntoVerificacion;
  mol_desmoldante: PuntoVerificacion;
  // Hormigonado (7)
  hor_equipos_vibrado: PuntoVerificacion;
  hor_armadura_completa: PuntoVerificacion;
  hor_recubrimiento: PuntoVerificacion;
  hor_bordes_llenado: PuntoVerificacion;
  hor_marcas_bajorrelieve: PuntoVerificacion;
  hor_retiro_bujes: PuntoVerificacion;
  hor_membrana_curado: PuntoVerificacion;
  observaciones?: string;
  resultado?: ResultadoVerificacion;
  created_by?: string;
}

export interface RegistroDesmolde {
  id: string;
  jornada_id: string;
  fecha: string;
  eslinga_dos_puntos: boolean;
  defectos_detectados: boolean;
  observaciones?: string;
  created_by?: string;
}

export interface RegistroProductoTerminado {
  id: string;
  jornada_id: string;
  fecha: string;
  metodo_curado?: MetodoCurado;
  pt_sin_hallazgos_estructurales: PuntoVerificacion;
  pt_marcas_bajorrelieve: PuntoVerificacion;
  pt_eslinga_tenazas: PuntoVerificacion;
  pt_acopio_listones: PuntoVerificacion;
  pt_acopio_sin_hallazgos: PuntoVerificacion;
  pt_pintado: PuntoVerificacion;
  observaciones?: string;
  resultado?: ResultadoVerificacion;
  nc_detectadas: boolean;
  liberacion_confirmada: boolean;
  created_by?: string;
}

export interface NoConformidad {
  id: string;
  planta_id: string;
  numero: string;
  nivel: NivelNC;
  jornada_id?: string;
  fecha_deteccion: string;
  origen: OrigenNC;
  tipo_poste?: TipoPoste;
  molde_id?: string;
  tipo_defecto: TipoDefecto;
  detalle?: string;
  ancho_fisura_mm?: number;
  accion_inmediata?: string;
  disposicion?: DisposicionPNC;
  apto_saesa?: boolean;
  estado: EstadoNC;
  fecha_cierre?: string;
  created_by?: string;
}

export interface AccionCorrectiva {
  id: string;
  planta_id: string;
  numero: string;
  descripcion: string;
  analisis_causa?: string;
  plan_accion?: string;
  responsable_id?: string;
  plazo_ejecucion?: string;
  plazo_verificacion?: string;
  resultado_verificacion?: string;
  estado: EstadoAC;
  nc_vinculadas: string[];
}

export interface EnsayoCompresion {
  id: string;
  planta_id: string;
  jornada_id?: string;
  fecha_muestra: string;
  tipo_hormigon?: string;
  resultado_7d_mpa?: number;
  resultado_28d_mpa?: number;
  laboratorio?: string;
  certificado_url?: string;
  cumple?: boolean;
  observaciones?: string;
  created_by?: string;
}

// =============================================
// AUDIT & OBSERVATIONS
// =============================================

export interface AuditLogEntry {
  id: string;
  usuario_id: string;
  usuario_nombre: string;
  rol: RolUsuario;
  empresa_id?: string;
  planta_id?: string;
  accion: string;
  modulo: string;
  detalle?: string;
  fecha: string;
  hora: string;
}

export interface ObservacionAuditor {
  id: string;
  auditor_id: string;
  empresa_id: string;
  planta_id?: string;
  entidad_tipo: 'condicion' | 'nc' | 'planta' | 'informe' | 'general';
  entidad_id?: string;
  texto: string;
  fecha: string;
  hora: string;
}

// =============================================
// FABRICA_ID COMPATIBILITY (legacy → planta_id)
// =============================================
// All entities now use planta_id instead of fabrica_id.
// The old Fabrica type is replaced by Empresa + Planta.
