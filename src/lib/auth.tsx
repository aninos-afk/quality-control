'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Usuario, RolUsuario, Empresa, Planta } from './types';
import { MOCK_USUARIOS, MOCK_EMPRESAS, MOCK_PLANTAS } from './mock-data';

// =============================================
// PERMISSIONS
// =============================================

export type Accion =
  | 'ver_condiciones'
  | 'editar_condiciones'
  | 'ver_jornadas'
  | 'crear_jornada'
  | 'verificar_fabricacion'
  | 'registrar_desmolde'
  | 'registrar_producto_terminado'
  | 'liberar_producto'
  | 'ver_nc'
  | 'crear_nc'
  | 'ver_ensayos'
  | 'crear_ensayo'
  | 'ver_configuracion'
  | 'editar_configuracion'
  | 'ver_todas_plantas'
  | 'ver_todas_empresas'
  | 'dejar_observaciones'
  | 'ver_audit_log'
  | 'gestionar_materiales'
  | 'editar_jornada'
  | 'toggle_visible_externo'
  | 'ver_despachos'
  | 'crear_despacho'
  | 'editar_despacho';

const PERMISOS_POR_ROL: Record<RolUsuario, Accion[]> = {
  // Administrador de plataforma: acceso total a todo
  auditor_plataforma: [
    'ver_condiciones', 'editar_condiciones',
    'ver_jornadas', 'crear_jornada',
    'verificar_fabricacion', 'registrar_desmolde', 'registrar_producto_terminado', 'liberar_producto',
    'ver_nc', 'crear_nc',
    'ver_ensayos', 'crear_ensayo',
    'ver_configuracion', 'editar_configuracion',
    'ver_todas_plantas', 'ver_todas_empresas',
    'dejar_observaciones', 'ver_audit_log',
    'gestionar_materiales', 'editar_jornada', 'toggle_visible_externo',
    'ver_despachos', 'crear_despacho', 'editar_despacho',
  ],
  // Auditor externo (mandante/SAESA): solo lectura de lo que la fábrica expone
  auditor_externo: [
    'ver_jornadas',
    'ver_nc',
    'ver_ensayos',
    'ver_despachos',
  ],
  encargado_calidad: [
    'ver_condiciones', 'editar_condiciones',
    'ver_jornadas', 'crear_jornada',
    'verificar_fabricacion', 'registrar_desmolde', 'registrar_producto_terminado', 'liberar_producto',
    'ver_nc', 'crear_nc',
    'ver_ensayos', 'crear_ensayo',
    'ver_configuracion', 'editar_configuracion',
    'ver_todas_plantas',
    'gestionar_materiales',
    'editar_jornada', 'toggle_visible_externo',
    'ver_despachos', 'crear_despacho', 'editar_despacho',
  ],
  jefe_planta: [
    'ver_condiciones', 'editar_condiciones',
    'ver_jornadas', 'crear_jornada',
    'verificar_fabricacion', 'registrar_desmolde', 'registrar_producto_terminado',
    'liberar_producto',
    'ver_nc', 'crear_nc',
    'ver_ensayos', 'crear_ensayo',
    'ver_configuracion', 'editar_configuracion',
    'gestionar_materiales',
    'editar_jornada', 'toggle_visible_externo',
    'ver_despachos', 'crear_despacho', 'editar_despacho',
  ],
  encargado_patio: [
    'ver_jornadas', 'crear_jornada',
    'verificar_fabricacion', 'registrar_desmolde', 'registrar_producto_terminado',
    'ver_nc',
    'gestionar_materiales',
    // Patio es el rol natural para gestionar despachos: están en patio cuando llega el camión
    'ver_despachos', 'crear_despacho', 'editar_despacho',
  ],
};

// =============================================
// AUTH CONTEXT
// =============================================

interface AuthState {
  user: Usuario | null;
  empresa: Empresa | null;
  planta: Planta | null;
  plantasDisponibles: Planta[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  switchPlanta: (plantaId: string) => void;
  can: (accion: Accion) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = 'qc_auth_user_id';
const STORAGE_PLANTA_KEY = 'qc_auth_planta_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [selectedPlantaId, setSelectedPlantaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const savedUserId = localStorage.getItem(STORAGE_KEY);
    const savedPlantaId = localStorage.getItem(STORAGE_PLANTA_KEY);
    if (savedUserId) {
      const found = MOCK_USUARIOS.find(u => u.id === savedUserId);
      if (found) {
        setUser(found);
        if (savedPlantaId) setSelectedPlantaId(savedPlantaId);
      }
    }
    setIsLoading(false);
  }, []);

  const empresa = user?.empresa_id
    ? MOCK_EMPRESAS.find(e => e.id === user.empresa_id) || null
    : null;

  // Plants available to this user
  const plantasDisponibles = user
    ? user.rol === 'auditor_plataforma'
      ? MOCK_PLANTAS // plataforma sees all
      : user.rol === 'auditor_externo'
        ? MOCK_PLANTAS // externo sees structure but data is filtered by visible_externo
        : user.rol === 'encargado_calidad'
          ? MOCK_PLANTAS.filter(p => p.empresa_id === user.empresa_id)
          : MOCK_PLANTAS.filter(p => p.id === user.planta_id)
    : [];

  // Current active plant
  const planta = selectedPlantaId
    ? plantasDisponibles.find(p => p.id === selectedPlantaId) || plantasDisponibles[0] || null
    : user?.planta_id
      ? plantasDisponibles.find(p => p.id === user.planta_id) || null
      : plantasDisponibles[0] || null;

  const login = useCallback((email: string, password: string) => {
    const found = MOCK_USUARIOS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: 'Credenciales incorrectas' };

    setUser(found);
    localStorage.setItem(STORAGE_KEY, found.id);

    // Set default plant
    const defaultPlantaId = found.planta_id || MOCK_PLANTAS.find(p => p.empresa_id === found.empresa_id)?.id;
    if (defaultPlantaId) {
      setSelectedPlantaId(defaultPlantaId);
      localStorage.setItem(STORAGE_PLANTA_KEY, defaultPlantaId);
    }

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSelectedPlantaId(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_PLANTA_KEY);
  }, []);

  const switchPlanta = useCallback((plantaId: string) => {
    setSelectedPlantaId(plantaId);
    localStorage.setItem(STORAGE_PLANTA_KEY, plantaId);
  }, []);

  const can = useCallback((accion: Accion): boolean => {
    if (!user) return false;
    return PERMISOS_POR_ROL[user.rol]?.includes(accion) ?? false;
  }, [user]);

  const value: AuthState = {
    user,
    empresa,
    planta,
    plantasDisponibles,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    switchPlanta,
    can,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export const ROL_LABELS: Record<RolUsuario, string> = {
  auditor_plataforma: 'Administrador de Plataforma',
  auditor_externo: 'Auditor Externo',
  encargado_calidad: 'Encargado de Calidad',
  jefe_planta: 'Jefe de Planta',
  encargado_patio: 'Encargado de Patio',
};
