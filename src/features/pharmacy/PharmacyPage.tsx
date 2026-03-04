import { PhaseTwoWorkspace } from '@/shared/components/PhaseTwoWorkspace';

export const PharmacyPage = () => (
  <PhaseTwoWorkspace
    title="Farmasi & Ketersediaan Obat"
    storageKey="portal-pharmacy"
    createLabel="Catat Permintaan Obat"
    categories={['Permintaan Unit', 'Restock Gudang', 'Obat Kedaluwarsa', 'Distribusi Harian']}
    moduleHighlights={['Alert stok kritis', 'Prioritas distribusi IGD', 'Monitoring kualitas obat']}
  />
);
