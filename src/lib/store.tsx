'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  Fabrica, Molde, Trabajador, CondicionHabilitante,
  Jornada, VerificacionFabricacion, RegistroDesmolde,
  RegistroProductoTerminado, NoConformidad, AccionCorrectiva,
  EnsayoCompresion, RolUsuario, Usuario,
} from './types';
import {
  MOCK_FABRICAS, MOCK_USUARIOS, MOCK_MOLDES, MOCK_TRABAJADORES,
  MOCK_CONDICIONES, MOCK_JORNADAS, MOCK_VERIFICACIONES,
  MOCK_DESMOLDES, MOCK_PRODUCTO_TERMINADO, MOCK_NC,
  MOCK_AC, MOCK_ENSAYOS,
} from './mock-data';

interface AppState {
  // Auth
  currentUser: Usuario | null;
  currentRole: RolUsuario;
  currentFabricaId: string;
  setRole: (role: RolUsuario) => void;
  // Data
  fabricas: Fabrica[];
  usuarios: Usuario[];
  moldes: Molde[];
  trabajadores: Trabajador[];
  condiciones: CondicionHabilitante[];
  jornadas: Jornada[];
  verificaciones: VerificacionFabricacion[];
  desmoldes: RegistroDesmolde[];
  productoTerminado: RegistroProductoTerminado[];
  noConformidades: NoConformidad[];
  accionesCorrectivas: AccionCorrectiva[];
  ensayos: EnsayoCompresion[];
  // Helpers
  getFabrica: (id: string) => Fabrica | undefined;
  getJornada: (id: string) => Jornada | undefined;
  getJornadasByFabrica: (fabricaId: string) => Jornada[];
  getVerificacionesByJornada: (jornadaId: string) => VerificacionFabricacion[];
  getDesmoldeByJornada: (jornadaId: string) => RegistroDesmolde | undefined;
  getProductoTerminadoByJornada: (jornadaId: string) => RegistroProductoTerminado | undefined;
  getNCByFabrica: (fabricaId: string) => NoConformidad[];
  getNCByJornada: (jornadaId: string) => NoConformidad[];
  getCondicionesByFabrica: (fabricaId: string) => CondicionHabilitante[];
  getEnsayosByFabrica: (fabricaId: string) => EnsayoCompresion[];
  getMoldesByFabrica: (fabricaId: string) => Molde[];
  getTrabajadoresByFabrica: (fabricaId: string) => Trabajador[];
  // Mutations
  addJornada: (jornada: Jornada) => void;
  updateJornada: (id: string, updates: Partial<Jornada>) => void;
  addVerificacion: (verificacion: VerificacionFabricacion) => void;
  addDesmolde: (desmolde: RegistroDesmolde) => void;
  addProductoTerminado: (pt: RegistroProductoTerminado) => void;
  addNC: (nc: NoConformidad) => void;
  updateNC: (id: string, updates: Partial<NoConformidad>) => void;
  addEnsayo: (ensayo: EnsayoCompresion) => void;
  addCondicion: (condicion: CondicionHabilitante) => void;
  addMolde: (molde: Molde) => void;
  addTrabajador: (trabajador: Trabajador) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<RolUsuario>('encargado_calidad');
  const currentFabricaId = 'fab-tmc';
  const currentUser = MOCK_USUARIOS.find(u => u.rol === currentRole && (u.fabrica_id === currentFabricaId || u.rol === 'auditor')) || null;

  const [fabricas] = useState<Fabrica[]>(MOCK_FABRICAS);
  const [usuarios] = useState<Usuario[]>(MOCK_USUARIOS);
  const [moldes, setMoldes] = useState<Molde[]>(MOCK_MOLDES);
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>(MOCK_TRABAJADORES);
  const [condiciones, setCondiciones] = useState<CondicionHabilitante[]>(MOCK_CONDICIONES);
  const [jornadas, setJornadas] = useState<Jornada[]>(MOCK_JORNADAS);
  const [verificaciones, setVerificaciones] = useState<VerificacionFabricacion[]>(MOCK_VERIFICACIONES);
  const [desmoldes, setDesmoldes] = useState<RegistroDesmolde[]>(MOCK_DESMOLDES);
  const [productoTerminado, setProductoTerminado] = useState<RegistroProductoTerminado[]>(MOCK_PRODUCTO_TERMINADO);
  const [noConformidades, setNC] = useState<NoConformidad[]>(MOCK_NC);
  const [accionesCorrectivas] = useState<AccionCorrectiva[]>(MOCK_AC);
  const [ensayos, setEnsayos] = useState<EnsayoCompresion[]>(MOCK_ENSAYOS);

  // Helpers
  const getFabrica = useCallback((id: string) => fabricas.find(f => f.id === id), [fabricas]);
  const getJornada = useCallback((id: string) => jornadas.find(j => j.id === id), [jornadas]);
  const getJornadasByFabrica = useCallback((fId: string) => jornadas.filter(j => j.fabrica_id === fId), [jornadas]);
  const getVerificacionesByJornada = useCallback((jId: string) => verificaciones.filter(v => v.jornada_id === jId), [verificaciones]);
  const getDesmoldeByJornada = useCallback((jId: string) => desmoldes.find(d => d.jornada_id === jId), [desmoldes]);
  const getProductoTerminadoByJornada = useCallback((jId: string) => productoTerminado.find(pt => pt.jornada_id === jId), [productoTerminado]);
  const getNCByFabrica = useCallback((fId: string) => noConformidades.filter(nc => nc.fabrica_id === fId), [noConformidades]);
  const getNCByJornada = useCallback((jId: string) => noConformidades.filter(nc => nc.jornada_id === jId), [noConformidades]);
  const getCondicionesByFabrica = useCallback((fId: string) => condiciones.filter(c => c.fabrica_id === fId), [condiciones]);
  const getEnsayosByFabrica = useCallback((fId: string) => ensayos.filter(e => e.fabrica_id === fId), [ensayos]);
  const getMoldesByFabrica = useCallback((fId: string) => moldes.filter(m => m.fabrica_id === fId), [moldes]);
  const getTrabajadoresByFabrica = useCallback((fId: string) => trabajadores.filter(t => t.fabrica_id === fId), [trabajadores]);

  // Mutations
  const addJornada = useCallback((j: Jornada) => setJornadas(prev => [j, ...prev]), []);
  const updateJornada = useCallback((id: string, updates: Partial<Jornada>) =>
    setJornadas(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j)), []);
  const addVerificacion = useCallback((v: VerificacionFabricacion) => setVerificaciones(prev => [...prev, v]), []);
  const addDesmolde = useCallback((d: RegistroDesmolde) => setDesmoldes(prev => [...prev, d]), []);
  const addProductoTerminado = useCallback((pt: RegistroProductoTerminado) => setProductoTerminado(prev => [...prev, pt]), []);
  const addNC = useCallback((nc: NoConformidad) => setNC(prev => [...prev, nc]), []);
  const updateNC = useCallback((id: string, updates: Partial<NoConformidad>) =>
    setNC(prev => prev.map(nc => nc.id === id ? { ...nc, ...updates } : nc)), []);
  const addEnsayo = useCallback((e: EnsayoCompresion) => setEnsayos(prev => [...prev, e]), []);
  const addCondicion = useCallback((c: CondicionHabilitante) => setCondiciones(prev => [...prev, c]), []);
  const addMolde = useCallback((m: Molde) => setMoldes(prev => [...prev, m]), []);
  const addTrabajador = useCallback((t: Trabajador) => setTrabajadores(prev => [...prev, t]), []);

  const value: AppState = {
    currentUser, currentRole, currentFabricaId, setRole: setCurrentRole,
    fabricas, usuarios, moldes, trabajadores, condiciones,
    jornadas, verificaciones, desmoldes, productoTerminado,
    noConformidades, accionesCorrectivas, ensayos,
    getFabrica, getJornada, getJornadasByFabrica,
    getVerificacionesByJornada, getDesmoldeByJornada, getProductoTerminadoByJornada,
    getNCByFabrica, getNCByJornada, getCondicionesByFabrica,
    getEnsayosByFabrica, getMoldesByFabrica, getTrabajadoresByFabrica,
    addJornada, updateJornada, addVerificacion, addDesmolde,
    addProductoTerminado, addNC, updateNC, addEnsayo,
    addCondicion, addMolde, addTrabajador,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
