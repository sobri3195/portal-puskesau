import { PhaseTwoWorkspace } from '@/shared/components/PhaseTwoWorkspace';

export const HrPage = () => (
  <PhaseTwoWorkspace
    title="Kepegawaian & SDM"
    storageKey="portal-hr"
    createLabel="Buat Tugas SDM"
    categories={['Cuti & Izin', 'Penilaian Kinerja', 'Rekrutmen Internal', 'Pelatihan SDM']}
    moduleHighlights={['Tracking cuti lintas unit', 'Reminder evaluasi berkala', 'Pipeline rekrutmen terstruktur']}
  />
);
