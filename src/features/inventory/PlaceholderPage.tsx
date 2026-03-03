import { PhaseTwoWorkspace } from '@/shared/components/PhaseTwoWorkspace';

export const PlaceholderPage = ({ title }: { title: string }) => (
  <PhaseTwoWorkspace
    title={title}
    storageKey="portal-inventory"
    createLabel="Catat Permintaan Inventaris"
    categories={['ATK', 'Perangkat IT', 'Logistik Kesehatan', 'Pemeliharaan']}
  />
);
