export type Role = 'ADMIN' | 'TU' | 'PEJABAT' | 'NAKES' | 'LOGISTIK' | 'AUDITOR' | 'VIEWER';

export type Permission =
  | 'dashboard:view'
  | 'nota:view'
  | 'nota:create'
  | 'nota:edit'
  | 'nota:export'
  | 'documents:view'
  | 'documents:upload'
  | 'documents:approve'
  | 'agenda:view'
  | 'agenda:manage'
  | 'directory:view'
  | 'phase2:view';

export interface UserProfile {
  id: string;
  nama: string;
  pangkat?: string;
  jabatan?: string;
  unit?: string;
  role: Role;
}
