import { PhaseTwoWorkspace } from '@/shared/components/PhaseTwoWorkspace';

export const TelemedicinePage = () => (
  <PhaseTwoWorkspace
    title="Telemedicine & Konsultasi Daring"
    storageKey="portal-telemedicine"
    createLabel="Jadwalkan Konsultasi"
    categories={['Konsultasi Umum', 'Konsultasi Spesialis', 'Monitoring Pasca Rawat']}
    moduleHighlights={['Antrian konsultasi real-time', 'Prioritas pasien kritis', 'Rekap SLA dokter jaga']}
  />
);
