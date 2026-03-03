import { PhaseTwoWorkspace } from '@/shared/components/PhaseTwoWorkspace';

export const PlaceholderPage = ({ title }: { title: string }) => (
  <PhaseTwoWorkspace
    title={title}
    storageKey="portal-service-requests"
    createLabel="Ajukan Permohonan Layanan"
    categories={['Rujukan', 'Medical Check-up', 'Rekam Medis', 'Konsultasi']}
  />
);
