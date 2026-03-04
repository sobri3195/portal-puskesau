import { PhaseTwoWorkspace } from '@/shared/components/PhaseTwoWorkspace';

export const FinancePage = () => (
  <PhaseTwoWorkspace
    title="Keuangan & Anggaran"
    storageKey="portal-finance"
    createLabel="Tambah Proses Keuangan"
    categories={['Pengajuan Anggaran', 'Verifikasi SPJ', 'Pembayaran Vendor', 'Audit Internal']}
    moduleHighlights={['Kontrol jatuh tempo pembayaran', 'Prioritas item audit', 'Ringkasan progres harian']}
  />
);
