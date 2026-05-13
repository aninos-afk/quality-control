'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type {
  Empresa, Planta, Molde, Trabajador, CondicionHabilitante,
  Jornada, VerificacionFabricacion, RegistroDesmolde,
  RegistroProductoTerminado, NoConformidad, AccionCorrectiva,
  EnsayoCompresion, AuditLogEntry, ObservacionAuditor, Usuario,
  MaterialActivo,
} from './types';
import {
  MOCK_EMPRESAS, MOCK_PLANTAS, MOCK_USUARIOS, MOCK_MOLDES, MOCK_TRABAJADORES,
  MOCK_CONDICIONES, MOCK_JORNADAS, MOCK_VERIFICACIONES,
  MOCK_DESMOLDES, MOCK_PRODUCTO_TERMINADO, MOCK_NC,
  MOCK_AC, MOCK_ENSAYOS, MOCK_MATERIALES,
} from './mock-data';

// =============================================
// PERSISTENCIA EN localStorage
// Versión: incrementar si cambia el schema de datos
// para forzar reinicio limpio en clientes existentes.
// =============================================
const STORAGE_VERSION = 'qc_v11';
const SK = (key: string) => `${STORAGE_VERSION}_${key}`;

function fromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(SK(key));
    if (raw !== null) return JSON.parse(raw) as T;
  } catch {
    // Si el JSON está corrupto, ignorar y usar fallback
  }
  return fallback;
}

function toStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SK(key), JSON.stringify(value));
  } catch {
    // localStorage lleno u otro error — silencioso
  }
}

interface AppState {
  // Data
  empresas: Empresa[];
  plantas: Planta[];
  usuarios: Usuario[];
  moldes: Molde[];
  trabajadores: Trabajador[];
  condiciones: CondicionHabilitante[];
  materiales: MaterialActivo[];
  jornadas: Jornada[];
  verificaciones: VerificacionFabricacion[];
  desmoldes: RegistroDesmolde[];
  productoTerminado: RegistroProductoTerminado[];
  noConformidades: NoConformidad[];
  accionesCorrectivas: AccionCorrectiva[];
  ensayos: EnsayoCompresion[];
  auditLog: AuditLogEntry[];
  observaciones: ObservacionAuditor[];
  // Helpers
  getEmpresa: (id: string) => Empresa | undefined;
  getPlanta: (id: string) => Planta | undefined;
  getPlantasByEmpresa: (empresaId: string) => Planta[];
  getJornada: (id: string) => Jornada | undefined;
  getJornadasByPlanta: (plantaId: string) => Jornada[];
  getVerificacionesByJornada: (jornadaId: string) => VerificacionFabricacion[];
  getDesmoldeByJornada: (jornadaId: string) => RegistroDesmolde | undefined;
  getProductoTerminadoByJornada: (jornadaId: string) => RegistroProductoTerminado | undefined;
  getNCByPlanta: (plantaId: string) => NoConformidad[];
  getNCByJornada: (jornadaId: string) => NoConformidad[];
  getCondicionesByPlanta: (plantaId: string) => CondicionHabilitante[];
  getEnsayosByPlanta: (plantaId: string) => EnsayoCompresion[];
  getMoldesByPlanta: (plantaId: string) => Molde[];
  getTrabajadoresByPlanta: (plantaId: string) => Trabajador[];
  getObservacionesByPlanta: (plantaId: string) => ObservacionAuditor[];
  getMaterialesByPlanta: (plantaId: string) => MaterialActivo[];
  // Mutations
  addJornada: (jornada: Jornada) => void;
  updateJornada: (id: string, updates: Partial<Jornada>) => void;
  addVerificacion: (verificacion: VerificacionFabricacion) => void;
  replaceVerificacionesByJornada: (jornadaId: string, nuevas: VerificacionFabricacion[]) => void;
  addDesmolde: (desmolde: RegistroDesmolde) => void;
  addProductoTerminado: (pt: RegistroProductoTerminado) => void;
  addNC: (nc: NoConformidad) => void;
  updateNC: (id: string, updates: Partial<NoConformidad>) => void;
  addEnsayo: (ensayo: EnsayoCompresion) => void;
  addCondicion: (condicion: CondicionHabilitante) => void;
  updateCondicion: (id: string, updates: Partial<CondicionHabilitante>) => void;
  deleteCondicion: (id: string) => void;
  addMolde: (molde: Molde) => void;
  updateMolde: (id: string, updates: Partial<Molde>) => void;
  addTrabajador: (trabajador: Trabajador) => void;
  updateTrabajador: (id: string, updates: Partial<Trabajador>) => void;
  addAuditLog: (entry: AuditLogEntry) => void;
  addObservacion: (obs: ObservacionAuditor) => void;
  addMaterial: (material: MaterialActivo) => void;
  updateMaterial: (id: string, updates: Partial<MaterialActivo>) => void;
  // Refresh
  refreshFromStorage: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Datos estáticos (no cambian en runtime, no necesitan persistencia)
  const [empresas] = useState<Empresa[]>(MOCK_EMPRESAS);
  const [plantas] = useState<Planta[]>(MOCK_PLANTAS);
  const [usuarios] = useState<Usuario[]>(MOCK_USUARIOS);

  // Datos operacionales — inicializan desde localStorage si existe, sino desde mock-data
  const [moldes, setMoldes] = useState<Molde[]>(() => fromStorage('moldes', MOCK_MOLDES));
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>(() => fromStorage('trabajadores', MOCK_TRABAJADORES));
  const [condiciones, setCondiciones] = useState<CondicionHabilitante[]>(() => fromStorage('condiciones', MOCK_CONDICIONES));
  const [materiales, setMateriales] = useState<MaterialActivo[]>(() => fromStorage('materiales', MOCK_MATERIALES));
  const [jornadas, setJornadas] = useState<Jornada[]>(() => fromStorage('jornadas', MOCK_JORNADAS));
  const [verificaciones, setVerificaciones] = useState<VerificacionFabricacion[]>(() => fromStorage('verificaciones', MOCK_VERIFICACIONES));
  const [desmoldes, setDesmoldes] = useState<RegistroDesmolde[]>(() => fromStorage('desmoldes', MOCK_DESMOLDES));
  const [productoTerminado, setProductoTerminado] = useState<RegistroProductoTerminado[]>(() => fromStorage('productoTerminado', MOCK_PRODUCTO_TERMINADO));
  const [noConformidades, setNC] = useState<NoConformidad[]>(() => fromStorage('noConformidades', MOCK_NC));
  const [accionesCorrectivas] = useState<AccionCorrectiva[]>(MOCK_AC);
  const [ensayos, setEnsayos] = useState<EnsayoCompresion[]>(() => fromStorage('ensayos', MOCK_ENSAYOS));
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => fromStorage('auditLog', []));
  const [observaciones, setObservaciones] = useState<ObservacionAuditor[]>(() => fromStorage('observaciones', []));

  // Persistir automáticamente cada colección cuando cambia
  useEffect(() => { toStorage('moldes', moldes); }, [moldes]);
  useEffect(() => { toStorage('trabajadores', trabajadores); }, [trabajadores]);
  useEffect(() => { toStorage('condiciones', condiciones); }, [condiciones]);
  useEffect(() => { toStorage('materiales', materiales); }, [materiales]);
  useEffect(() => { toStorage('jornadas', jornadas); }, [jornadas]);
  useEffect(() => { toStorage('verificaciones', verificaciones); }, [verificaciones]);
  useEffect(() => { toStorage('desmoldes', desmoldes); }, [desmoldes]);
  useEffect(() => { toStorage('productoTerminado', productoTerminado); }, [productoTerminado]);
  useEffect(() => { toStorage('noConformidades', noConformidades); }, [noConformidades]);
  useEffect(() => { toStorage('ensayos', ensayos); }, [ensayos]);
  useEffect(() => { toStorage('auditLog', auditLog); }, [auditLog]);
  useEffect(() => { toStorage('observaciones', observaciones); }, [observaciones]);

  // Helpers
  const getEmpresa = useCallback((id: string) => empresas.find(e => e.id === id), [empresas]);
  const getPlanta = useCallback((id: string) => plantas.find(p => p.id === id), [plantas]);
  const getPlantasByEmpresa = useCallback((eId: string) => plantas.filter(p => p.empresa_id === eId), [plantas]);
  const getJornada = useCallback((id: string) => jornadas.find(j => j.id === id), [jornadas]);
  const getJornadasByPlanta = useCallback((pId: string) => jornadas.filter(j => j.planta_id === pId), [jornadas]);
  const getVerificacionesByJornada = useCallback((jId: string) => verificaciones.filter(v => v.jornada_id === jId), [verificaciones]);
  const getDesmoldeByJornada = useCallback((jId: string) => desmoldes.find(d => d.jornada_id === jId), [desmoldes]);
  const getProductoTerminadoByJornada = useCallback((jId: string) => productoTerminado.find(pt => pt.jornada_id === jId), [productoTerminado]);
  const getNCByPlanta = useCallback((pId: string) => noConformidades.filter(nc => nc.planta_id === pId), [noConformidades]);
  const getNCByJornada = useCallback((jId: string) => noConformidades.filter(nc => nc.jornada_id === jId), [noConformidades]);
  const getCondicionesByPlanta = useCallback((pId: string) => condiciones.filter(c => c.planta_id === pId), [condiciones]);
  const getEnsayosByPlanta = useCallback((pId: string) => ensayos.filter(e => e.planta_id === pId), [ensayos]);
  const getMoldesByPlanta = useCallback((pId: string) => moldes.filter(m => m.planta_id === pId), [moldes]);
  const getTrabajadoresByPlanta = useCallback((pId: string) => trabajadores.filter(t => t.planta_id === pId), [trabajadores]);
  const getObservacionesByPlanta = useCallback((pId: string) => observaciones.filter(o => o.planta_id === pId), [observaciones]);
  const getMaterialesByPlanta = useCallback((pId: string) => materiales.filter(m => m.planta_id === pId), [materiales]);

  // Mutations
  const addJornada = useCallback((j: Jornada) => setJornadas(prev => [j, ...prev]), []);
  const updateJornada = useCallback((id: string, updates: Partial<Jornada>) =>
    setJornadas(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j)), []);
  const addVerificacion = useCallback((v: VerificacionFabricacion) => setVerificaciones(prev => [...prev, v]), []);
  const replaceVerificacionesByJornada = useCallback((jornadaId: string, nuevas: VerificacionFabricacion[]) =>
    setVerificaciones(prev => [...prev.filter(v => v.jornada_id !== jornadaId), ...nuevas]), []);
  const addDesmolde = useCallback((d: RegistroDesmolde) => setDesmoldes(prev => [...prev, d]), []);
  const addProductoTerminado = useCallback((pt: RegistroProductoTerminado) => setProductoTerminado(prev => [...prev, pt]), []);
  const addNC = useCallback((nc: NoConformidad) => setNC(prev => [...prev, nc]), []);
  const updateNC = useCallback((id: string, updates: Partial<NoConformidad>) =>
    setNC(prev => prev.map(nc => nc.id === id ? { ...nc, ...updates } : nc)), []);
  const addEnsayo = useCallback((e: EnsayoCompresion) => setEnsayos(prev => [...prev, e]), []);
  const addCondicion = useCallback((c: CondicionHabilitante) => setCondiciones(prev => [...prev, c]), []);
  const updateCondicion = useCallback((id: string, updates: Partial<CondicionHabilitante>) =>
    setCondiciones(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c)), []);
  const deleteCondicion = useCallback((id: string) => setCondiciones(prev => prev.filter(c => c.id !== id)), []);
  const addMolde = useCallback((m: Molde) => setMoldes(prev => [...prev, m]), []);
  const updateMolde = useCallback((id: string, updates: Partial<Molde>) =>
    setMoldes(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m)), []);
  const addTrabajador = useCallback((t: Trabajador) => setTrabajadores(prev => [...prev, t]), []);
  const updateTrabajador = useCallback((id: string, updates: Partial<Trabajador>) =>
    setTrabajadores(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)), []);
  const addAuditLog = useCallback((entry: AuditLogEntry) => setAuditLog(prev => [entry, ...prev]), []);
  const addObservacion = useCallback((obs: ObservacionAuditor) => setObservaciones(prev => [obs, ...prev]), []);
  const addMaterial = useCallback((m: MaterialActivo) => setMateriales(prev => [m, ...prev]), []);
  const updateMaterial = useCallback((id: string, updates: Partial<MaterialActivo>) =>
    setMateriales(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m)), []);

  // Refresh — re-read all operational data from localStorage
  const refreshFromStorage = useCallback(() => {
    setMoldes(fromStorage('moldes', MOCK_MOLDES));
    setTrabajadores(fromStorage('trabajadores', MOCK_TRABAJADORES));
    setCondiciones(fromStorage('condiciones', MOCK_CONDICIONES));
    setMateriales(fromStorage('materiales', MOCK_MATERIALES));
    setJornadas(fromStorage('jornadas', MOCK_JORNADAS));
    setVerificaciones(fromStorage('verificaciones', MOCK_VERIFICACIONES));
    setDesmoldes(fromStorage('desmoldes', MOCK_DESMOLDES));
    setProductoTerminado(fromStorage('productoTerminado', MOCK_PRODUCTO_TERMINADO));
    setNC(fromStorage('noConformidades', MOCK_NC));
    setEnsayos(fromStorage('ensayos', MOCK_ENSAYOS));
    setAuditLog(fromStorage('auditLog', []));
    setObservaciones(fromStorage('observaciones', []));
  }, []);

  const value: AppState = {
    empresas, plantas, usuarios, moldes, trabajadores, condiciones, materiales,
    jornadas, verificaciones, desmoldes, productoTerminado,
    noConformidades, accionesCorrectivas, ensayos, auditLog, observaciones,
    getEmpresa, getPlanta, getPlantasByEmpresa, getJornada, getJornadasByPlanta,
    getVerificacionesByJornada, getDesmoldeByJornada, getProductoTerminadoByJornada,
    getNCByPlanta, getNCByJornada, getCondicionesByPlanta,
    getEnsayosByPlanta, getMoldesByPlanta, getTrabajadoresByPlanta, getObservacionesByPlanta, getMaterialesByPlanta,
    addJornada, updateJornada, addVerificacion, replaceVerificacionesByJornada, addDesmolde,
    addProductoTerminado, addNC, updateNC, addEnsayo,
    addCondicion, updateCondicion, deleteCondicion, addMolde, updateMolde, addTrabajador, updateTrabajador,
    addAuditLog, addObservacion, addMaterial, updateMaterial,
    refreshFromStorage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
