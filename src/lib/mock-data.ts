import type {
  Empresa, Planta, Usuario, Molde, Trabajador, CondicionHabilitante,
  Jornada, VerificacionFabricacion, RegistroDesmolde,
  RegistroProductoTerminado, NoConformidad, AccionCorrectiva,
  EnsayoCompresion, MaterialActivo,
} from './types';

// =============================================
// EMPRESAS
// =============================================

export const MOCK_EMPRESAS: Empresa[] = [
  { id: 'emp-hormisur', nombre: 'HORMISUR', slug: 'hormisur', rut: '76.123.456-7', contacto: 'contacto@hormisur.cl', created_at: '2026-01-01' },
  { id: 'emp-hormibal', nombre: 'HORMIBAL', slug: 'hormibal', rut: '76.234.567-8', contacto: 'contacto@hormibal.cl', created_at: '2026-01-01' },
  { id: 'emp-horval', nombre: 'HORVAL', slug: 'horval', rut: '76.345.678-9', contacto: 'contacto@horval.cl', created_at: '2026-01-01' },
  { id: 'emp-hornor', nombre: 'HORNOR', slug: 'hornor', rut: '76.456.789-0', contacto: 'contacto@hornor.cl', created_at: '2026-01-01' },
  { id: 'emp-facoro', nombre: 'FACORO', slug: 'facoro', rut: '76.567.890-1', contacto: 'contacto@facoro.cl', created_at: '2026-01-01' },
  { id: 'emp-racsol', nombre: 'RACSOL', slug: 'racsol', rut: '76.678.901-2', contacto: 'contacto@racsol.cl', created_at: '2026-01-01' },
];

// =============================================
// PLANTAS
// =============================================

export const MOCK_PLANTAS: Planta[] = [
  // HORMISUR — 3 plants
  { id: 'plt-tmc', empresa_id: 'emp-hormisur', nombre: 'Planta Temuco', codigo: 'TMC', direccion: 'Temuco, Región de La Araucanía', created_at: '2026-01-01' },
  { id: 'plt-prl', empresa_id: 'emp-hormisur', nombre: 'Planta Parral', codigo: 'PRL', direccion: 'Parral, Región del Maule', created_at: '2026-01-01' },
  { id: 'plt-osr', empresa_id: 'emp-hormisur', nombre: 'Planta Osorno', codigo: 'OSR', direccion: 'Osorno, Región de Los Lagos', created_at: '2026-01-01' },
  // HORMIBAL — 2 plants
  { id: 'plt-hbl', empresa_id: 'emp-hormibal', nombre: 'Planta Los Ángeles', codigo: 'HBL', direccion: 'Los Ángeles, Región del Biobío', created_at: '2026-01-01' },
  { id: 'plt-frt', empresa_id: 'emp-hormibal', nombre: 'Planta Frutillar', codigo: 'FRT', direccion: 'Frutillar, Región de Los Lagos', created_at: '2026-01-01' },
  // HORVAL — 1 plant
  { id: 'plt-hvl', empresa_id: 'emp-horval', nombre: 'Planta Valdivia', codigo: 'HVL', direccion: 'Valdivia, Región de Los Ríos', created_at: '2026-01-01' },
  // HORNOR — 1 plant
  { id: 'plt-hnr', empresa_id: 'emp-hornor', nombre: 'Planta Coronel', codigo: 'HNR', direccion: 'Coronel, Región del Biobío', created_at: '2026-01-01' },
  // FACORO — 2 plants
  { id: 'plt-fco', empresa_id: 'emp-facoro', nombre: 'Planta Angol', codigo: 'FCO', direccion: 'Angol, Región de La Araucanía', created_at: '2026-01-01' },
  { id: 'plt-fpa', empresa_id: 'emp-facoro', nombre: 'Planta Puerto Varas', codigo: 'FPA', direccion: 'Puerto Varas, Región de Los Lagos', created_at: '2026-01-01' },
  // RACSOL — 1 plant
  { id: 'plt-rcl', empresa_id: 'emp-racsol', nombre: 'Planta Coyhaique', codigo: 'RCL', direccion: 'Coyhaique, Región de Aysén', created_at: '2026-01-01' },
];

// =============================================
// USUARIOS
// =============================================

export const MOCK_USUARIOS: Usuario[] = [
  // === USUARIOS OCULTOS (no aparecen en pantalla demo) ===
  // Administrador de plataforma — credenciales privadas, no mostrar al cliente
  { id: 'usr-plataforma', nombre: 'Administrador Sistema', rol: 'auditor_plataforma', email: 'sys.admin@qcaudit.internal', password: 'Qc#Syst3m2026!' },

  // === USUARIOS DEMO (visibles en pantalla de login) ===
  // Auditor externo (mandante / SAESA)
  { id: 'usr-auditor-ext', nombre: 'Alejandro Madlan', rol: 'auditor_externo', email: 'alejandro@madlan.cl', password: 'demo1234' },
  { id: 'usr-hs-ec', empresa_id: 'emp-hormisur', nombre: 'Sebastián Ramos', rol: 'encargado_calidad', email: 'sebastian@hormisur.cl', password: 'demo1234' },
  { id: 'usr-hs-jp1', empresa_id: 'emp-hormisur', planta_id: 'plt-tmc', nombre: 'Claudio Soto', rol: 'jefe_planta', email: 'claudio@hormisur.cl', password: 'demo1234' },
  { id: 'usr-hs-ep1', empresa_id: 'emp-hormisur', planta_id: 'plt-tmc', nombre: 'Juan Pérez', rol: 'encargado_patio', email: 'juan@hormisur.cl', password: 'demo1234' },
  { id: 'usr-hs-jp2', empresa_id: 'emp-hormisur', planta_id: 'plt-prl', nombre: 'Patricia Riquelme', rol: 'jefe_planta', email: 'patricia@hormisur.cl', password: 'demo1234' },
  { id: 'usr-hs-jp3', empresa_id: 'emp-hormisur', planta_id: 'plt-osr', nombre: 'Marcelo Díaz', rol: 'jefe_planta', email: 'marcelo@hormisur.cl', password: 'demo1234' },

  // HORMIBAL
  { id: 'usr-hb-ec', empresa_id: 'emp-hormibal', nombre: 'Andrea Villalobos', rol: 'encargado_calidad', email: 'andrea@hormibal.cl', password: 'demo1234' },
  { id: 'usr-hb-jp1', empresa_id: 'emp-hormibal', planta_id: 'plt-hbl', nombre: 'Luis Martínez', rol: 'jefe_planta', email: 'luis@hormibal.cl', password: 'demo1234' },
  { id: 'usr-hb-ep1', empresa_id: 'emp-hormibal', planta_id: 'plt-hbl', nombre: 'Felipe Rojas', rol: 'encargado_patio', email: 'felipe@hormibal.cl', password: 'demo1234' },
  { id: 'usr-hb-jp2', empresa_id: 'emp-hormibal', planta_id: 'plt-frt', nombre: 'Raúl Cifuentes', rol: 'jefe_planta', email: 'raul@hormibal.cl', password: 'demo1234' },
  { id: 'usr-hb-ep2', empresa_id: 'emp-hormibal', planta_id: 'plt-frt', nombre: 'Hugo Carrasco', rol: 'encargado_patio', email: 'hugo@hormibal.cl', password: 'demo1234' },

  // HORVAL
  { id: 'usr-hv-ec', empresa_id: 'emp-horval', nombre: 'María González', rol: 'encargado_calidad', email: 'maria@horval.cl', password: 'demo1234' },
  { id: 'usr-hv-jp1', empresa_id: 'emp-horval', planta_id: 'plt-hvl', nombre: 'Diego Fernández', rol: 'jefe_planta', email: 'diego@horval.cl', password: 'demo1234' },
  { id: 'usr-hv-ep1', empresa_id: 'emp-horval', planta_id: 'plt-hvl', nombre: 'Tomás Reyes', rol: 'encargado_patio', email: 'tomas@horval.cl', password: 'demo1234' },

  // HORNOR
  { id: 'usr-hn-ec', empresa_id: 'emp-hornor', nombre: 'Sofía Cárdenas', rol: 'encargado_calidad', email: 'sofia@hornor.cl', password: 'demo1234' },
  { id: 'usr-hn-jp1', empresa_id: 'emp-hornor', planta_id: 'plt-hnr', nombre: 'Andrés Figueroa', rol: 'jefe_planta', email: 'andres@hornor.cl', password: 'demo1234' },
  { id: 'usr-hn-ep1', empresa_id: 'emp-hornor', planta_id: 'plt-hnr', nombre: 'Mauricio Lagos', rol: 'encargado_patio', email: 'mauricio@hornor.cl', password: 'demo1234' },

  // FACORO
  { id: 'usr-fc-ec', empresa_id: 'emp-facoro', nombre: 'Claudia Sepúlveda', rol: 'encargado_calidad', email: 'claudia@facoro.cl', password: 'demo1234' },
  { id: 'usr-fc-jp1', empresa_id: 'emp-facoro', planta_id: 'plt-fco', nombre: 'Pedro López', rol: 'jefe_planta', email: 'pedro@facoro.cl', password: 'demo1234' },
  { id: 'usr-fc-ep1', empresa_id: 'emp-facoro', planta_id: 'plt-fco', nombre: 'Ana Torres', rol: 'encargado_patio', email: 'ana@facoro.cl', password: 'demo1234' },
  { id: 'usr-fc-jp2', empresa_id: 'emp-facoro', planta_id: 'plt-fpa', nombre: 'Fernando Sandoval', rol: 'jefe_planta', email: 'fernando@facoro.cl', password: 'demo1234' },
  { id: 'usr-fc-ep2', empresa_id: 'emp-facoro', planta_id: 'plt-fpa', nombre: 'Lorena Bustos', rol: 'encargado_patio', email: 'lorena@facoro.cl', password: 'demo1234' },

  // RACSOL
  { id: 'usr-rc-ec', empresa_id: 'emp-racsol', nombre: 'Rodrigo Castillo', rol: 'encargado_calidad', email: 'rodrigo@racsol.cl', password: 'demo1234' },
  { id: 'usr-rc-jp1', empresa_id: 'emp-racsol', planta_id: 'plt-rcl', nombre: 'Sandra Muñoz', rol: 'jefe_planta', email: 'sandra@racsol.cl', password: 'demo1234' },
  { id: 'usr-rc-ep1', empresa_id: 'emp-racsol', planta_id: 'plt-rcl', nombre: 'Eduardo Peña', rol: 'encargado_patio', email: 'eduardo@racsol.cl', password: 'demo1234' },
];

// =============================================
// MOLDES (HORMISUR Temuco + some others)
// =============================================

export const MOCK_MOLDES: Molde[] = [
  { id: 'mol-1', planta_id: 'plt-tmc', numero: 'M-001', tipo_poste: '8.70-350', activo: true },
  { id: 'mol-2', planta_id: 'plt-tmc', numero: 'M-002', tipo_poste: '8.70-350', activo: true },
  { id: 'mol-3', planta_id: 'plt-tmc', numero: 'M-003', tipo_poste: '10-600', activo: true },
  { id: 'mol-4', planta_id: 'plt-tmc', numero: 'M-004', tipo_poste: '10-600', activo: true },
  { id: 'mol-5', planta_id: 'plt-tmc', numero: 'M-005', tipo_poste: '11.5-1000', activo: true },
  { id: 'mol-6', planta_id: 'plt-tmc', numero: 'M-006', tipo_poste: '11.5-600', activo: true },
  { id: 'mol-7', planta_id: 'plt-tmc', numero: 'M-007', tipo_poste: '13.5-1000', activo: true },
  { id: 'mol-8', planta_id: 'plt-tmc', numero: 'M-008', tipo_poste: '13.5-1000', activo: true },
  { id: 'mol-9', planta_id: 'plt-prl', numero: 'M-001', tipo_poste: '10-350', activo: true },
  { id: 'mol-10', planta_id: 'plt-prl', numero: 'M-002', tipo_poste: '10-600', activo: true },
  { id: 'mol-11', planta_id: 'plt-hbl', numero: 'M-001', tipo_poste: '8.70-350', activo: true },
  { id: 'mol-12', planta_id: 'plt-hbl', numero: 'M-002', tipo_poste: '10-600', activo: true },
  { id: 'mol-13', planta_id: 'plt-fco', numero: 'M-001', tipo_poste: '10-350', activo: true },
  { id: 'mol-14', planta_id: 'plt-fco', numero: 'M-002', tipo_poste: '11.5-1000', activo: true },
  // HORMISUR Osorno
  { id: 'mol-15', planta_id: 'plt-osr', numero: 'M-001', tipo_poste: '10-600', activo: true },
  { id: 'mol-16', planta_id: 'plt-osr', numero: 'M-002', tipo_poste: '11.5-1000', activo: true },
  { id: 'mol-17', planta_id: 'plt-osr', numero: 'M-003', tipo_poste: '10-600', activo: true },
  // HORMIBAL Frutillar
  { id: 'mol-18', planta_id: 'plt-frt', numero: 'M-001', tipo_poste: '10-600', activo: true },
  { id: 'mol-19', planta_id: 'plt-frt', numero: 'M-002', tipo_poste: '8.70-350', activo: true },
  // HORVAL Valdivia
  { id: 'mol-20', planta_id: 'plt-hvl', numero: 'M-001', tipo_poste: '10-350', activo: true },
  { id: 'mol-21', planta_id: 'plt-hvl', numero: 'M-002', tipo_poste: '10-600', activo: true },
  // HORNOR Coronel
  { id: 'mol-22', planta_id: 'plt-hnr', numero: 'M-001', tipo_poste: '8.70-350', activo: true },
  { id: 'mol-23', planta_id: 'plt-hnr', numero: 'M-002', tipo_poste: '10-600', activo: true },
  // FACORO Puerto Varas
  { id: 'mol-24', planta_id: 'plt-fpa', numero: 'M-001', tipo_poste: '10-350', activo: true },
  { id: 'mol-25', planta_id: 'plt-fpa', numero: 'M-002', tipo_poste: '10-600', activo: true },
  // RACSOL Coyhaique
  { id: 'mol-26', planta_id: 'plt-rcl', numero: 'M-001', tipo_poste: '10-350', activo: true },
  { id: 'mol-27', planta_id: 'plt-rcl', numero: 'M-002', tipo_poste: '10-600', activo: true },
  { id: 'mol-28', planta_id: 'plt-rcl', numero: 'M-003', tipo_poste: '8.70-350', activo: true },
];

// =============================================
// MATERIALES ACTIVOS (pre-cargados por jefe_planta / enc_calidad)
// =============================================

export const MOCK_MATERIALES: MaterialActivo[] = [
  // HORMISUR Temuco — cemento
  { id: 'mat-1', planta_id: 'plt-tmc', tipo: 'cemento', codigo_lote: 'CB-2026-03-B', proveedor: 'Cementos Bío Bío', descripcion: 'Cemento Portland Puzolánico', fecha_recepcion: '2026-03-15', certificado_id: 'cond-1', activo: true, created_by: 'usr-hs-jp1', created_at: '2026-03-15' },
  { id: 'mat-2', planta_id: 'plt-tmc', tipo: 'cemento', codigo_lote: 'CB-2026-03-A', proveedor: 'Cementos Bío Bío', descripcion: 'Cemento Portland Puzolánico', fecha_recepcion: '2026-03-01', certificado_id: 'cond-1', activo: false, created_by: 'usr-hs-jp1', created_at: '2026-03-01' },
  // HORMISUR Temuco — áridos
  { id: 'mat-3', planta_id: 'plt-tmc', tipo: 'aridos', codigo_lote: 'AR-2026-Q1', proveedor: 'Cantera Sur', descripcion: 'Árido grueso y fino', fecha_recepcion: '2026-01-05', certificado_id: 'cond-2', activo: true, created_by: 'usr-hs-jp1', created_at: '2026-01-05' },
  // HORMISUR Temuco — acero
  { id: 'mat-4', planta_id: 'plt-tmc', tipo: 'acero', codigo_lote: 'AZ-2026-03', proveedor: 'AZA', descripcion: 'Barras de refuerzo A630-420H', fecha_recepcion: '2026-03-10', certificado_id: 'cond-3', activo: true, created_by: 'usr-hs-jp1', created_at: '2026-03-10' },
  { id: 'mat-5', planta_id: 'plt-tmc', tipo: 'acero', codigo_lote: 'AZ-2026-02', proveedor: 'AZA', descripcion: 'Barras de refuerzo A630-420H', fecha_recepcion: '2026-02-15', certificado_id: 'cond-3', activo: true, created_by: 'usr-hs-jp1', created_at: '2026-02-15' },
  // HORMISUR Temuco — aditivo
  { id: 'mat-6', planta_id: 'plt-tmc', tipo: 'aditivo', codigo_lote: 'SIKA-PLT-2026-03', proveedor: 'Sika Chile', descripcion: 'Plastificante ViscoCrete 0.5%', fecha_recepcion: '2026-03-20', certificado_id: 'cond-10', activo: true, created_by: 'usr-hs-ec', created_at: '2026-03-20' },
  // HORMIBAL Los Ángeles
  { id: 'mat-7', planta_id: 'plt-hbl', tipo: 'cemento', codigo_lote: 'CB-HBL-03', proveedor: 'Cementos Bío Bío', descripcion: 'Cemento Portland Puzolánico', fecha_recepcion: '2026-03-01', certificado_id: 'cond-11', activo: true, created_by: 'usr-hb-jp1', created_at: '2026-03-01' },
  { id: 'mat-8', planta_id: 'plt-hbl', tipo: 'aridos', codigo_lote: 'AR-HBL-Q1', proveedor: 'Cantera Los Ángeles', descripcion: 'Árido grueso y fino', fecha_recepcion: '2026-01-10', activo: true, created_by: 'usr-hb-jp1', created_at: '2026-01-10' },
  { id: 'mat-9', planta_id: 'plt-hbl', tipo: 'acero', codigo_lote: 'AZ-HBL-02', proveedor: 'AZA', descripcion: 'Barras de refuerzo', fecha_recepcion: '2026-02-05', activo: true, created_by: 'usr-hb-jp1', created_at: '2026-02-05' },
  // FACORO Concepción
  { id: 'mat-10', planta_id: 'plt-fco', tipo: 'cemento', codigo_lote: 'CB-FCO-03', proveedor: 'Cementos Bío Bío', descripcion: 'Cemento Portland', fecha_recepcion: '2026-02-20', certificado_id: 'cond-13', activo: true, created_by: 'usr-fc-jp1', created_at: '2026-02-20' },
  { id: 'mat-11', planta_id: 'plt-fco', tipo: 'aridos', codigo_lote: 'AR-FCO-Q1', proveedor: 'Cantera Concepción', descripcion: 'Árido grueso y fino', fecha_recepcion: '2026-01-15', activo: true, created_by: 'usr-fc-jp1', created_at: '2026-01-15' },
  { id: 'mat-12', planta_id: 'plt-fco', tipo: 'acero', codigo_lote: 'AZ-FCO-02', proveedor: 'AZA', descripcion: 'Barras de refuerzo', fecha_recepcion: '2026-02-10', activo: true, created_by: 'usr-fc-jp1', created_at: '2026-02-10' },
  // HORMISUR Parral
  { id: 'mat-13', planta_id: 'plt-prl', tipo: 'cemento', codigo_lote: 'CB-PRL-2026-03', proveedor: 'Cementos Bío Bío', descripcion: 'Cemento Portland Puzolánico', fecha_recepcion: '2026-03-05', certificado_id: 'cond-15', activo: true, created_by: 'usr-hs-jp2', created_at: '2026-03-05' },
  { id: 'mat-14', planta_id: 'plt-prl', tipo: 'aridos', codigo_lote: 'AR-PRL-Q1', proveedor: 'Cantera Maule', descripcion: 'Árido grueso y fino', fecha_recepcion: '2026-01-10', activo: true, created_by: 'usr-hs-jp2', created_at: '2026-01-10' },
  { id: 'mat-15', planta_id: 'plt-prl', tipo: 'acero', codigo_lote: 'AZ-PRL-2026-02', proveedor: 'AZA', descripcion: 'Barras de refuerzo A630-420H', fecha_recepcion: '2026-02-20', activo: true, created_by: 'usr-hs-jp2', created_at: '2026-02-20' },
  // HORMISUR Osorno
  { id: 'mat-16', planta_id: 'plt-osr', tipo: 'cemento', codigo_lote: 'CB-OSR-2026-03', proveedor: 'Cementos Melón', descripcion: 'Cemento Portland Puzolánico', fecha_recepcion: '2026-03-10', certificado_id: 'cond-17', activo: true, created_by: 'usr-hs-jp3', created_at: '2026-03-10' },
  { id: 'mat-17', planta_id: 'plt-osr', tipo: 'aridos', codigo_lote: 'AR-OSR-Q1', proveedor: 'Cantera Osorno', descripcion: 'Árido grueso y fino', fecha_recepcion: '2026-01-20', activo: true, created_by: 'usr-hs-jp3', created_at: '2026-01-20' },
  { id: 'mat-18', planta_id: 'plt-osr', tipo: 'acero', codigo_lote: 'AZ-OSR-2026-02', proveedor: 'AZA', descripcion: 'Barras de refuerzo A630-420H', fecha_recepcion: '2026-02-15', activo: true, created_by: 'usr-hs-jp3', created_at: '2026-02-15' },
  // HORMIBAL Frutillar
  { id: 'mat-19', planta_id: 'plt-frt', tipo: 'cemento', codigo_lote: 'CB-FRT-2026-03', proveedor: 'Cementos Melón', descripcion: 'Cemento Portland Puzolánico', fecha_recepcion: '2026-03-08', activo: true, created_by: 'usr-hb-jp2', created_at: '2026-03-08' },
  { id: 'mat-20', planta_id: 'plt-frt', tipo: 'aridos', codigo_lote: 'AR-FRT-Q1', proveedor: 'Cantera Llanquihue', descripcion: 'Árido grueso y fino', fecha_recepcion: '2026-01-12', activo: true, created_by: 'usr-hb-jp2', created_at: '2026-01-12' },
  { id: 'mat-21', planta_id: 'plt-frt', tipo: 'acero', codigo_lote: 'AZ-FRT-2026-02', proveedor: 'AZA', descripcion: 'Barras de refuerzo A630-420H', fecha_recepcion: '2026-02-18', activo: true, created_by: 'usr-hb-jp2', created_at: '2026-02-18' },
  // HORVAL Valdivia
  { id: 'mat-22', planta_id: 'plt-hvl', tipo: 'cemento', codigo_lote: 'CB-HVL-2026-03', proveedor: 'Cementos Bío Bío', descripcion: 'Cemento Portland Puzolánico', fecha_recepcion: '2026-03-03', activo: true, created_by: 'usr-hv-jp1', created_at: '2026-03-03' },
  { id: 'mat-23', planta_id: 'plt-hvl', tipo: 'aridos', codigo_lote: 'AR-HVL-Q1', proveedor: 'Cantera Valdivia', descripcion: 'Árido grueso y fino', fecha_recepcion: '2026-01-18', activo: true, created_by: 'usr-hv-jp1', created_at: '2026-01-18' },
  { id: 'mat-24', planta_id: 'plt-hvl', tipo: 'acero', codigo_lote: 'AZ-HVL-2026-02', proveedor: 'AZA', descripcion: 'Barras de refuerzo A630-420H', fecha_recepcion: '2026-02-25', activo: true, created_by: 'usr-hv-jp1', created_at: '2026-02-25' },
  // HORNOR Coyhaique
  { id: 'mat-25', planta_id: 'plt-hnr', tipo: 'cemento', codigo_lote: 'CB-HNR-2026-03', proveedor: 'Cementos Melón', descripcion: 'Cemento Portland Puzolánico', fecha_recepcion: '2026-03-12', activo: true, created_by: 'usr-hn-jp1', created_at: '2026-03-12' },
  { id: 'mat-26', planta_id: 'plt-hnr', tipo: 'aridos', codigo_lote: 'AR-HNR-Q1', proveedor: 'Cantera Aysén', descripcion: 'Árido grueso y fino', fecha_recepcion: '2026-01-22', activo: true, created_by: 'usr-hn-jp1', created_at: '2026-01-22' },
  { id: 'mat-27', planta_id: 'plt-hnr', tipo: 'acero', codigo_lote: 'AZ-HNR-2026-02', proveedor: 'AZA', descripcion: 'Barras de refuerzo A630-420H', fecha_recepcion: '2026-02-08', activo: true, created_by: 'usr-hn-jp1', created_at: '2026-02-08' },
  // FACORO Puerto Varas
  { id: 'mat-28', planta_id: 'plt-fpa', tipo: 'cemento', codigo_lote: 'CB-FPA-2026-03', proveedor: 'Cementos Melón', descripcion: 'Cemento Portland Puzolánico', fecha_recepcion: '2026-03-06', activo: true, created_by: 'usr-fc-jp2', created_at: '2026-03-06' },
  { id: 'mat-29', planta_id: 'plt-fpa', tipo: 'aridos', codigo_lote: 'AR-FPA-Q1', proveedor: 'Cantera Llanquihue', descripcion: 'Árido grueso y fino', fecha_recepcion: '2026-01-14', activo: true, created_by: 'usr-fc-jp2', created_at: '2026-01-14' },
  { id: 'mat-30', planta_id: 'plt-fpa', tipo: 'acero', codigo_lote: 'AZ-FPA-2026-02', proveedor: 'AZA', descripcion: 'Barras de refuerzo A630-420H', fecha_recepcion: '2026-02-22', activo: true, created_by: 'usr-fc-jp2', created_at: '2026-02-22' },
  // RACSOL Coyhaique
  { id: 'mat-31', planta_id: 'plt-rcl', tipo: 'cemento', codigo_lote: 'CB-RCL-2026-04', proveedor: 'Cementos Bío Bío', descripcion: 'Cemento Portland Puzolánico', fecha_recepcion: '2026-04-02', activo: true, created_by: 'usr-rc-jp1', created_at: '2026-04-02' },
  { id: 'mat-32', planta_id: 'plt-rcl', tipo: 'aridos', codigo_lote: 'AR-RCL-Q2', proveedor: 'Cantera Aysén', descripcion: 'Árido grueso y fino', fecha_recepcion: '2026-04-05', activo: true, created_by: 'usr-rc-jp1', created_at: '2026-04-05' },
  { id: 'mat-33', planta_id: 'plt-rcl', tipo: 'acero', codigo_lote: 'AZ-RCL-2026-03', proveedor: 'AZA', descripcion: 'Barras de refuerzo A630-420H', fecha_recepcion: '2026-03-28', activo: true, created_by: 'usr-rc-jp1', created_at: '2026-03-28' },
];

// =============================================
// TRABAJADORES (HORMISUR Temuco mostly)
// =============================================

export const MOCK_TRABAJADORES: Trabajador[] = [
  { id: 'trb-1', planta_id: 'plt-tmc', nombre: 'Héctor Salazar', actividades_habilitadas: ['enfierradura', 'moldaje'], fecha_ultima_capacitacion: '2026-02-15', activo: true },
  { id: 'trb-2', planta_id: 'plt-tmc', nombre: 'Ignacio Bravo', actividades_habilitadas: ['moldaje', 'hormigonado'], fecha_ultima_capacitacion: '2026-01-20', activo: true },
  { id: 'trb-3', planta_id: 'plt-tmc', nombre: 'Camila Vega', actividades_habilitadas: ['hormigonado', 'curado'], fecha_ultima_capacitacion: '2026-03-01', activo: true },
  { id: 'trb-4', planta_id: 'plt-tmc', nombre: 'Tomás Herrera', actividades_habilitadas: ['enfierradura'], fecha_ultima_capacitacion: '2025-06-10', activo: true },
  { id: 'trb-5', planta_id: 'plt-tmc', nombre: 'Valentina Morales', actividades_habilitadas: ['curado', 'moldaje'], fecha_ultima_capacitacion: '2026-02-28', activo: true },
  { id: 'trb-6', planta_id: 'plt-tmc', nombre: 'Matías Contreras', actividades_habilitadas: ['enfierradura', 'hormigonado'], fecha_ultima_capacitacion: '2026-03-10', activo: true },
  { id: 'trb-7', planta_id: 'plt-tmc', nombre: 'Javiera Pinto', actividades_habilitadas: ['moldaje', 'curado'], fecha_ultima_capacitacion: '2026-01-05', activo: true },
  { id: 'trb-8', planta_id: 'plt-tmc', nombre: 'Nicolás Araya', actividades_habilitadas: ['hormigonado', 'enfierradura'], fecha_ultima_capacitacion: '2026-02-20', activo: true },
  { id: 'trb-9', planta_id: 'plt-hbl', nombre: 'Ricardo Fuentes', actividades_habilitadas: ['enfierradura', 'moldaje', 'hormigonado'], fecha_ultima_capacitacion: '2026-02-10', activo: true },
  { id: 'trb-10', planta_id: 'plt-fco', nombre: 'Carolina Espinoza', actividades_habilitadas: ['moldaje', 'curado'], fecha_ultima_capacitacion: '2026-03-05', activo: true },
  // HORMISUR Parral
  { id: 'trb-11', planta_id: 'plt-prl', nombre: 'Óscar Leiva', actividades_habilitadas: ['enfierradura', 'moldaje'], fecha_ultima_capacitacion: '2026-01-25', activo: true },
  { id: 'trb-12', planta_id: 'plt-prl', nombre: 'Claudia Rojas', actividades_habilitadas: ['hormigonado', 'curado'], fecha_ultima_capacitacion: '2026-03-02', activo: true },
  // HORMISUR Osorno
  { id: 'trb-13', planta_id: 'plt-osr', nombre: 'Esteban Navarrete', actividades_habilitadas: ['enfierradura', 'hormigonado'], fecha_ultima_capacitacion: '2026-02-18', activo: true },
  { id: 'trb-14', planta_id: 'plt-osr', nombre: 'Daniela Silva', actividades_habilitadas: ['moldaje', 'curado'], fecha_ultima_capacitacion: '2026-01-30', activo: true },
  { id: 'trb-15', planta_id: 'plt-osr', nombre: 'Cristián Ibáñez', actividades_habilitadas: ['enfierradura', 'moldaje', 'hormigonado'], fecha_ultima_capacitacion: '2026-03-08', activo: true },
  // HORMIBAL Frutillar
  { id: 'trb-16', planta_id: 'plt-frt', nombre: 'Rubén Paredes', actividades_habilitadas: ['enfierradura', 'moldaje'], fecha_ultima_capacitacion: '2026-02-05', activo: true },
  { id: 'trb-17', planta_id: 'plt-frt', nombre: 'Soledad Aravena', actividades_habilitadas: ['hormigonado', 'curado'], fecha_ultima_capacitacion: '2026-03-12', activo: true },
  // HORVAL Valdivia
  { id: 'trb-18', planta_id: 'plt-hvl', nombre: 'Carlos Henríquez', actividades_habilitadas: ['enfierradura', 'moldaje', 'hormigonado'], fecha_ultima_capacitacion: '2026-02-20', activo: true },
  { id: 'trb-19', planta_id: 'plt-hvl', nombre: 'Rosa Alvarado', actividades_habilitadas: ['curado', 'moldaje'], fecha_ultima_capacitacion: '2026-01-15', activo: true },
  // HORNOR Coyhaique
  { id: 'trb-20', planta_id: 'plt-hnr', nombre: 'Sergio Oyarzún', actividades_habilitadas: ['enfierradura', 'hormigonado'], fecha_ultima_capacitacion: '2026-03-01', activo: true },
  { id: 'trb-21', planta_id: 'plt-hnr', nombre: 'Patricia Mansilla', actividades_habilitadas: ['moldaje', 'curado'], fecha_ultima_capacitacion: '2026-02-10', activo: true },
  // FACORO Puerto Varas
  { id: 'trb-22', planta_id: 'plt-fpa', nombre: 'Miguel Barría', actividades_habilitadas: ['enfierradura', 'moldaje'], fecha_ultima_capacitacion: '2026-01-28', activo: true },
  { id: 'trb-23', planta_id: 'plt-fpa', nombre: 'Verónica Gallardo', actividades_habilitadas: ['hormigonado', 'curado'], fecha_ultima_capacitacion: '2026-03-15', activo: true },
  // RACSOL Coyhaique
  { id: 'trb-24', planta_id: 'plt-rcl', nombre: 'Gonzalo Inostroza', actividades_habilitadas: ['enfierradura', 'moldaje', 'hormigonado'], fecha_ultima_capacitacion: '2026-04-10', activo: true },
  { id: 'trb-25', planta_id: 'plt-rcl', nombre: 'Marisol Vergara', actividades_habilitadas: ['curado', 'moldaje'], fecha_ultima_capacitacion: '2026-04-10', activo: true },
  { id: 'trb-26', planta_id: 'plt-rcl', nombre: 'Pablo Zúñiga', actividades_habilitadas: ['enfierradura', 'hormigonado'], fecha_ultima_capacitacion: '2026-04-10', activo: true },
];

// =============================================
// CONDICIONES HABILITANTES (HORMISUR Temuco)
// =============================================

export const MOCK_CONDICIONES: CondicionHabilitante[] = [
  { id: 'cond-1', planta_id: 'plt-tmc', tipo: 'certificado_mp', descripcion: 'Certificado cemento NCh 148', norma_referencia: 'NCh 148', frecuencia_descripcion: 'Semestral', fecha_emision: '2026-01-15', fecha_vencimiento: '2026-07-15', entidad_emisora: 'Cementos Bío Bío', estado: 'vigente', created_by: 'usr-hs-jp1', created_at: '2026-01-15' },
  { id: 'cond-2', planta_id: 'plt-tmc', tipo: 'certificado_mp', descripcion: 'Certificado áridos NCh 163/165', norma_referencia: 'NCh 163', frecuencia_descripcion: 'Anual', fecha_emision: '2025-11-10', fecha_vencimiento: '2026-11-10', entidad_emisora: 'Lab. Geotécnico Sur', estado: 'vigente', created_by: 'usr-hs-ec', created_at: '2025-11-10' },
  { id: 'cond-3', planta_id: 'plt-tmc', tipo: 'certificado_mp', descripcion: 'Certificado acero NCh 204', norma_referencia: 'NCh 204', frecuencia_descripcion: 'Semestral', fecha_emision: '2025-12-01', fecha_vencimiento: '2026-06-01', entidad_emisora: 'AZA', estado: 'vigente', created_by: 'usr-hs-jp1', created_at: '2025-12-01' },
  { id: 'cond-4', planta_id: 'plt-tmc', tipo: 'calibracion', descripcion: 'Calibración planta hormigonera', norma_referencia: 'NCh-ISO 17025', frecuencia_descripcion: 'Anual', fecha_emision: '2025-08-20', fecha_vencimiento: '2026-08-20', entidad_emisora: 'Lab. Metrología Temuco', estado: 'vigente', created_by: 'usr-hs-ec', created_at: '2025-08-20' },
  { id: 'cond-5', planta_id: 'plt-tmc', tipo: 'calibracion', descripcion: 'Calibración balanzas', norma_referencia: 'OIML R76-1', frecuencia_descripcion: 'Cada 3 años', fecha_emision: '2024-05-15', fecha_vencimiento: '2027-05-15', entidad_emisora: 'Lab. Metrología Temuco', estado: 'vigente', created_by: 'usr-hs-ec', created_at: '2024-05-15' },
  { id: 'cond-6', planta_id: 'plt-tmc', tipo: 'mantencion', descripcion: 'Mantención betonera', frecuencia_descripcion: 'Trimestral', fecha_emision: '2026-01-10', fecha_vencimiento: '2026-04-10', entidad_emisora: 'Mantención interna', estado: 'por_vencer', created_by: 'usr-hs-jp1', created_at: '2026-01-10' },
  { id: 'cond-7', planta_id: 'plt-tmc', tipo: 'mantencion', descripcion: 'Mantención sistema de vibrado', frecuencia_descripcion: 'Semestral', fecha_emision: '2025-09-01', fecha_vencimiento: '2026-03-01', entidad_emisora: 'Mantención interna', estado: 'vencido', created_by: 'usr-hs-jp1', created_at: '2025-09-01' },
  { id: 'cond-8', planta_id: 'plt-tmc', tipo: 'capacitacion', descripcion: 'Capacitación personal: concreteros', frecuencia_descripcion: 'Según programa P905', fecha_emision: '2026-02-15', fecha_vencimiento: '2026-08-15', entidad_emisora: 'Empresa', estado: 'vigente', created_by: 'usr-hs-ec', created_at: '2026-02-15' },
  { id: 'cond-9', planta_id: 'plt-tmc', tipo: 'mantencion', descripcion: 'Mantención moldes (base y volteo)', frecuencia_descripcion: 'Mensual', fecha_emision: '2026-03-05', fecha_vencimiento: '2026-04-05', entidad_emisora: 'Mantención interna', estado: 'por_vencer', created_by: 'usr-hs-jp1', created_at: '2026-03-05' },
  { id: 'cond-10', planta_id: 'plt-tmc', tipo: 'certificado_mp', descripcion: 'Certificado aditivos NCh 2182', norma_referencia: 'NCh 2182', frecuencia_descripcion: 'Cada partida', fecha_emision: '2026-03-20', fecha_vencimiento: '2026-09-20', entidad_emisora: 'Sika Chile', estado: 'vigente', created_by: 'usr-hs-ec', created_at: '2026-03-20' },
  // HORMIBAL Los Ángeles — some conditions
  { id: 'cond-11', planta_id: 'plt-hbl', tipo: 'certificado_mp', descripcion: 'Certificado cemento NCh 148', norma_referencia: 'NCh 148', frecuencia_descripcion: 'Semestral', fecha_emision: '2026-02-01', fecha_vencimiento: '2026-08-01', entidad_emisora: 'Cementos Bío Bío', estado: 'vigente', created_by: 'usr-hb-jp1', created_at: '2026-02-01' },
  { id: 'cond-12', planta_id: 'plt-hbl', tipo: 'calibracion', descripcion: 'Calibración balanzas', norma_referencia: 'OIML R76-1', frecuencia_descripcion: 'Cada 3 años', fecha_emision: '2025-01-10', fecha_vencimiento: '2028-01-10', entidad_emisora: 'Lab. Metrología Biobío', estado: 'vigente', created_by: 'usr-hb-ec', created_at: '2025-01-10' },
  // FACORO Concepción
  { id: 'cond-13', planta_id: 'plt-fco', tipo: 'certificado_mp', descripcion: 'Certificado cemento NCh 148', norma_referencia: 'NCh 148', frecuencia_descripcion: 'Semestral', fecha_emision: '2025-10-15', fecha_vencimiento: '2026-04-15', entidad_emisora: 'Cementos Bío Bío', estado: 'por_vencer', created_by: 'usr-fc-jp1', created_at: '2025-10-15' },
  // HORMISUR Parral
  { id: 'cond-15', planta_id: 'plt-prl', tipo: 'certificado_mp', descripcion: 'Certificado cemento NCh 148', norma_referencia: 'NCh 148', frecuencia_descripcion: 'Semestral', fecha_emision: '2026-01-20', fecha_vencimiento: '2026-07-20', entidad_emisora: 'Cementos Bío Bío', estado: 'vigente', created_by: 'usr-hs-jp2', created_at: '2026-01-20' },
  { id: 'cond-16', planta_id: 'plt-prl', tipo: 'mantencion', descripcion: 'Mantención moldes y betonera', frecuencia_descripcion: 'Trimestral', fecha_emision: '2026-02-01', fecha_vencimiento: '2026-05-01', entidad_emisora: 'Mantención interna', estado: 'vigente', created_by: 'usr-hs-jp2', created_at: '2026-02-01' },
  // HORMISUR Osorno
  { id: 'cond-17', planta_id: 'plt-osr', tipo: 'certificado_mp', descripcion: 'Certificado cemento NCh 148', norma_referencia: 'NCh 148', frecuencia_descripcion: 'Semestral', fecha_emision: '2026-02-10', fecha_vencimiento: '2026-08-10', entidad_emisora: 'Cementos Melón', estado: 'vigente', created_by: 'usr-hs-jp3', created_at: '2026-02-10' },
  { id: 'cond-18', planta_id: 'plt-osr', tipo: 'calibracion', descripcion: 'Calibración planta hormigonera', norma_referencia: 'NCh-ISO 17025', frecuencia_descripcion: 'Anual', fecha_emision: '2025-07-15', fecha_vencimiento: '2026-07-15', entidad_emisora: 'Lab. Metrología Osorno', estado: 'vigente', created_by: 'usr-hs-jp3', created_at: '2025-07-15' },
  // RACSOL Coyhaique
  { id: 'cond-19', planta_id: 'plt-rcl', tipo: 'certificado_mp', descripcion: 'Certificado cemento NCh 148', norma_referencia: 'NCh 148', frecuencia_descripcion: 'Semestral', fecha_emision: '2026-03-01', fecha_vencimiento: '2026-09-01', entidad_emisora: 'Cementos Bío Bío', estado: 'vigente', created_by: 'usr-rc-jp1', created_at: '2026-03-01' },
  { id: 'cond-20', planta_id: 'plt-rcl', tipo: 'certificado_mp', descripcion: 'Certificado acero NCh 204', norma_referencia: 'NCh 204', frecuencia_descripcion: 'Semestral', fecha_emision: '2026-03-15', fecha_vencimiento: '2026-09-15', entidad_emisora: 'AZA', estado: 'vigente', created_by: 'usr-rc-jp1', created_at: '2026-03-15' },
  { id: 'cond-21', planta_id: 'plt-rcl', tipo: 'calibracion', descripcion: 'Calibración planta hormigonera', norma_referencia: 'NCh-ISO 17025', frecuencia_descripcion: 'Anual', fecha_emision: '2026-01-10', fecha_vencimiento: '2027-01-10', entidad_emisora: 'Lab. Metrología Aysén', estado: 'vigente', created_by: 'usr-rc-ec', created_at: '2026-01-10' },
  { id: 'cond-22', planta_id: 'plt-rcl', tipo: 'capacitacion', descripcion: 'Capacitación personal: concreteros', frecuencia_descripcion: 'Según programa P905', fecha_emision: '2026-04-10', fecha_vencimiento: '2026-10-10', entidad_emisora: 'Empresa', estado: 'vigente', created_by: 'usr-rc-ec', created_at: '2026-04-10' },
];

// =============================================
// JORNADAS
// =============================================

export const MOCK_JORNADAS: Jornada[] = [
  {
    id: 'jrn-1', planta_id: 'plt-tmc', fecha: '2026-03-20', codigo: 'TMC-260320-1',
    tipos_poste: ['8.70-350', '10-600'], destino: 'SAESA',
    temperatura: 12, humedad_relativa: 68,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-2026-03-A', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-02', aditivo_detalle: 'Plastificante 0.5%',
    cono_abrams_mm: 15,
    operadores_enfierradura: ['trb-1'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-3'], operadores_curado: ['trb-5'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hs-ep1', created_at: '2026-03-20',
  },
  {
    id: 'jrn-2', planta_id: 'plt-tmc', fecha: '2026-03-21', codigo: 'TMC-260321-1',
    tipos_poste: ['10-600'], destino: 'SAESA',
    temperatura: 9, humedad_relativa: 72,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-2026-03-A', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-02', aditivo_detalle: 'Plastificante 0.5%',
    cono_abrams_mm: 14,
    operadores_enfierradura: ['trb-6'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-3'], operadores_curado: ['trb-5'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'desmolde_registrado', alertas: [], created_by: 'usr-hs-ep1', created_at: '2026-03-21',
  },
  {
    id: 'jrn-3', planta_id: 'plt-tmc', fecha: '2026-03-24', codigo: 'TMC-260324-1',
    tipos_poste: ['8.70-350', '11.5-1000'], destino: 'SAESA',
    temperatura: 7, humedad_relativa: 80,
    medidas_proteccion: ['mantas_termicas'],
    lote_cemento: 'CB-2026-03-B', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-03', aditivo_detalle: 'Plastificante 0.5%',
    cono_abrams_mm: 16,
    operadores_enfierradura: ['trb-1', 'trb-8'], operadores_moldaje: ['trb-7'], operadores_hormigonado: ['trb-3'], operadores_curado: ['trb-5'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'fabricacion_verificada', alertas: [], created_by: 'usr-hs-ep1', created_at: '2026-03-24',
  },
  {
    id: 'jrn-4', planta_id: 'plt-tmc', fecha: '2026-03-25', codigo: 'TMC-260325-1',
    tipos_poste: ['10-600', '13.5-1000'], destino: 'SAESA',
    temperatura: 4, humedad_relativa: 85,
    medidas_proteccion: ['aditivos', 'agua_caliente', 'mantas_termicas'],
    lote_cemento: 'CB-2026-03-B', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-03',
    cono_abrams_mm: 18,
    operadores_enfierradura: ['trb-6', 'trb-4'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-8'], operadores_curado: ['trb-3'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'abierta',
    alertas: ['Operador Tomás Herrera (enfierradura) tiene capacitación vencida (10/06/2025)'],
    created_by: 'usr-hs-ep1', created_at: '2026-03-25',
  },
  {
    id: 'jrn-5', planta_id: 'plt-prl', fecha: '2026-03-24', codigo: 'PRL-260324',
    tipos_poste: ['10-350', '10-600'], destino: 'otro_cliente',
    temperatura: 11, humedad_relativa: 65,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-PRL-03', partida_aridos: 'AR-PRL-Q1', lote_acero: 'AZ-PRL-02',
    cono_abrams_mm: 15,
    operadores_enfierradura: [], operadores_moldaje: [], operadores_hormigonado: [], operadores_curado: [],
    jefe_planta_id: 'usr-hs-jp2', encargado_calidad_id: 'usr-hs-ec',
    estado: 'fabricacion_verificada', alertas: [], created_by: 'usr-hs-jp2', created_at: '2026-03-24',
  },
  // HORMIBAL jornada
  {
    id: 'jrn-6', planta_id: 'plt-hbl', fecha: '2026-03-25', codigo: 'HBL-260325',
    tipos_poste: ['8.70-350', '10-600'], destino: 'SAESA',
    temperatura: 14, humedad_relativa: 60,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-HBL-03', partida_aridos: 'AR-HBL-Q1', lote_acero: 'AZ-HBL-02',
    cono_abrams_mm: 16,
    operadores_enfierradura: ['trb-9'], operadores_moldaje: ['trb-9'], operadores_hormigonado: ['trb-9'], operadores_curado: ['trb-9'],
    jefe_planta_id: 'usr-hb-jp1', encargado_calidad_id: 'usr-hb-ec',
    estado: 'abierta', alertas: [], created_by: 'usr-hb-ep1', created_at: '2026-03-25',
  },
  // FACORO jornada
  {
    id: 'jrn-7', planta_id: 'plt-fco', fecha: '2026-03-26', codigo: 'FCO-260326',
    tipos_poste: ['10-350'], destino: 'SAESA',
    temperatura: 15, humedad_relativa: 55,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-FCO-03', partida_aridos: 'AR-FCO-Q1', lote_acero: 'AZ-FCO-02',
    cono_abrams_mm: 14,
    operadores_enfierradura: ['trb-10'], operadores_moldaje: ['trb-10'], operadores_hormigonado: ['trb-10'], operadores_curado: ['trb-10'],
    jefe_planta_id: 'usr-fc-jp1', encargado_calidad_id: 'usr-fc-ec',
    estado: 'fabricacion_verificada', alertas: [], created_by: 'usr-fc-ep1', created_at: '2026-03-26',
  },
  // HORMISUR Parral — cerrada, visible al auditor
  {
    id: 'jrn-8', planta_id: 'plt-prl', fecha: '2026-03-26', codigo: 'PRL-260326',
    tipos_poste: ['10-350'], destino: 'SAESA',
    temperatura: 13, humedad_relativa: 62,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-PRL-2026-03', partida_aridos: 'AR-PRL-Q1', lote_acero: 'AZ-PRL-2026-02',
    cono_abrams_mm: 15,
    operadores_enfierradura: ['trb-11'], operadores_moldaje: ['trb-11'], operadores_hormigonado: ['trb-12'], operadores_curado: ['trb-12'],
    jefe_planta_id: 'usr-hs-jp2', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hs-ep2', created_at: '2026-03-26',
  },
  // HORMISUR Osorno — fabricacion verificada (en proceso)
  {
    id: 'jrn-9', planta_id: 'plt-osr', fecha: '2026-03-25', codigo: 'OSR-260325',
    tipos_poste: ['10-600', '11.5-1000'], destino: 'SAESA',
    temperatura: 10, humedad_relativa: 70,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-OSR-2026-03', partida_aridos: 'AR-OSR-Q1', lote_acero: 'AZ-OSR-2026-02',
    cono_abrams_mm: 16,
    operadores_enfierradura: ['trb-13'], operadores_moldaje: ['trb-14'], operadores_hormigonado: ['trb-15'], operadores_curado: ['trb-14'],
    jefe_planta_id: 'usr-hs-jp3', encargado_calidad_id: 'usr-hs-ec',
    estado: 'fabricacion_verificada', alertas: [], created_by: 'usr-hs-ep3', created_at: '2026-03-25',
  },
  // HORMISUR Osorno — cerrada, visible al auditor
  {
    id: 'jrn-10', planta_id: 'plt-osr', fecha: '2026-03-22', codigo: 'OSR-260322',
    tipos_poste: ['10-600'], destino: 'SAESA',
    temperatura: 8, humedad_relativa: 75,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-OSR-2026-03', partida_aridos: 'AR-OSR-Q1', lote_acero: 'AZ-OSR-2026-02',
    cono_abrams_mm: 14,
    operadores_enfierradura: ['trb-13', 'trb-15'], operadores_moldaje: ['trb-14'], operadores_hormigonado: ['trb-15'], operadores_curado: ['trb-14'],
    jefe_planta_id: 'usr-hs-jp3', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hs-ep3', created_at: '2026-03-22',
  },
  // HORMIBAL Los Ángeles — cerrada, visible
  {
    id: 'jrn-11', planta_id: 'plt-hbl', fecha: '2026-03-28', codigo: 'HBL-260328',
    tipos_poste: ['8.70-350', '10-600'], destino: 'SAESA',
    temperatura: 13, humedad_relativa: 58,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-HBL-03', partida_aridos: 'AR-HBL-Q1', lote_acero: 'AZ-HBL-02',
    cono_abrams_mm: 15,
    operadores_enfierradura: ['trb-9'], operadores_moldaje: ['trb-9'], operadores_hormigonado: ['trb-9'], operadores_curado: ['trb-9'],
    jefe_planta_id: 'usr-hb-jp1', encargado_calidad_id: 'usr-hb-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hb-ep1', created_at: '2026-03-28',
  },
  // HORMIBAL Frutillar — cerrada, visible
  {
    id: 'jrn-12', planta_id: 'plt-frt', fecha: '2026-03-27', codigo: 'FRT-260327',
    tipos_poste: ['10-600'], destino: 'SAESA',
    temperatura: 11, humedad_relativa: 65,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-FRT-2026-03', partida_aridos: 'AR-FRT-Q1', lote_acero: 'AZ-FRT-2026-02',
    cono_abrams_mm: 16,
    operadores_enfierradura: ['trb-16'], operadores_moldaje: ['trb-16'], operadores_hormigonado: ['trb-17'], operadores_curado: ['trb-17'],
    jefe_planta_id: 'usr-hb-jp2', encargado_calidad_id: 'usr-hb-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hb-ep2', created_at: '2026-03-27',
  },
  // FACORO Angol — cerrada, visible
  {
    id: 'jrn-13', planta_id: 'plt-fco', fecha: '2026-03-29', codigo: 'FCO-260329',
    tipos_poste: ['10-350', '11.5-1000'], destino: 'SAESA',
    temperatura: 14, humedad_relativa: 52,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-FCO-03', partida_aridos: 'AR-FCO-Q1', lote_acero: 'AZ-FCO-02',
    cono_abrams_mm: 15,
    operadores_enfierradura: ['trb-10'], operadores_moldaje: ['trb-10'], operadores_hormigonado: ['trb-10'], operadores_curado: ['trb-10'],
    jefe_planta_id: 'usr-fc-jp1', encargado_calidad_id: 'usr-fc-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-fc-ep1', created_at: '2026-03-29',
  },
  // FACORO Puerto Varas — cerrada, visible
  {
    id: 'jrn-14', planta_id: 'plt-fpa', fecha: '2026-03-28', codigo: 'FPA-260328',
    tipos_poste: ['10-350', '10-600'], destino: 'SAESA',
    temperatura: 10, humedad_relativa: 68,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-FPA-2026-03', partida_aridos: 'AR-FPA-Q1', lote_acero: 'AZ-FPA-2026-02',
    cono_abrams_mm: 14,
    operadores_enfierradura: ['trb-22'], operadores_moldaje: ['trb-22'], operadores_hormigonado: ['trb-23'], operadores_curado: ['trb-23'],
    jefe_planta_id: 'usr-fc-jp2', encargado_calidad_id: 'usr-fc-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-fc-ep2', created_at: '2026-03-28',
  },
  // HORVAL Valdivia — cerrada, visible
  {
    id: 'jrn-15', planta_id: 'plt-hvl', fecha: '2026-03-26', codigo: 'HVL-260326',
    tipos_poste: ['10-350', '10-600'], destino: 'SAESA',
    temperatura: 9, humedad_relativa: 72,
    medidas_proteccion: ['ninguna_requerida'],
    lote_cemento: 'CB-HVL-2026-03', partida_aridos: 'AR-HVL-Q1', lote_acero: 'AZ-HVL-2026-02',
    cono_abrams_mm: 15,
    operadores_enfierradura: ['trb-18'], operadores_moldaje: ['trb-18'], operadores_hormigonado: ['trb-19'], operadores_curado: ['trb-19'],
    jefe_planta_id: 'usr-hv-jp1', encargado_calidad_id: 'usr-hv-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hv-ep1', created_at: '2026-03-26',
  },
  // HORNOR Coyhaique — cerrada, visible
  {
    id: 'jrn-16', planta_id: 'plt-hnr', fecha: '2026-03-24', codigo: 'HNR-260324',
    tipos_poste: ['8.70-350', '10-600'], destino: 'SAESA',
    temperatura: 3, humedad_relativa: 80,
    medidas_proteccion: ['aditivos', 'agua_caliente'],
    lote_cemento: 'CB-HNR-2026-03', partida_aridos: 'AR-HNR-Q1', lote_acero: 'AZ-HNR-2026-02',
    cono_abrams_mm: 17,
    operadores_enfierradura: ['trb-20'], operadores_moldaje: ['trb-21'], operadores_hormigonado: ['trb-20'], operadores_curado: ['trb-21'],
    jefe_planta_id: 'usr-hn-jp1', encargado_calidad_id: 'usr-hn-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hn-ep1', created_at: '2026-03-24',
  },

  // =============================================
  // ABRIL 2026 — Todas las plantas (sin domingos: 5,12,19,26)
  // =============================================

  // --- HORMISUR Temuco ---
  { id: 'jrn-a01', planta_id: 'plt-tmc', fecha: '2026-04-01', codigo: 'TMC-260401-1',
    tipos_poste: ['8.70-350', '10-600'], destino: 'SAESA', temperatura: 11, humedad_relativa: 65,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-2026-04-A', partida_aridos: 'AR-2026-Q2', lote_acero: 'AZ-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-1'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-3'], operadores_curado: ['trb-2'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hs-ep1', created_at: '2026-04-01' },
  { id: 'jrn-a02', planta_id: 'plt-tmc', fecha: '2026-04-03', codigo: 'TMC-260403-1',
    tipos_poste: ['10-350', '11.5-600'], destino: 'SAESA', temperatura: 10, humedad_relativa: 68,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-2026-04-A', partida_aridos: 'AR-2026-Q2', lote_acero: 'AZ-2026-03',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-1', 'trb-3'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-3'], operadores_curado: ['trb-2'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hs-ep1', created_at: '2026-04-03' },
  { id: 'jrn-a03', planta_id: 'plt-tmc', fecha: '2026-04-04', codigo: 'TMC-260404-1',
    tipos_poste: ['10-600'], destino: 'otro_cliente', temperatura: 9, humedad_relativa: 72,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-2026-04-A', partida_aridos: 'AR-2026-Q2', lote_acero: 'AZ-2026-03',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-1'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-1'], operadores_curado: ['trb-3'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'producto_terminado', alertas: [], created_by: 'usr-hs-ep1', created_at: '2026-04-04' },

  // --- HORMISUR Parral ---
  { id: 'jrn-a04', planta_id: 'plt-prl', fecha: '2026-04-02', codigo: 'PRL-260402',
    tipos_poste: ['8.70-350', '10-600'], destino: 'SAESA', temperatura: 13, humedad_relativa: 60,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-PRL-2026-04', partida_aridos: 'AR-PRL-Q2', lote_acero: 'AZ-PRL-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-4'], operadores_moldaje: ['trb-5'], operadores_hormigonado: ['trb-6'], operadores_curado: ['trb-5'],
    jefe_planta_id: 'usr-hs-jp2', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hs-ep2', created_at: '2026-04-02' },
  { id: 'jrn-a05', planta_id: 'plt-prl', fecha: '2026-04-04', codigo: 'PRL-260404',
    tipos_poste: ['10-350'], destino: 'SAESA', temperatura: 12, humedad_relativa: 62,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-PRL-2026-04', partida_aridos: 'AR-PRL-Q2', lote_acero: 'AZ-PRL-2026-03',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-4'], operadores_moldaje: ['trb-5'], operadores_hormigonado: ['trb-4'], operadores_curado: ['trb-6'],
    jefe_planta_id: 'usr-hs-jp2', encargado_calidad_id: 'usr-hs-ec',
    estado: 'desmolde_registrado', alertas: [], created_by: 'usr-hs-ep2', created_at: '2026-04-04' },

  // --- HORMISUR Osorno ---
  { id: 'jrn-a06', planta_id: 'plt-osr', fecha: '2026-04-01', codigo: 'OSR-260401',
    tipos_poste: ['10-600', '11.5-1000'], destino: 'SAESA', temperatura: 8, humedad_relativa: 75,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-OSR-2026-04', partida_aridos: 'AR-OSR-Q2', lote_acero: 'AZ-OSR-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-13'], operadores_moldaje: ['trb-14'], operadores_hormigonado: ['trb-15'], operadores_curado: ['trb-14'],
    jefe_planta_id: 'usr-hs-jp3', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hs-ep3', created_at: '2026-04-01' },
  { id: 'jrn-a07', planta_id: 'plt-osr', fecha: '2026-04-03', codigo: 'OSR-260403',
    tipos_poste: ['10-350'], destino: 'SAESA', temperatura: 7, humedad_relativa: 78,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-OSR-2026-04', partida_aridos: 'AR-OSR-Q2', lote_acero: 'AZ-OSR-2026-03',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-13', 'trb-15'], operadores_moldaje: ['trb-14'], operadores_hormigonado: ['trb-15'], operadores_curado: ['trb-14'],
    jefe_planta_id: 'usr-hs-jp3', encargado_calidad_id: 'usr-hs-ec',
    estado: 'fabricacion_verificada', alertas: [], created_by: 'usr-hs-ep3', created_at: '2026-04-03' },

  // --- HORMIBAL Los Ángeles ---
  { id: 'jrn-a08', planta_id: 'plt-hbl', fecha: '2026-04-01', codigo: 'HBL-260401',
    tipos_poste: ['8.70-350', '10-600'], destino: 'SAESA', temperatura: 14, humedad_relativa: 55,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HBL-04', partida_aridos: 'AR-HBL-Q2', lote_acero: 'AZ-HBL-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-9'], operadores_moldaje: ['trb-9'], operadores_hormigonado: ['trb-9'], operadores_curado: ['trb-9'],
    jefe_planta_id: 'usr-hb-jp1', encargado_calidad_id: 'usr-hb-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hb-ep1', created_at: '2026-04-01' },
  { id: 'jrn-a09', planta_id: 'plt-hbl', fecha: '2026-04-03', codigo: 'HBL-260403',
    tipos_poste: ['10-350', '10-600'], destino: 'SAESA', temperatura: 15, humedad_relativa: 52,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HBL-04', partida_aridos: 'AR-HBL-Q2', lote_acero: 'AZ-HBL-03',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-9'], operadores_moldaje: ['trb-9'], operadores_hormigonado: ['trb-9'], operadores_curado: ['trb-9'],
    jefe_planta_id: 'usr-hb-jp1', encargado_calidad_id: 'usr-hb-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hb-ep1', created_at: '2026-04-03' },
  { id: 'jrn-a10', planta_id: 'plt-hbl', fecha: '2026-04-06', codigo: 'HBL-260406',
    tipos_poste: ['11.5-600'], destino: 'otro_cliente', temperatura: 13, humedad_relativa: 58,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HBL-04', partida_aridos: 'AR-HBL-Q2', lote_acero: 'AZ-HBL-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-9'], operadores_moldaje: ['trb-9'], operadores_hormigonado: ['trb-9'], operadores_curado: ['trb-9'],
    jefe_planta_id: 'usr-hb-jp1', encargado_calidad_id: 'usr-hb-ec',
    estado: 'abierta', alertas: [], created_by: 'usr-hb-ep1', created_at: '2026-04-06' },

  // --- HORMIBAL Frutillar ---
  { id: 'jrn-a11', planta_id: 'plt-frt', fecha: '2026-04-02', codigo: 'FRT-260402',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 10, humedad_relativa: 70,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FRT-2026-04', partida_aridos: 'AR-FRT-Q2', lote_acero: 'AZ-FRT-2026-03',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-16'], operadores_moldaje: ['trb-16'], operadores_hormigonado: ['trb-17'], operadores_curado: ['trb-17'],
    jefe_planta_id: 'usr-hb-jp2', encargado_calidad_id: 'usr-hb-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hb-ep2', created_at: '2026-04-02' },
  { id: 'jrn-a12', planta_id: 'plt-frt', fecha: '2026-04-04', codigo: 'FRT-260404',
    tipos_poste: ['8.70-350', '10-350'], destino: 'SAESA', temperatura: 9, humedad_relativa: 73,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FRT-2026-04', partida_aridos: 'AR-FRT-Q2', lote_acero: 'AZ-FRT-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-16', 'trb-17'], operadores_moldaje: ['trb-16'], operadores_hormigonado: ['trb-17'], operadores_curado: ['trb-16'],
    jefe_planta_id: 'usr-hb-jp2', encargado_calidad_id: 'usr-hb-ec',
    estado: 'producto_terminado', alertas: [], created_by: 'usr-hb-ep2', created_at: '2026-04-04' },

  // --- HORVAL Valdivia ---
  { id: 'jrn-a13', planta_id: 'plt-hvl', fecha: '2026-04-01', codigo: 'HVL-260401',
    tipos_poste: ['10-350', '10-600'], destino: 'SAESA', temperatura: 8, humedad_relativa: 74,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HVL-2026-04', partida_aridos: 'AR-HVL-Q2', lote_acero: 'AZ-HVL-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-18'], operadores_moldaje: ['trb-18'], operadores_hormigonado: ['trb-19'], operadores_curado: ['trb-19'],
    jefe_planta_id: 'usr-hv-jp1', encargado_calidad_id: 'usr-hv-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hv-ep1', created_at: '2026-04-01' },
  { id: 'jrn-a14', planta_id: 'plt-hvl', fecha: '2026-04-03', codigo: 'HVL-260403',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 7, humedad_relativa: 76,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HVL-2026-04', partida_aridos: 'AR-HVL-Q2', lote_acero: 'AZ-HVL-2026-03',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-18'], operadores_moldaje: ['trb-19'], operadores_hormigonado: ['trb-18'], operadores_curado: ['trb-19'],
    jefe_planta_id: 'usr-hv-jp1', encargado_calidad_id: 'usr-hv-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hv-ep1', created_at: '2026-04-03' },
  { id: 'jrn-a15', planta_id: 'plt-hvl', fecha: '2026-04-06', codigo: 'HVL-260406',
    tipos_poste: ['11.5-600'], destino: 'SAESA', temperatura: 6, humedad_relativa: 80,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HVL-2026-04', partida_aridos: 'AR-HVL-Q2', lote_acero: 'AZ-HVL-2026-03',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-18'], operadores_moldaje: ['trb-19'], operadores_hormigonado: ['trb-19'], operadores_curado: ['trb-18'],
    jefe_planta_id: 'usr-hv-jp1', encargado_calidad_id: 'usr-hv-ec',
    estado: 'fabricacion_verificada', alertas: [], created_by: 'usr-hv-ep1', created_at: '2026-04-06' },

  // --- HORNOR Coronel ---
  { id: 'jrn-a16', planta_id: 'plt-hnr', fecha: '2026-04-01', codigo: 'HNR-260401',
    tipos_poste: ['8.70-350', '10-600'], destino: 'SAESA', temperatura: 4, humedad_relativa: 82,
    medidas_proteccion: ['aditivos', 'agua_caliente'], lote_cemento: 'CB-HNR-2026-04', partida_aridos: 'AR-HNR-Q2', lote_acero: 'AZ-HNR-2026-03',
    cono_abrams_mm: 17, operadores_enfierradura: ['trb-20'], operadores_moldaje: ['trb-21'], operadores_hormigonado: ['trb-20'], operadores_curado: ['trb-21'],
    jefe_planta_id: 'usr-hn-jp1', encargado_calidad_id: 'usr-hn-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hn-ep1', created_at: '2026-04-01' },
  { id: 'jrn-a17', planta_id: 'plt-hnr', fecha: '2026-04-03', codigo: 'HNR-260403',
    tipos_poste: ['10-350'], destino: 'SAESA', temperatura: 3, humedad_relativa: 85,
    medidas_proteccion: ['aditivos', 'agua_caliente'], lote_cemento: 'CB-HNR-2026-04', partida_aridos: 'AR-HNR-Q2', lote_acero: 'AZ-HNR-2026-03',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-20'], operadores_moldaje: ['trb-21'], operadores_hormigonado: ['trb-21'], operadores_curado: ['trb-20'],
    jefe_planta_id: 'usr-hn-jp1', encargado_calidad_id: 'usr-hn-ec',
    estado: 'cerrada', alertas: ['Temperatura < 5°C sin medidas de protección adecuadas.'], visible_externo: true, created_by: 'usr-hn-ep1', created_at: '2026-04-03' },
  { id: 'jrn-a18', planta_id: 'plt-hnr', fecha: '2026-04-04', codigo: 'HNR-260404',
    tipos_poste: ['10-600'], destino: 'stock', temperatura: 5, humedad_relativa: 78,
    medidas_proteccion: ['aditivos'], lote_cemento: 'CB-HNR-2026-04', partida_aridos: 'AR-HNR-Q2', lote_acero: 'AZ-HNR-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-20'], operadores_moldaje: ['trb-21'], operadores_hormigonado: ['trb-20'], operadores_curado: ['trb-21'],
    jefe_planta_id: 'usr-hn-jp1', encargado_calidad_id: 'usr-hn-ec',
    estado: 'desmolde_registrado', alertas: [], created_by: 'usr-hn-ep1', created_at: '2026-04-04' },

  // --- FACORO Angol ---
  { id: 'jrn-a19', planta_id: 'plt-fco', fecha: '2026-04-01', codigo: 'FCO-260401',
    tipos_poste: ['10-350', '11.5-1000'], destino: 'SAESA', temperatura: 14, humedad_relativa: 50,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FCO-04', partida_aridos: 'AR-FCO-Q2', lote_acero: 'AZ-FCO-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-10'], operadores_moldaje: ['trb-10'], operadores_hormigonado: ['trb-10'], operadores_curado: ['trb-10'],
    jefe_planta_id: 'usr-fc-jp1', encargado_calidad_id: 'usr-fc-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-fc-ep1', created_at: '2026-04-01' },
  { id: 'jrn-a20', planta_id: 'plt-fco', fecha: '2026-04-03', codigo: 'FCO-260403',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 13, humedad_relativa: 54,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FCO-04', partida_aridos: 'AR-FCO-Q2', lote_acero: 'AZ-FCO-03',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-10'], operadores_moldaje: ['trb-10'], operadores_hormigonado: ['trb-10'], operadores_curado: ['trb-10'],
    jefe_planta_id: 'usr-fc-jp1', encargado_calidad_id: 'usr-fc-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-fc-ep1', created_at: '2026-04-03' },
  { id: 'jrn-a21', planta_id: 'plt-fco', fecha: '2026-04-06', codigo: 'FCO-260406',
    tipos_poste: ['8.70-350'], destino: 'otro_cliente', temperatura: 12, humedad_relativa: 56,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FCO-04', partida_aridos: 'AR-FCO-Q2', lote_acero: 'AZ-FCO-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-10'], operadores_moldaje: ['trb-10'], operadores_hormigonado: ['trb-10'], operadores_curado: ['trb-10'],
    jefe_planta_id: 'usr-fc-jp1', encargado_calidad_id: 'usr-fc-ec',
    estado: 'abierta', alertas: [], created_by: 'usr-fc-ep1', created_at: '2026-04-06' },

  // --- FACORO Puerto Varas ---
  { id: 'jrn-a22', planta_id: 'plt-fpa', fecha: '2026-04-02', codigo: 'FPA-260402',
    tipos_poste: ['10-350', '10-600'], destino: 'SAESA', temperatura: 9, humedad_relativa: 70,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FPA-2026-04', partida_aridos: 'AR-FPA-Q2', lote_acero: 'AZ-FPA-2026-03',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-22'], operadores_moldaje: ['trb-22'], operadores_hormigonado: ['trb-23'], operadores_curado: ['trb-23'],
    jefe_planta_id: 'usr-fc-jp2', encargado_calidad_id: 'usr-fc-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-fc-ep2', created_at: '2026-04-02' },
  { id: 'jrn-a23', planta_id: 'plt-fpa', fecha: '2026-04-04', codigo: 'FPA-260404',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 8, humedad_relativa: 72,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FPA-2026-04', partida_aridos: 'AR-FPA-Q2', lote_acero: 'AZ-FPA-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-22'], operadores_moldaje: ['trb-23'], operadores_hormigonado: ['trb-22'], operadores_curado: ['trb-23'],
    jefe_planta_id: 'usr-fc-jp2', encargado_calidad_id: 'usr-fc-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-fc-ep2', created_at: '2026-04-04' },

  // =============================================
  // MAYO 2026 — Narrativa de presentación (Planta Temuco)
  // =============================================

  // Lunes 12 — Lote 1: ciclo completo, cerrado y publicado al auditor
  { id: 'jrn-m01', planta_id: 'plt-tmc', fecha: '2026-05-12', codigo: 'TMC-260512-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 10, humedad_relativa: 72,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-2026-03-B', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-03', aditivo_detalle: 'Plastificante 0.5%',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-1'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-3'], operadores_curado: ['trb-5'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hs-ep1', created_at: '2026-05-12' },

  // Lunes 12 — Lote 2: desmoldado con hallazgo (demuestra multi-lote + NC)
  { id: 'jrn-m02', planta_id: 'plt-tmc', fecha: '2026-05-12', codigo: 'TMC-260512-2',
    tipos_poste: ['8.70-350'], destino: 'SAESA', temperatura: 10, humedad_relativa: 72,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-2026-03-B', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-03', aditivo_detalle: 'Plastificante 0.5%',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-6', 'trb-8'], operadores_moldaje: ['trb-7'], operadores_hormigonado: ['trb-3'], operadores_curado: ['trb-5'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'desmolde_registrado', alertas: [], created_by: 'usr-hs-ep1', created_at: '2026-05-12' },

  // Martes 13 — Lote 1: verificado, esperando desmolde
  { id: 'jrn-m03', planta_id: 'plt-tmc', fecha: '2026-05-13', codigo: 'TMC-260513-1',
    tipos_poste: ['11.5-1000'], destino: 'SAESA', temperatura: 8, humedad_relativa: 78,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-2026-03-B', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-03', aditivo_detalle: 'Plastificante 0.5%',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-1', 'trb-4'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-8'], operadores_curado: ['trb-3'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'fabricacion_verificada', alertas: [], created_by: 'usr-hs-ep1', created_at: '2026-05-13' },

  // Miércoles 14 — Lote 1: recién creado, pendiente verificación
  { id: 'jrn-m04', planta_id: 'plt-tmc', fecha: '2026-05-14', codigo: 'TMC-260514-1',
    tipos_poste: ['10-600', '13.5-1000'], destino: 'SAESA', temperatura: 7, humedad_relativa: 80,
    medidas_proteccion: ['mantas_termicas'], lote_cemento: 'CB-2026-03-B', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-03',
    cono_abrams_mm: 17, operadores_enfierradura: ['trb-6'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-3'], operadores_curado: ['trb-5'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'abierta', alertas: [], created_by: 'usr-hs-ep1', created_at: '2026-05-14' },

  // Miércoles 14 — Lote 2: segundo lote de la tarde, pendiente verificación
  { id: 'jrn-m05', planta_id: 'plt-tmc', fecha: '2026-05-14', codigo: 'TMC-260514-2',
    tipos_poste: ['8.70-350'], destino: 'SAESA', temperatura: 9, humedad_relativa: 76,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-2026-03-B', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-03', aditivo_detalle: 'Plastificante 0.5%',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-1'], operadores_moldaje: ['trb-7'], operadores_hormigonado: ['trb-8'], operadores_curado: ['trb-3'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'abierta', alertas: [], created_by: 'usr-hs-ep1', created_at: '2026-05-14' },

  // --- HORMISUR Parral (Mayo) ---
  { id: 'jrn-mp01', planta_id: 'plt-prl', fecha: '2026-05-07', codigo: 'PRL-260507-1',
    tipos_poste: ['10-350'], destino: 'SAESA', temperatura: 11, humedad_relativa: 66,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-PRL-2026-03', partida_aridos: 'AR-PRL-Q1', lote_acero: 'AZ-PRL-2026-02',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-11'], operadores_moldaje: ['trb-11'], operadores_hormigonado: ['trb-12'], operadores_curado: ['trb-12'],
    jefe_planta_id: 'usr-hs-jp2', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hs-jp2', created_at: '2026-05-07' },
  { id: 'jrn-mp02', planta_id: 'plt-prl', fecha: '2026-05-12', codigo: 'PRL-260512-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 9, humedad_relativa: 70,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-PRL-2026-03', partida_aridos: 'AR-PRL-Q1', lote_acero: 'AZ-PRL-2026-02',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-11'], operadores_moldaje: ['trb-12'], operadores_hormigonado: ['trb-11'], operadores_curado: ['trb-12'],
    jefe_planta_id: 'usr-hs-jp2', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hs-jp2', created_at: '2026-05-12' },

  // --- HORMISUR Osorno (Mayo) ---
  { id: 'jrn-mo01', planta_id: 'plt-osr', fecha: '2026-05-06', codigo: 'OSR-260506-1',
    tipos_poste: ['10-600', '11.5-1000'], destino: 'SAESA', temperatura: 7, humedad_relativa: 76,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-OSR-2026-03', partida_aridos: 'AR-OSR-Q1', lote_acero: 'AZ-OSR-2026-02',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-13'], operadores_moldaje: ['trb-14'], operadores_hormigonado: ['trb-15'], operadores_curado: ['trb-14'],
    jefe_planta_id: 'usr-hs-jp3', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hs-jp3', created_at: '2026-05-06' },
  { id: 'jrn-mo02', planta_id: 'plt-osr', fecha: '2026-05-12', codigo: 'OSR-260512-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 6, humedad_relativa: 78,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-OSR-2026-03', partida_aridos: 'AR-OSR-Q1', lote_acero: 'AZ-OSR-2026-02',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-13', 'trb-15'], operadores_moldaje: ['trb-14'], operadores_hormigonado: ['trb-15'], operadores_curado: ['trb-14'],
    jefe_planta_id: 'usr-hs-jp3', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hs-jp3', created_at: '2026-05-12' },

  // --- HORMIBAL Los Ángeles (Mayo) ---
  { id: 'jrn-mh01', planta_id: 'plt-hbl', fecha: '2026-05-05', codigo: 'HBL-260505-1',
    tipos_poste: ['8.70-350', '10-600'], destino: 'SAESA', temperatura: 12, humedad_relativa: 58,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HBL-04', partida_aridos: 'AR-HBL-Q2', lote_acero: 'AZ-HBL-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-9'], operadores_moldaje: ['trb-9'], operadores_hormigonado: ['trb-9'], operadores_curado: ['trb-9'],
    jefe_planta_id: 'usr-hb-jp1', encargado_calidad_id: 'usr-hb-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hb-ep1', created_at: '2026-05-05' },
  { id: 'jrn-mh02', planta_id: 'plt-hbl', fecha: '2026-05-12', codigo: 'HBL-260512-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 11, humedad_relativa: 60,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HBL-04', partida_aridos: 'AR-HBL-Q2', lote_acero: 'AZ-HBL-03',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-9'], operadores_moldaje: ['trb-9'], operadores_hormigonado: ['trb-9'], operadores_curado: ['trb-9'],
    jefe_planta_id: 'usr-hb-jp1', encargado_calidad_id: 'usr-hb-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hb-ep1', created_at: '2026-05-12' },

  // --- HORMIBAL Frutillar (Mayo) ---
  { id: 'jrn-mf01', planta_id: 'plt-frt', fecha: '2026-05-07', codigo: 'FRT-260507-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 8, humedad_relativa: 74,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FRT-2026-04', partida_aridos: 'AR-FRT-Q2', lote_acero: 'AZ-FRT-2026-03',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-16'], operadores_moldaje: ['trb-16'], operadores_hormigonado: ['trb-17'], operadores_curado: ['trb-17'],
    jefe_planta_id: 'usr-hb-jp2', encargado_calidad_id: 'usr-hb-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hb-ep2', created_at: '2026-05-07' },
  { id: 'jrn-mf02', planta_id: 'plt-frt', fecha: '2026-05-13', codigo: 'FRT-260513-1',
    tipos_poste: ['8.70-350'], destino: 'SAESA', temperatura: 7, humedad_relativa: 76,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FRT-2026-04', partida_aridos: 'AR-FRT-Q2', lote_acero: 'AZ-FRT-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-16', 'trb-17'], operadores_moldaje: ['trb-16'], operadores_hormigonado: ['trb-17'], operadores_curado: ['trb-16'],
    jefe_planta_id: 'usr-hb-jp2', encargado_calidad_id: 'usr-hb-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hb-ep2', created_at: '2026-05-13' },

  // --- HORVAL Valdivia (Mayo) ---
  { id: 'jrn-mv01', planta_id: 'plt-hvl', fecha: '2026-05-08', codigo: 'HVL-260508-1',
    tipos_poste: ['10-350', '10-600'], destino: 'SAESA', temperatura: 7, humedad_relativa: 74,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HVL-2026-04', partida_aridos: 'AR-HVL-Q2', lote_acero: 'AZ-HVL-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-18'], operadores_moldaje: ['trb-19'], operadores_hormigonado: ['trb-18'], operadores_curado: ['trb-19'],
    jefe_planta_id: 'usr-hv-jp1', encargado_calidad_id: 'usr-hv-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hv-ep1', created_at: '2026-05-08' },
  { id: 'jrn-mv02', planta_id: 'plt-hvl', fecha: '2026-05-12', codigo: 'HVL-260512-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 6, humedad_relativa: 78,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HVL-2026-04', partida_aridos: 'AR-HVL-Q2', lote_acero: 'AZ-HVL-2026-03',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-18'], operadores_moldaje: ['trb-18'], operadores_hormigonado: ['trb-19'], operadores_curado: ['trb-19'],
    jefe_planta_id: 'usr-hv-jp1', encargado_calidad_id: 'usr-hv-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hv-ep1', created_at: '2026-05-12' },

  // --- HORNOR Coronel (Mayo) ---
  { id: 'jrn-mn01', planta_id: 'plt-hnr', fecha: '2026-05-06', codigo: 'HNR-260506-1',
    tipos_poste: ['8.70-350', '10-600'], destino: 'SAESA', temperatura: 8, humedad_relativa: 72,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HNR-2026-04', partida_aridos: 'AR-HNR-Q2', lote_acero: 'AZ-HNR-2026-03',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-20'], operadores_moldaje: ['trb-21'], operadores_hormigonado: ['trb-20'], operadores_curado: ['trb-21'],
    jefe_planta_id: 'usr-hn-jp1', encargado_calidad_id: 'usr-hn-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hn-ep1', created_at: '2026-05-06' },
  { id: 'jrn-mn02', planta_id: 'plt-hnr', fecha: '2026-05-12', codigo: 'HNR-260512-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 7, humedad_relativa: 75,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HNR-2026-04', partida_aridos: 'AR-HNR-Q2', lote_acero: 'AZ-HNR-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-20'], operadores_moldaje: ['trb-21'], operadores_hormigonado: ['trb-21'], operadores_curado: ['trb-20'],
    jefe_planta_id: 'usr-hn-jp1', encargado_calidad_id: 'usr-hn-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-hn-ep1', created_at: '2026-05-12' },

  // --- FACORO Angol (Mayo) ---
  { id: 'jrn-mc01', planta_id: 'plt-fco', fecha: '2026-05-07', codigo: 'FCO-260507-1',
    tipos_poste: ['10-350', '11.5-1000'], destino: 'SAESA', temperatura: 11, humedad_relativa: 58,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FCO-04', partida_aridos: 'AR-FCO-Q2', lote_acero: 'AZ-FCO-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-10'], operadores_moldaje: ['trb-10'], operadores_hormigonado: ['trb-10'], operadores_curado: ['trb-10'],
    jefe_planta_id: 'usr-fc-jp1', encargado_calidad_id: 'usr-fc-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-fc-ep1', created_at: '2026-05-07' },
  { id: 'jrn-mc02', planta_id: 'plt-fco', fecha: '2026-05-12', codigo: 'FCO-260512-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 10, humedad_relativa: 62,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FCO-04', partida_aridos: 'AR-FCO-Q2', lote_acero: 'AZ-FCO-03',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-10'], operadores_moldaje: ['trb-10'], operadores_hormigonado: ['trb-10'], operadores_curado: ['trb-10'],
    jefe_planta_id: 'usr-fc-jp1', encargado_calidad_id: 'usr-fc-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-fc-ep1', created_at: '2026-05-12' },

  // --- FACORO Puerto Varas (Mayo) ---
  { id: 'jrn-mq01', planta_id: 'plt-fpa', fecha: '2026-05-08', codigo: 'FPA-260508-1',
    tipos_poste: ['10-350'], destino: 'SAESA', temperatura: 6, humedad_relativa: 78,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FPA-2026-04', partida_aridos: 'AR-FPA-Q2', lote_acero: 'AZ-FPA-2026-03',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-22'], operadores_moldaje: ['trb-22'], operadores_hormigonado: ['trb-23'], operadores_curado: ['trb-23'],
    jefe_planta_id: 'usr-fc-jp2', encargado_calidad_id: 'usr-fc-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-fc-ep2', created_at: '2026-05-08' },
  { id: 'jrn-mq02', planta_id: 'plt-fpa', fecha: '2026-05-13', codigo: 'FPA-260513-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 5, humedad_relativa: 80,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FPA-2026-04', partida_aridos: 'AR-FPA-Q2', lote_acero: 'AZ-FPA-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-22'], operadores_moldaje: ['trb-23'], operadores_hormigonado: ['trb-22'], operadores_curado: ['trb-23'],
    jefe_planta_id: 'usr-fc-jp2', encargado_calidad_id: 'usr-fc-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-fc-ep2', created_at: '2026-05-13' },

  // =============================================
  // MAYO 2026 — Lotes cerrados NO publicados (candado 🔒)
  // El presentador puede publicarlos en vivo durante la demo
  // =============================================
  { id: 'jrn-lk01', planta_id: 'plt-tmc', fecha: '2026-05-09', codigo: 'TMC-260509-1',
    tipos_poste: ['10-600', '8.70-350'], destino: 'SAESA', temperatura: 9, humedad_relativa: 74,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-2026-03-B', partida_aridos: 'AR-2026-Q1', lote_acero: 'AZ-2026-03', aditivo_detalle: 'Plastificante 0.5%',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-1', 'trb-6'], operadores_moldaje: ['trb-2'], operadores_hormigonado: ['trb-3'], operadores_curado: ['trb-5'],
    jefe_planta_id: 'usr-hs-jp1', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: false, created_by: 'usr-hs-ep1', created_at: '2026-05-09' },
  { id: 'jrn-lk02', planta_id: 'plt-prl', fecha: '2026-05-09', codigo: 'PRL-260509-1',
    tipos_poste: ['10-350'], destino: 'SAESA', temperatura: 10, humedad_relativa: 68,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-PRL-2026-03', partida_aridos: 'AR-PRL-Q1', lote_acero: 'AZ-PRL-2026-02',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-11'], operadores_moldaje: ['trb-12'], operadores_hormigonado: ['trb-11'], operadores_curado: ['trb-12'],
    jefe_planta_id: 'usr-hs-jp2', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: false, created_by: 'usr-hs-jp2', created_at: '2026-05-09' },
  { id: 'jrn-lk03', planta_id: 'plt-osr', fecha: '2026-05-08', codigo: 'OSR-260508-1',
    tipos_poste: ['11.5-1000'], destino: 'SAESA', temperatura: 6, humedad_relativa: 79,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-OSR-2026-03', partida_aridos: 'AR-OSR-Q1', lote_acero: 'AZ-OSR-2026-02',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-13'], operadores_moldaje: ['trb-14'], operadores_hormigonado: ['trb-15'], operadores_curado: ['trb-14'],
    jefe_planta_id: 'usr-hs-jp3', encargado_calidad_id: 'usr-hs-ec',
    estado: 'cerrada', alertas: [], visible_externo: false, created_by: 'usr-hs-jp3', created_at: '2026-05-08' },
  { id: 'jrn-lk04', planta_id: 'plt-hbl', fecha: '2026-05-08', codigo: 'HBL-260508-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 13, humedad_relativa: 56,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HBL-04', partida_aridos: 'AR-HBL-Q2', lote_acero: 'AZ-HBL-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-9'], operadores_moldaje: ['trb-9'], operadores_hormigonado: ['trb-9'], operadores_curado: ['trb-9'],
    jefe_planta_id: 'usr-hb-jp1', encargado_calidad_id: 'usr-hb-ec',
    estado: 'cerrada', alertas: [], visible_externo: false, created_by: 'usr-hb-ep1', created_at: '2026-05-08' },
  { id: 'jrn-lk05', planta_id: 'plt-frt', fecha: '2026-05-10', codigo: 'FRT-260510-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 7, humedad_relativa: 75,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FRT-2026-04', partida_aridos: 'AR-FRT-Q2', lote_acero: 'AZ-FRT-2026-03',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-16'], operadores_moldaje: ['trb-17'], operadores_hormigonado: ['trb-16'], operadores_curado: ['trb-17'],
    jefe_planta_id: 'usr-hb-jp2', encargado_calidad_id: 'usr-hb-ec',
    estado: 'cerrada', alertas: [], visible_externo: false, created_by: 'usr-hb-ep2', created_at: '2026-05-10' },
  { id: 'jrn-lk06', planta_id: 'plt-hvl', fecha: '2026-05-10', codigo: 'HVL-260510-1',
    tipos_poste: ['10-350'], destino: 'SAESA', temperatura: 6, humedad_relativa: 77,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-HVL-2026-04', partida_aridos: 'AR-HVL-Q2', lote_acero: 'AZ-HVL-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-18'], operadores_moldaje: ['trb-19'], operadores_hormigonado: ['trb-18'], operadores_curado: ['trb-19'],
    jefe_planta_id: 'usr-hv-jp1', encargado_calidad_id: 'usr-hv-ec',
    estado: 'cerrada', alertas: [], visible_externo: false, created_by: 'usr-hv-ep1', created_at: '2026-05-10' },
  { id: 'jrn-lk07', planta_id: 'plt-hnr', fecha: '2026-05-08', codigo: 'HNR-260508-1',
    tipos_poste: ['8.70-350', '10-600'], destino: 'SAESA', temperatura: 5, humedad_relativa: 80,
    medidas_proteccion: ['aditivos'], lote_cemento: 'CB-HNR-2026-04', partida_aridos: 'AR-HNR-Q2', lote_acero: 'AZ-HNR-2026-03',
    cono_abrams_mm: 17, operadores_enfierradura: ['trb-20'], operadores_moldaje: ['trb-21'], operadores_hormigonado: ['trb-20'], operadores_curado: ['trb-21'],
    jefe_planta_id: 'usr-hn-jp1', encargado_calidad_id: 'usr-hn-ec',
    estado: 'cerrada', alertas: [], visible_externo: false, created_by: 'usr-hn-ep1', created_at: '2026-05-08' },
  { id: 'jrn-lk08', planta_id: 'plt-fco', fecha: '2026-05-09', codigo: 'FCO-260509-1',
    tipos_poste: ['10-350'], destino: 'SAESA', temperatura: 12, humedad_relativa: 55,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FCO-04', partida_aridos: 'AR-FCO-Q2', lote_acero: 'AZ-FCO-03',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-10'], operadores_moldaje: ['trb-10'], operadores_hormigonado: ['trb-10'], operadores_curado: ['trb-10'],
    jefe_planta_id: 'usr-fc-jp1', encargado_calidad_id: 'usr-fc-ec',
    estado: 'cerrada', alertas: [], visible_externo: false, created_by: 'usr-fc-ep1', created_at: '2026-05-09' },
  { id: 'jrn-lk09', planta_id: 'plt-fpa', fecha: '2026-05-10', codigo: 'FPA-260510-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 5, humedad_relativa: 81,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-FPA-2026-04', partida_aridos: 'AR-FPA-Q2', lote_acero: 'AZ-FPA-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-22'], operadores_moldaje: ['trb-23'], operadores_hormigonado: ['trb-22'], operadores_curado: ['trb-23'],
    jefe_planta_id: 'usr-fc-jp2', encargado_calidad_id: 'usr-fc-ec',
    estado: 'cerrada', alertas: [], visible_externo: false, created_by: 'usr-fc-ep2', created_at: '2026-05-10' },

  // =============================================
  // RACSOL Coyhaique — mayo 2026
  // =============================================
  { id: 'jrn-rc01', planta_id: 'plt-rcl', fecha: '2026-05-06', codigo: 'RCL-260506-1',
    tipos_poste: ['10-350', '10-600'], destino: 'SAESA', temperatura: 11, humedad_relativa: 62,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-RCL-2026-04', partida_aridos: 'AR-RCL-Q2', lote_acero: 'AZ-RCL-2026-03',
    cono_abrams_mm: 15, operadores_enfierradura: ['trb-24'], operadores_moldaje: ['trb-25'], operadores_hormigonado: ['trb-24'], operadores_curado: ['trb-25'],
    jefe_planta_id: 'usr-rc-jp1', encargado_calidad_id: 'usr-rc-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-rc-ep1', created_at: '2026-05-06' },
  { id: 'jrn-rc02', planta_id: 'plt-rcl', fecha: '2026-05-12', codigo: 'RCL-260512-1',
    tipos_poste: ['10-600'], destino: 'SAESA', temperatura: 9, humedad_relativa: 70,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-RCL-2026-04', partida_aridos: 'AR-RCL-Q2', lote_acero: 'AZ-RCL-2026-03',
    cono_abrams_mm: 14, operadores_enfierradura: ['trb-26'], operadores_moldaje: ['trb-24'], operadores_hormigonado: ['trb-26'], operadores_curado: ['trb-25'],
    jefe_planta_id: 'usr-rc-jp1', encargado_calidad_id: 'usr-rc-ec',
    estado: 'cerrada', alertas: [], visible_externo: true, created_by: 'usr-rc-ep1', created_at: '2026-05-12' },
  { id: 'jrn-rc03', planta_id: 'plt-rcl', fecha: '2026-05-09', codigo: 'RCL-260509-1',
    tipos_poste: ['8.70-350'], destino: 'SAESA', temperatura: 10, humedad_relativa: 65,
    medidas_proteccion: ['ninguna_requerida'], lote_cemento: 'CB-RCL-2026-04', partida_aridos: 'AR-RCL-Q2', lote_acero: 'AZ-RCL-2026-03',
    cono_abrams_mm: 16, operadores_enfierradura: ['trb-24', 'trb-26'], operadores_moldaje: ['trb-25'], operadores_hormigonado: ['trb-24'], operadores_curado: ['trb-25'],
    jefe_planta_id: 'usr-rc-jp1', encargado_calidad_id: 'usr-rc-ec',
    estado: 'cerrada', alertas: [], visible_externo: false, created_by: 'usr-rc-ep1', created_at: '2026-05-09' },
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
    resultado: 'conforme', created_by: 'usr-hs-ep1',
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
    resultado: 'no_conforme', created_by: 'usr-hs-ep1',
  },
  // Hormibal LA jrn-11
  {
    id: 'ver-5', jornada_id: 'jrn-11', tipo_poste: '8.70-350', molde_id: 'mol-11', codigo_elemento: 'HBL-260328-01',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hb-ep1',
  },
  // Hormibal Frutillar jrn-12
  {
    id: 'ver-6', jornada_id: 'jrn-12', tipo_poste: '10-600', molde_id: 'mol-18', codigo_elemento: 'FRT-260327-01',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hb-ep2',
  },
  // Facoro Angol jrn-13
  {
    id: 'ver-7', jornada_id: 'jrn-13', tipo_poste: '10-350', molde_id: 'mol-13', codigo_elemento: 'FCO-260329-01',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-fc-ep1',
  },
  // Facoro Puerto Varas jrn-14
  {
    id: 'ver-8', jornada_id: 'jrn-14', tipo_poste: '10-600', molde_id: 'mol-25', codigo_elemento: 'FPA-260328-01',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-fc-ep2',
  },
  // Horval jrn-15
  {
    id: 'ver-9', jornada_id: 'jrn-15', tipo_poste: '10-350', molde_id: 'mol-20', codigo_elemento: 'HVL-260326-01',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hv-ep1',
  },
  // Hornor jrn-16
  {
    id: 'ver-10', jornada_id: 'jrn-16', tipo_poste: '10-600', molde_id: 'mol-23', codigo_elemento: 'HNR-260324-01',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hn-ep1',
  },
  // === ABRIL 2026 verificaciones ===
  // TMC-260401 (jrn-a01)
  { id: 'ver-a01', jornada_id: 'jrn-a01', tipo_poste: '8.70-350',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hs-ep1' },
  // TMC-260403 (jrn-a02)
  { id: 'ver-a02', jornada_id: 'jrn-a02', tipo_poste: '10-350',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hs-ep1' },
  // PRL-260402 (jrn-a04)
  { id: 'ver-a04', jornada_id: 'jrn-a04', tipo_poste: '8.70-350',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hs-ep2' },
  // OSR-260401 (jrn-a06)
  { id: 'ver-a06', jornada_id: 'jrn-a06', tipo_poste: '10-600',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hs-ep3' },
  // HBL-260401 (jrn-a08)
  { id: 'ver-a08', jornada_id: 'jrn-a08', tipo_poste: '8.70-350',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hb-ep1' },
  // HBL-260403 (jrn-a09)
  { id: 'ver-a09', jornada_id: 'jrn-a09', tipo_poste: '10-350',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hb-ep1' },
  // FRT-260402 (jrn-a11)
  { id: 'ver-a11', jornada_id: 'jrn-a11', tipo_poste: '10-600',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hb-ep2' },
  // HVL-260401 (jrn-a13)
  { id: 'ver-a13', jornada_id: 'jrn-a13', tipo_poste: '10-350',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hv-ep1' },
  // HVL-260403 (jrn-a14)
  { id: 'ver-a14', jornada_id: 'jrn-a14', tipo_poste: '10-600',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hv-ep1' },
  // HNR-260401 (jrn-a16)
  { id: 'ver-a16', jornada_id: 'jrn-a16', tipo_poste: '8.70-350',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hn-ep1' },
  // HNR-260403 (jrn-a17)
  { id: 'ver-a17', jornada_id: 'jrn-a17', tipo_poste: '10-350',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hn-ep1' },
  // FCO-260401 (jrn-a19)
  { id: 'ver-a19', jornada_id: 'jrn-a19', tipo_poste: '10-350',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-fc-ep1' },
  // FCO-260403 (jrn-a20)
  { id: 'ver-a20', jornada_id: 'jrn-a20', tipo_poste: '10-600',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-fc-ep1' },
  // FPA-260402 (jrn-a22)
  { id: 'ver-a22', jornada_id: 'jrn-a22', tipo_poste: '10-350',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-fc-ep2' },
  // FPA-260404 (jrn-a23)
  { id: 'ver-a23', jornada_id: 'jrn-a23', tipo_poste: '10-600',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-fc-ep2' },
  // === MAYO 2026 verificaciones ===
  // TMC-260512-1 (jrn-m01)
  { id: 'ver-m01', jornada_id: 'jrn-m01', tipo_poste: '10-600', molde_id: 'mol-3', codigo_elemento: 'TMC-260512-01',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hs-ep1' },
  // TMC-260512-2 (jrn-m02)
  { id: 'ver-m02', jornada_id: 'jrn-m02', tipo_poste: '8.70-350', molde_id: 'mol-1', codigo_elemento: 'TMC-260512-02',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hs-ep1' },
  // TMC-260513-1 (jrn-m03)
  { id: 'ver-m03', jornada_id: 'jrn-m03', tipo_poste: '11.5-1000', molde_id: 'mol-5', codigo_elemento: 'TMC-260513-01',
    arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C',
    arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C',
    mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C',
    mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C',
    hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C',
    hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C',
    resultado: 'conforme', created_by: 'usr-hs-ep1' },
  // === MAYO 2026 verificaciones (otras plantas) ===
  { id: 'ver-mp01', jornada_id: 'jrn-mp01', tipo_poste: '10-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hs-jp2' },
  { id: 'ver-mp02', jornada_id: 'jrn-mp02', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hs-jp2' },
  { id: 'ver-mo01', jornada_id: 'jrn-mo01', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hs-jp3' },
  { id: 'ver-mo02', jornada_id: 'jrn-mo02', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hs-jp3' },
  { id: 'ver-mh01', jornada_id: 'jrn-mh01', tipo_poste: '8.70-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hb-ep1' },
  { id: 'ver-mh02', jornada_id: 'jrn-mh02', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hb-ep1' },
  { id: 'ver-mf01', jornada_id: 'jrn-mf01', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hb-ep2' },
  { id: 'ver-mf02', jornada_id: 'jrn-mf02', tipo_poste: '8.70-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hb-ep2' },
  { id: 'ver-mv01', jornada_id: 'jrn-mv01', tipo_poste: '10-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hv-ep1' },
  { id: 'ver-mv02', jornada_id: 'jrn-mv02', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hv-ep1' },
  { id: 'ver-mn01', jornada_id: 'jrn-mn01', tipo_poste: '8.70-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hn-ep1' },
  { id: 'ver-mn02', jornada_id: 'jrn-mn02', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hn-ep1' },
  { id: 'ver-mc01', jornada_id: 'jrn-mc01', tipo_poste: '10-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-fc-ep1' },
  { id: 'ver-mc02', jornada_id: 'jrn-mc02', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-fc-ep1' },
  { id: 'ver-mq01', jornada_id: 'jrn-mq01', tipo_poste: '10-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-fc-ep2' },
  { id: 'ver-mq02', jornada_id: 'jrn-mq02', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-fc-ep2' },
  // === Verificaciones lotes bloqueados ===
  { id: 'ver-lk01', jornada_id: 'jrn-lk01', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hs-ep1' },
  { id: 'ver-lk02', jornada_id: 'jrn-lk02', tipo_poste: '10-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hs-jp2' },
  { id: 'ver-lk03', jornada_id: 'jrn-lk03', tipo_poste: '11.5-1000', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hs-jp3' },
  { id: 'ver-lk04', jornada_id: 'jrn-lk04', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hb-ep1' },
  { id: 'ver-lk05', jornada_id: 'jrn-lk05', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hb-ep2' },
  { id: 'ver-lk06', jornada_id: 'jrn-lk06', tipo_poste: '10-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hv-ep1' },
  { id: 'ver-lk07', jornada_id: 'jrn-lk07', tipo_poste: '8.70-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-hn-ep1' },
  { id: 'ver-lk08', jornada_id: 'jrn-lk08', tipo_poste: '10-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-fc-ep1' },
  { id: 'ver-lk09', jornada_id: 'jrn-lk09', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-fc-ep2' },
  // === RACSOL Chillán verificaciones ===
  { id: 'ver-rc01', jornada_id: 'jrn-rc01', tipo_poste: '10-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-rc-ep1' },
  { id: 'ver-rc02', jornada_id: 'jrn-rc02', tipo_poste: '10-600', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-rc-ep1' },
  { id: 'ver-rc03', jornada_id: 'jrn-rc03', tipo_poste: '8.70-350', arm_diametro_cantidades: 'C', arm_fierros_segun_plano: 'C', arm_dimensiones_fierros: 'C', arm_distanciamiento_estribos: 'C', arm_union_alambres: 'C', arm_sin_oxido: 'C', arm_ducto_puesta_tierra: 'C', mol_pernos_candados: 'C', mol_apuntalamiento: 'C', mol_estanqueidad: 'C', mol_alineamiento: 'C', mol_limpieza: 'C', mol_desmoldante: 'C', hor_equipos_vibrado: 'C', hor_armadura_completa: 'C', hor_recubrimiento: 'C', hor_bordes_llenado: 'C', hor_marcas_bajorrelieve: 'C', hor_retiro_bujes: 'C', hor_membrana_curado: 'C', resultado: 'conforme', created_by: 'usr-rc-ep1' },
];

// =============================================
// DESMOLDES
// =============================================

export const MOCK_DESMOLDES: RegistroDesmolde[] = [
  { id: 'des-1', jornada_id: 'jrn-1', fecha: '2026-03-21', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-ep1' },
  { id: 'des-2', jornada_id: 'jrn-2', fecha: '2026-03-22', eslinga_dos_puntos: true, defectos_detectados: true, observaciones: '1 poste con despunte menor en base', created_by: 'usr-hs-ep1' },
  { id: 'des-3', jornada_id: 'jrn-8', fecha: '2026-03-27', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-ep2' },
  { id: 'des-4', jornada_id: 'jrn-10', fecha: '2026-03-23', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-ep3' },
  { id: 'des-5', jornada_id: 'jrn-11', fecha: '2026-03-29', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hb-ep1' },
  { id: 'des-6', jornada_id: 'jrn-12', fecha: '2026-03-28', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hb-ep2' },
  { id: 'des-7', jornada_id: 'jrn-13', fecha: '2026-03-30', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-fc-ep1' },
  { id: 'des-8', jornada_id: 'jrn-14', fecha: '2026-03-29', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-fc-ep2' },
  { id: 'des-9', jornada_id: 'jrn-15', fecha: '2026-03-27', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hv-ep1' },
  { id: 'des-10', jornada_id: 'jrn-16', fecha: '2026-03-25', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hn-ep1' },
  // === ABRIL 2026 desmoldes ===
  { id: 'des-a01', jornada_id: 'jrn-a01', fecha: '2026-04-02', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-ep1' },
  { id: 'des-a02', jornada_id: 'jrn-a02', fecha: '2026-04-04', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-ep1' },
  { id: 'des-a04', jornada_id: 'jrn-a04', fecha: '2026-04-03', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-ep2' },
  { id: 'des-a05', jornada_id: 'jrn-a05', fecha: '2026-04-06', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-ep2' },
  { id: 'des-a06', jornada_id: 'jrn-a06', fecha: '2026-04-02', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-ep3' },
  { id: 'des-a08', jornada_id: 'jrn-a08', fecha: '2026-04-02', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hb-ep1' },
  { id: 'des-a09', jornada_id: 'jrn-a09', fecha: '2026-04-04', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hb-ep1' },
  { id: 'des-a11', jornada_id: 'jrn-a11', fecha: '2026-04-03', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hb-ep2' },
  { id: 'des-a13', jornada_id: 'jrn-a13', fecha: '2026-04-02', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hv-ep1' },
  { id: 'des-a14', jornada_id: 'jrn-a14', fecha: '2026-04-04', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hv-ep1' },
  { id: 'des-a16', jornada_id: 'jrn-a16', fecha: '2026-04-02', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hn-ep1' },
  { id: 'des-a17', jornada_id: 'jrn-a17', fecha: '2026-04-04', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hn-ep1' },
  { id: 'des-a18', jornada_id: 'jrn-a18', fecha: '2026-04-06', eslinga_dos_puntos: true, defectos_detectados: true, observaciones: 'Pequeña fisura superficial en zona de empotramiento', created_by: 'usr-hn-ep1' },
  { id: 'des-a19', jornada_id: 'jrn-a19', fecha: '2026-04-02', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-fc-ep1' },
  { id: 'des-a20', jornada_id: 'jrn-a20', fecha: '2026-04-04', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-fc-ep1' },
  { id: 'des-a22', jornada_id: 'jrn-a22', fecha: '2026-04-03', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-fc-ep2' },
  { id: 'des-a23', jornada_id: 'jrn-a23', fecha: '2026-04-06', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-fc-ep2' },
  // === MAYO 2026 desmoldes ===
  { id: 'des-m01', jornada_id: 'jrn-m01', fecha: '2026-05-13', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-ep1' },
  { id: 'des-m02', jornada_id: 'jrn-m02', fecha: '2026-05-13', eslinga_dos_puntos: true, defectos_detectados: true, observaciones: 'Despunte menor detectado en base del poste durante volteo', created_by: 'usr-hs-ep1' },
  // === MAYO 2026 desmoldes (otras plantas) ===
  { id: 'des-mp01', jornada_id: 'jrn-mp01', fecha: '2026-05-08', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-jp2' },
  { id: 'des-mp02', jornada_id: 'jrn-mp02', fecha: '2026-05-13', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-jp2' },
  { id: 'des-mo01', jornada_id: 'jrn-mo01', fecha: '2026-05-07', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-jp3' },
  { id: 'des-mo02', jornada_id: 'jrn-mo02', fecha: '2026-05-13', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-jp3' },
  { id: 'des-mh01', jornada_id: 'jrn-mh01', fecha: '2026-05-06', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hb-ep1' },
  { id: 'des-mh02', jornada_id: 'jrn-mh02', fecha: '2026-05-13', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hb-ep1' },
  { id: 'des-mf01', jornada_id: 'jrn-mf01', fecha: '2026-05-08', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hb-ep2' },
  { id: 'des-mf02', jornada_id: 'jrn-mf02', fecha: '2026-05-14', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hb-ep2' },
  { id: 'des-mv01', jornada_id: 'jrn-mv01', fecha: '2026-05-09', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hv-ep1' },
  { id: 'des-mv02', jornada_id: 'jrn-mv02', fecha: '2026-05-13', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hv-ep1' },
  { id: 'des-mn01', jornada_id: 'jrn-mn01', fecha: '2026-05-07', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hn-ep1' },
  { id: 'des-mn02', jornada_id: 'jrn-mn02', fecha: '2026-05-13', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hn-ep1' },
  { id: 'des-mc01', jornada_id: 'jrn-mc01', fecha: '2026-05-08', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-fc-ep1' },
  { id: 'des-mc02', jornada_id: 'jrn-mc02', fecha: '2026-05-13', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-fc-ep1' },
  { id: 'des-mq01', jornada_id: 'jrn-mq01', fecha: '2026-05-09', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-fc-ep2' },
  { id: 'des-mq02', jornada_id: 'jrn-mq02', fecha: '2026-05-14', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-fc-ep2' },
  // === Desmoldes lotes bloqueados ===
  { id: 'des-lk01', jornada_id: 'jrn-lk01', fecha: '2026-05-10', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-ep1' },
  { id: 'des-lk02', jornada_id: 'jrn-lk02', fecha: '2026-05-10', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-jp2' },
  { id: 'des-lk03', jornada_id: 'jrn-lk03', fecha: '2026-05-09', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hs-jp3' },
  { id: 'des-lk04', jornada_id: 'jrn-lk04', fecha: '2026-05-09', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hb-ep1' },
  { id: 'des-lk05', jornada_id: 'jrn-lk05', fecha: '2026-05-11', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hb-ep2' },
  { id: 'des-lk06', jornada_id: 'jrn-lk06', fecha: '2026-05-11', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hv-ep1' },
  { id: 'des-lk07', jornada_id: 'jrn-lk07', fecha: '2026-05-09', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-hn-ep1' },
  { id: 'des-lk08', jornada_id: 'jrn-lk08', fecha: '2026-05-10', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-fc-ep1' },
  { id: 'des-lk09', jornada_id: 'jrn-lk09', fecha: '2026-05-11', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-fc-ep2' },
  // === RACSOL desmoldes ===
  { id: 'des-rc01', jornada_id: 'jrn-rc01', fecha: '2026-05-07', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-rc-ep1' },
  { id: 'des-rc02', jornada_id: 'jrn-rc02', fecha: '2026-05-13', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-rc-ep1' },
  { id: 'des-rc03', jornada_id: 'jrn-rc03', fecha: '2026-05-10', eslinga_dos_puntos: true, defectos_detectados: false, created_by: 'usr-rc-ep1' },
];

// =============================================
// PRODUCTO TERMINADO
// =============================================

export const MOCK_PRODUCTO_TERMINADO: RegistroProductoTerminado[] = [
  {
    id: 'pt-1', jornada_id: 'jrn-1', fecha: '2026-03-24', metodo_curado: 'membrana_cavecur',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-ep1',
  },
  {
    id: 'pt-2', jornada_id: 'jrn-8', fecha: '2026-03-29', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-ep2',
  },
  {
    id: 'pt-3', jornada_id: 'jrn-10', fecha: '2026-03-27', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-ep3',
  },
  {
    id: 'pt-4', jornada_id: 'jrn-11', fecha: '2026-03-31', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hb-ep1',
  },
  {
    id: 'pt-5', jornada_id: 'jrn-12', fecha: '2026-03-30', metodo_curado: 'membrana_cavecur',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hb-ep2',
  },
  {
    id: 'pt-6', jornada_id: 'jrn-13', fecha: '2026-04-01', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-fc-ep1',
  },
  {
    id: 'pt-7', jornada_id: 'jrn-14', fecha: '2026-03-31', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-fc-ep2',
  },
  {
    id: 'pt-8', jornada_id: 'jrn-15', fecha: '2026-03-29', metodo_curado: 'membrana_cavecur',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hv-ep1',
  },
  {
    id: 'pt-9', jornada_id: 'jrn-16', fecha: '2026-03-27', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hn-ep1',
  },
  // === ABRIL 2026 producto terminado ===
  { id: 'pt-a01', jornada_id: 'jrn-a01', fecha: '2026-04-04', metodo_curado: 'membrana_cavecur',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-ep1' },
  { id: 'pt-a02', jornada_id: 'jrn-a02', fecha: '2026-04-06', metodo_curado: 'membrana_cavecur',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-ep1' },
  { id: 'pt-a04', jornada_id: 'jrn-a04', fecha: '2026-04-04', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-ep2' },
  { id: 'pt-a06', jornada_id: 'jrn-a06', fecha: '2026-04-03', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-ep3' },
  { id: 'pt-a08', jornada_id: 'jrn-a08', fecha: '2026-04-03', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hb-ep1' },
  { id: 'pt-a09', jornada_id: 'jrn-a09', fecha: '2026-04-06', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hb-ep1' },
  { id: 'pt-a11', jornada_id: 'jrn-a11', fecha: '2026-04-04', metodo_curado: 'membrana_cavecur',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hb-ep2' },
  { id: 'pt-a13', jornada_id: 'jrn-a13', fecha: '2026-04-03', metodo_curado: 'membrana_cavecur',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hv-ep1' },
  { id: 'pt-a14', jornada_id: 'jrn-a14', fecha: '2026-04-06', metodo_curado: 'membrana_cavecur',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hv-ep1' },
  { id: 'pt-a16', jornada_id: 'jrn-a16', fecha: '2026-04-03', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hn-ep1' },
  { id: 'pt-a17', jornada_id: 'jrn-a17', fecha: '2026-04-06', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hn-ep1' },
  { id: 'pt-a19', jornada_id: 'jrn-a19', fecha: '2026-04-03', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-fc-ep1' },
  { id: 'pt-a20', jornada_id: 'jrn-a20', fecha: '2026-04-06', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-fc-ep1' },
  { id: 'pt-a22', jornada_id: 'jrn-a22', fecha: '2026-04-04', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-fc-ep2' },
  { id: 'pt-a23', jornada_id: 'jrn-a23', fecha: '2026-04-06', metodo_curado: 'riego_manual',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-fc-ep2' },
  // === MAYO 2026 producto terminado ===
  { id: 'pt-m01', jornada_id: 'jrn-m01', fecha: '2026-05-14', metodo_curado: 'membrana_cavecur',
    pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C',
    pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C',
    resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-ep1' },
  // === MAYO 2026 producto terminado (otras plantas) ===
  { id: 'pt-mp01', jornada_id: 'jrn-mp01', fecha: '2026-05-09', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-jp2' },
  { id: 'pt-mp02', jornada_id: 'jrn-mp02', fecha: '2026-05-14', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-jp2' },
  { id: 'pt-mo01', jornada_id: 'jrn-mo01', fecha: '2026-05-08', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-jp3' },
  { id: 'pt-mo02', jornada_id: 'jrn-mo02', fecha: '2026-05-14', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-jp3' },
  { id: 'pt-mh01', jornada_id: 'jrn-mh01', fecha: '2026-05-07', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hb-ep1' },
  { id: 'pt-mh02', jornada_id: 'jrn-mh02', fecha: '2026-05-13', metodo_curado: 'membrana_cavecur', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hb-ep1' },
  { id: 'pt-mf01', jornada_id: 'jrn-mf01', fecha: '2026-05-09', metodo_curado: 'membrana_cavecur', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hb-ep2' },
  { id: 'pt-mf02', jornada_id: 'jrn-mf02', fecha: '2026-05-14', metodo_curado: 'membrana_cavecur', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hb-ep2' },
  { id: 'pt-mv01', jornada_id: 'jrn-mv01', fecha: '2026-05-10', metodo_curado: 'membrana_cavecur', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hv-ep1' },
  { id: 'pt-mv02', jornada_id: 'jrn-mv02', fecha: '2026-05-14', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hv-ep1' },
  { id: 'pt-mn01', jornada_id: 'jrn-mn01', fecha: '2026-05-08', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hn-ep1' },
  { id: 'pt-mn02', jornada_id: 'jrn-mn02', fecha: '2026-05-14', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hn-ep1' },
  { id: 'pt-mc01', jornada_id: 'jrn-mc01', fecha: '2026-05-09', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-fc-ep1' },
  { id: 'pt-mc02', jornada_id: 'jrn-mc02', fecha: '2026-05-13', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-fc-ep1' },
  { id: 'pt-mq01', jornada_id: 'jrn-mq01', fecha: '2026-05-10', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-fc-ep2' },
  { id: 'pt-mq02', jornada_id: 'jrn-mq02', fecha: '2026-05-14', metodo_curado: 'membrana_cavecur', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-fc-ep2' },
  // === PT lotes bloqueados ===
  { id: 'pt-lk01', jornada_id: 'jrn-lk01', fecha: '2026-05-11', metodo_curado: 'membrana_cavecur', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-ep1' },
  { id: 'pt-lk02', jornada_id: 'jrn-lk02', fecha: '2026-05-11', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-jp2' },
  { id: 'pt-lk03', jornada_id: 'jrn-lk03', fecha: '2026-05-10', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hs-jp3' },
  { id: 'pt-lk04', jornada_id: 'jrn-lk04', fecha: '2026-05-10', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hb-ep1' },
  { id: 'pt-lk05', jornada_id: 'jrn-lk05', fecha: '2026-05-12', metodo_curado: 'membrana_cavecur', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hb-ep2' },
  { id: 'pt-lk06', jornada_id: 'jrn-lk06', fecha: '2026-05-12', metodo_curado: 'membrana_cavecur', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hv-ep1' },
  { id: 'pt-lk07', jornada_id: 'jrn-lk07', fecha: '2026-05-10', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-hn-ep1' },
  { id: 'pt-lk08', jornada_id: 'jrn-lk08', fecha: '2026-05-11', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-fc-ep1' },
  { id: 'pt-lk09', jornada_id: 'jrn-lk09', fecha: '2026-05-12', metodo_curado: 'membrana_cavecur', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-fc-ep2' },
  // === RACSOL PT ===
  { id: 'pt-rc01', jornada_id: 'jrn-rc01', fecha: '2026-05-08', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-rc-ep1' },
  { id: 'pt-rc02', jornada_id: 'jrn-rc02', fecha: '2026-05-13', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-rc-ep1' },
  { id: 'pt-rc03', jornada_id: 'jrn-rc03', fecha: '2026-05-11', metodo_curado: 'riego_manual', pt_sin_hallazgos_estructurales: 'C', pt_marcas_bajorrelieve: 'C', pt_eslinga_tenazas: 'C', pt_acopio_listones: 'C', pt_acopio_sin_hallazgos: 'C', pt_pintado: 'C', resultado: 'conforme', nc_detectadas: false, liberacion_confirmada: true, created_by: 'usr-rc-ep1' },
];

// =============================================
// NO CONFORMIDADES
// =============================================

export const MOCK_NC: NoConformidad[] = [
  {
    id: 'nc-1', planta_id: 'plt-tmc', numero: 'TMC-2026-001', nivel: 'producto', jornada_id: 'jrn-1',
    fecha_deteccion: '2026-03-20', origen: 'verificacion_fabricacion', tipo_poste: '10-600',
    molde_id: 'mol-3', tipo_defecto: 'otro', detalle: 'Óxido grado C detectado en barra de refuerzo',
    accion_inmediata: 'Limpieza manual de la barra', disposicion: 'liberar_concesion', apto_saesa: true,
    estado: 'cerrada', fecha_cierre: '2026-03-20', created_by: 'usr-hs-ep1',
  },
  {
    id: 'nc-2', planta_id: 'plt-tmc', numero: 'TMC-2026-002', nivel: 'producto', jornada_id: 'jrn-2',
    fecha_deteccion: '2026-03-22', origen: 'desmolde', tipo_poste: '10-600',
    molde_id: 'mol-4', tipo_defecto: 'despunte_desprendimiento', detalle: 'Despunte menor en base del poste',
    accion_inmediata: 'Segregación del poste', disposicion: 'reparar', apto_saesa: false,
    estado: 'abierta', created_by: 'usr-hs-ep1',
  },
  {
    id: 'nc-3', planta_id: 'plt-tmc', numero: 'TMC-2026-003', nivel: 'proceso',
    fecha_deteccion: '2026-03-23', origen: 'manual', tipo_defecto: 'fisura_superficial',
    detalle: 'Fisura superficial detectada en poste de stock', ancho_fisura_mm: 0.15,
    disposicion: 'liberar_concesion', apto_saesa: true,
    estado: 'abierta', created_by: 'usr-hs-ec',
  },
  // FACORO NC
  {
    id: 'nc-4', planta_id: 'plt-fco', numero: 'FCO-2026-001', nivel: 'producto',
    fecha_deteccion: '2026-03-26', origen: 'verificacion_fabricacion', tipo_poste: '10-350',
    tipo_defecto: 'nido', detalle: 'Nido detectado en zona de empotramiento',
    accion_inmediata: 'Segregación', disposicion: 'reparar', apto_saesa: false,
    estado: 'abierta', created_by: 'usr-fc-ep1',
  },
  // HORMISUR Parral NC
  {
    id: 'nc-5', planta_id: 'plt-prl', numero: 'PRL-2026-001', nivel: 'producto', jornada_id: 'jrn-5',
    fecha_deteccion: '2026-03-24', origen: 'desmolde', tipo_poste: '10-600',
    molde_id: 'mol-10', tipo_defecto: 'fisura_superficial', detalle: 'Fisura superficial en zona de empotramiento',
    accion_inmediata: 'Segregación del elemento', disposicion: 'reparar', apto_saesa: false,
    estado: 'abierta', created_by: 'usr-hs-jp2',
  },
  // === MAYO 2026 NC ===
  {
    id: 'nc-m01', planta_id: 'plt-tmc', numero: 'TMC-2026-004', nivel: 'producto', jornada_id: 'jrn-m02',
    fecha_deteccion: '2026-05-13', origen: 'desmolde', tipo_poste: '8.70-350',
    molde_id: 'mol-1', tipo_defecto: 'despunte_desprendimiento', detalle: 'Despunte menor en base del poste detectado durante desmolde del lote TMC-260512-2',
    accion_inmediata: 'Segregación del poste para evaluación', disposicion: 'reparar', apto_saesa: false,
    estado: 'abierta', created_by: 'usr-hs-ep1',
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
  { id: 'ens-1', planta_id: 'plt-tmc', jornada_id: 'jrn-1', fecha_muestra: '2026-02-15', tipo_hormigon: 'H-35', resultado_7d_mpa: 22.5, resultado_28d_mpa: 33.2, laboratorio: 'Lab. Materiales Temuco', cumple: true, created_by: 'usr-hs-ec' },
  { id: 'ens-2', planta_id: 'plt-tmc', fecha_muestra: '2026-01-20', tipo_hormigon: 'H-35', resultado_7d_mpa: 21.0, resultado_28d_mpa: 31.8, laboratorio: 'Lab. Materiales Temuco', cumple: true, created_by: 'usr-hs-ec' },
  { id: 'ens-3', planta_id: 'plt-tmc', fecha_muestra: '2025-12-15', tipo_hormigon: 'H-35', resultado_7d_mpa: 20.3, resultado_28d_mpa: 30.1, laboratorio: 'Lab. Materiales Temuco', cumple: true, created_by: 'usr-hs-ec' },
  { id: 'ens-4', planta_id: 'plt-tmc', fecha_muestra: '2025-11-18', tipo_hormigon: 'H-35', resultado_7d_mpa: 19.8, resultado_28d_mpa: 28.5, laboratorio: 'Lab. Materiales Temuco', cumple: true, created_by: 'usr-hs-ec' },
  { id: 'ens-5', planta_id: 'plt-prl', jornada_id: 'jrn-8', fecha_muestra: '2026-02-28', tipo_hormigon: 'H-30', resultado_7d_mpa: 18.2, resultado_28d_mpa: 27.0, laboratorio: 'Lab. Materiales Linares', cumple: true, created_by: 'usr-hs-ec' },
  { id: 'ens-6', planta_id: 'plt-hbl', fecha_muestra: '2026-03-10', tipo_hormigon: 'H-35', resultado_7d_mpa: 23.1, resultado_28d_mpa: 34.0, laboratorio: 'Lab. Materiales Biobío', cumple: true, created_by: 'usr-hb-ec' },
  { id: 'ens-7', planta_id: 'plt-osr', jornada_id: 'jrn-10', fecha_muestra: '2026-03-01', tipo_hormigon: 'H-35', resultado_7d_mpa: 22.0, resultado_28d_mpa: 32.5, laboratorio: 'Lab. Materiales Osorno', cumple: true, created_by: 'usr-hs-ec' },
  { id: 'ens-8', planta_id: 'plt-osr', fecha_muestra: '2026-02-10', tipo_hormigon: 'H-35', resultado_7d_mpa: 20.8, resultado_28d_mpa: 31.0, laboratorio: 'Lab. Materiales Osorno', cumple: true, created_by: 'usr-hs-ec' },
  // Nuevas empresas
  { id: 'ens-9', planta_id: 'plt-hbl', jornada_id: 'jrn-11', fecha_muestra: '2026-03-15', tipo_hormigon: 'H-35', resultado_7d_mpa: 22.8, resultado_28d_mpa: 33.5, laboratorio: 'Lab. Materiales Biobío', cumple: true, created_by: 'usr-hb-ec' },
  { id: 'ens-10', planta_id: 'plt-frt', jornada_id: 'jrn-12', fecha_muestra: '2026-03-12', tipo_hormigon: 'H-35', resultado_7d_mpa: 21.5, resultado_28d_mpa: 32.0, laboratorio: 'Lab. Materiales Puerto Montt', cumple: true, created_by: 'usr-hb-ec' },
  { id: 'ens-11', planta_id: 'plt-fco', jornada_id: 'jrn-13', fecha_muestra: '2026-03-18', tipo_hormigon: 'H-35', resultado_7d_mpa: 23.0, resultado_28d_mpa: 34.2, laboratorio: 'Lab. Materiales Temuco', cumple: true, created_by: 'usr-fc-ec' },
  { id: 'ens-12', planta_id: 'plt-fpa', jornada_id: 'jrn-14', fecha_muestra: '2026-03-14', tipo_hormigon: 'H-35', resultado_7d_mpa: 20.5, resultado_28d_mpa: 30.8, laboratorio: 'Lab. Materiales Puerto Montt', cumple: true, created_by: 'usr-fc-ec' },
  { id: 'ens-13', planta_id: 'plt-hvl', jornada_id: 'jrn-15', fecha_muestra: '2026-03-10', tipo_hormigon: 'H-35', resultado_7d_mpa: 22.2, resultado_28d_mpa: 33.0, laboratorio: 'Lab. Materiales Valdivia', cumple: true, created_by: 'usr-hv-ec' },
  { id: 'ens-14', planta_id: 'plt-hnr', jornada_id: 'jrn-16', fecha_muestra: '2026-03-08', tipo_hormigon: 'H-35', resultado_7d_mpa: 21.8, resultado_28d_mpa: 32.6, laboratorio: 'Lab. Materiales Coyhaique', cumple: true, created_by: 'usr-hn-ec' },
];

