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

export type EstadoNC = 'abierta' | 'cerrada';

export type EstadoAC = 'abierta' | 'en_ejecucion' | 'cerrada' | 'verificada_eficaz' | 'verificada_no_eficaz';

export type MedidaProteccion = 'aditivos' | 'agua_caliente' | 'mantas_termicas' | 'ninguna_requerida';

export type MetodoCurado = 'membrana_cavecur' | 'riego_manual' | 'aspersion' | 'mantas_termicas_riego';

export type RolUsuario = 'encargado_calidad' | 'jefe_planta' | 'auditor' | 'admin';

// =============================================
// ENTITIES
// =============================================

export interface Fabrica {
  id: string;
  nombre: string;
  codigo: string;
  direccion?: string;
  created_at: string;
}

export interface Usuario {
  id: string;
  fabrica_id?: string;
  nombre: string;
  rol: RolUsuario;
  email: string;
}

export interface Molde {
  id: string;
  fabrica_id: string;
  numero: string;
  tipo_poste?: TipoPoste;
  activo: boolean;
}

export interface Trabajador {
  id: string;
  fabrica_id: string;
  nombre: string;
  actividades_habilitadas: string[];
  fecha_ultima_capacitacion?: string;
  comprobante_url?: string;
  activo: boolean;
}

export interface CondicionHabilitante {
  id: string;
  fabrica_id: string;
  tipo: TipoCondicion;
  descripcion: string;
  norma_referencia?: string;
  frecuencia_descripcion?: string;
  fecha_emision?: string;
  fecha_vencimiento?: string;
  entidad_emisora?: string;
  documento_url?: string;
  estado: EstadoCondicion;
}

export interface Jornada {
  id: string;
  fabrica_id: string;
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
  cono_abrams_mm?: number;
  operadores_enfierradura: string[];
  operadores_moldaje: string[];
  operadores_hormigonado: string[];
  operadores_curado: string[];
  jefe_planta_id?: string;
  encargado_calidad_id?: string;
  estado: EstadoJornada;
  alertas?: string[];
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
}

export interface RegistroDesmolde {
  id: string;
  jornada_id: string;
  fecha: string;
  eslinga_dos_puntos: boolean;
  defectos_detectados: boolean;
  observaciones?: string;
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
}

export interface NoConformidad {
  id: string;
  fabrica_id: string;
  numero: string;
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
}

export interface AccionCorrectiva {
  id: string;
  fabrica_id: string;
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
  fabrica_id: string;
  jornada_id?: string;
  fecha_muestra: string;
  tipo_hormigon?: string;
  resultado_7d_mpa?: number;
  resultado_28d_mpa?: number;
  laboratorio?: string;
  certificado_url?: string;
  cumple?: boolean;
  observaciones?: string;
}
