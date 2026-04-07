'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This route is maintained for backward compatibility
// The main auditor page (/auditor) now shows empresas
export default function FabricasAuditorPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/auditor');
  }, [router]);
  return null;
}
