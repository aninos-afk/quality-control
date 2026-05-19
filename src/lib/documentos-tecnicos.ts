export interface DocumentoTecnico {
  id: string;
  label: string;
  url: string;
  tipo: 'pdf' | 'imagen';
}

export interface SeccionDocumentos {
  seccion: 'armadura' | 'moldaje' | 'hormigonado';
  documentos: DocumentoTecnico[];
}

const DOCS_HORMISUR: SeccionDocumentos[] = [
  {
    seccion: 'armadura',
    documentos: [
      {
        id: 'hormisur-plano-estructural',
        label: 'Ver plano',
        url: '/docs/hormisur/plano-estructural.pdf',
        tipo: 'pdf',
      },
      {
        id: 'hormisur-oxidacion',
        label: 'Grado de oxidación',
        url: '/docs/hormisur/oxidacion-referencia.jpg',
        tipo: 'imagen',
      },
    ],
  },
  { seccion: 'moldaje', documentos: [] },
  { seccion: 'hormigonado', documentos: [] },
];

// Las tres plantas de Hormisur comparten los mismos documentos de referencia
const DOCUMENTOS_POR_PLANTA: Record<string, SeccionDocumentos[]> = {
  'plt-tmc': DOCS_HORMISUR,
  'plt-prl': DOCS_HORMISUR,
  'plt-osr': DOCS_HORMISUR,
};

export function getDocumentosPorSeccion(
  plantaId: string,
  seccion: SeccionDocumentos['seccion']
): DocumentoTecnico[] {
  const planta = DOCUMENTOS_POR_PLANTA[plantaId];
  if (!planta) return [];
  return planta.find(s => s.seccion === seccion)?.documentos ?? [];
}
