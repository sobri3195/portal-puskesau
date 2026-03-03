import { PhaseTwoWorkspace } from '@/shared/components/PhaseTwoWorkspace';

export const PlaceholderPage = ({ title }: { title: string }) => (
  <PhaseTwoWorkspace
    title={title}
    storageKey="portal-helpdesk"
    createLabel="Buat Tiket Helpdesk"
    categories={['Jaringan', 'Aplikasi', 'Hardware', 'Akun']}
  />
);
