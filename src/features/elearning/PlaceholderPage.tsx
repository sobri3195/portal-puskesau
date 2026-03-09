import { PhaseTwoWorkspace } from '@/shared/components/PhaseTwoWorkspace';

export const PlaceholderPage = ({ title }: { title: string }) => (
  <PhaseTwoWorkspace
    title={title}
    storageKey="portal-elearning"
    createLabel="Daftarkan Program Belajar"
    categories={['Pelatihan Klinis', 'Pelatihan Administrasi', 'Sertifikasi', 'Webinar']}
    moduleHighlights={[
      'Roadmap kompetensi per jabatan',
      'Pengingat tenggat sertifikasi aktif',
      'Evaluasi progres belajar terintegrasi',
    ]}
  />
);
