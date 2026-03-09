import { PhaseTwoWorkspace } from '@/shared/components/PhaseTwoWorkspace';

export const PlaceholderPage = ({ title }: { title: string }) => (
  <PhaseTwoWorkspace
    title={title}
    storageKey="portal-service-requests"
    createLabel="Ajukan Permohonan Layanan"
    categories={['Rujukan', 'Medical Check-up', 'Rekam Medis', 'Konsultasi']}
    moduleHighlights={[
      'Status verifikasi berlapis (unit, klinik, admin)',
      'Monitoring antrean layanan prioritas',
      'Riwayat permohonan lengkap per personel',
    ]}
  />
);
