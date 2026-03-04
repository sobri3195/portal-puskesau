import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthGuard } from '@/app/guards/AuthGuard';
import { RoleGuard } from '@/app/guards/RoleGuard';
import { AppLayout } from '@/app/layout/AppLayout';
import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { NotesPage } from '@/features/notes/NotesPage';
import { DocumentsPage } from '@/features/documents/DocumentsPage';
import { AgendaPage } from '@/features/agenda/AgendaPage';
import { DirectoryPage } from '@/features/directory/DirectoryPage';
import { PlaceholderPage as CorrespondencePage } from '@/features/correspondence/PlaceholderPage';
import { PlaceholderPage as HelpdeskPage } from '@/features/helpdesk/PlaceholderPage';
import { PlaceholderPage as InventoryPage } from '@/features/inventory/PlaceholderPage';
import { PlaceholderPage as ServiceReqPage } from '@/features/service-requests/PlaceholderPage';
import { PlaceholderPage as ElearningPage } from '@/features/elearning/PlaceholderPage';
import { TelemedicinePage } from '@/features/telemedicine/TelemedicinePage';
import { HrPage } from '@/features/hr/HrPage';
import { FinancePage } from '@/features/finance/FinancePage';
import { PharmacyPage } from '@/features/pharmacy/PharmacyPage';
import { ReportsPage } from '@/features/reports/ReportsPage';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AuthGuard />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="directory" element={<DirectoryPage />} />
          <Route element={<RoleGuard permission="phase2:view" />}>
            <Route path="correspondence" element={<CorrespondencePage title="Surat Masuk–Keluar & Disposisi" />} />
            <Route path="helpdesk" element={<HelpdeskPage title="Helpdesk Ticketing" />} />
            <Route path="inventory" element={<InventoryPage title="Inventaris & Logistik" />} />
            <Route path="service-requests" element={<ServiceReqPage title="Permohonan Layanan Kesehatan Internal" />} />
            <Route path="elearning" element={<ElearningPage title="E-learning & Sertifikasi" />} />
            <Route path="telemedicine" element={<TelemedicinePage />} />
            <Route path="hr" element={<HrPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="pharmacy" element={<PharmacyPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);
