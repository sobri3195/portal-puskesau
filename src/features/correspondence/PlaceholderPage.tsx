import { PhaseTwoWorkspace } from '@/shared/components/PhaseTwoWorkspace';

export const PlaceholderPage = ({ title }: { title: string }) => (
  <PhaseTwoWorkspace
    title={title}
    storageKey="portal-correspondence"
    createLabel="Tambah Surat/Disposisi"
    categories={['Surat Masuk', 'Surat Keluar', 'Disposisi']}
    moduleHighlights={[
      'Nomor agenda otomatis dan terurut',
      'Tracking disposisi antar pejabat',
      'Pengingat tenggat surat prioritas',
    ]}
  />
);
