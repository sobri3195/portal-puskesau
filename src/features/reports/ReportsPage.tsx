import { PhaseTwoWorkspace } from '@/shared/components/PhaseTwoWorkspace';

export const ReportsPage = () => (
  <PhaseTwoWorkspace
    title="Laporan Kinerja Operasional"
    storageKey="portal-reports"
    createLabel="Buat Tugas Pelaporan"
    categories={['Laporan Mingguan', 'Laporan Bulanan', 'Analisis KPI', 'Tindak Lanjut Audit']}
    moduleHighlights={['Template eksekutif siap kirim', 'Timeline validasi data', 'Export CSV untuk analisis lanjutan']}
  />
);
