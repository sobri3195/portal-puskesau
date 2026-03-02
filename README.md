# Portal Puskesau

Portal Puskesau adalah aplikasi web modular berbasis **React + Vite + TypeScript** (tanpa Next.js) untuk kebutuhan administrasi, dokumen, agenda, dan layanan internal.

## Stack
- React + Vite + TypeScript
- React Router
- TanStack Query + Zustand
- Material UI (MUI)
- Supabase (Auth, Postgres, Storage)
- react-hook-form + zod
- jsPDF

## Struktur
```
src/
  app/ (router, providers, layout, guards)
  features/
    auth/
    dashboard/
    notes/
    correspondence/
    documents/
    agenda/
    directory/
    service-requests/
    inventory/
    elearning/
    helpdesk/
  shared/
  lib/
supabase/schema.sql
```

## Setup Lokal
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env
   ```
3. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
4. Jalankan migrasi SQL ke Supabase dengan file `supabase/schema.sql`.
5. Jalankan dev:
   ```bash
   npm run dev
   ```

## Build
```bash
npm run build
```
Output ke `dist/`.

## Deploy Vercel (SPA)
File `vercel.json` sudah disiapkan untuk rewrite semua route ke `/` agar React Router berjalan.

## Modul MVP
- Auth + RBAC + layout sidebar/topbar
- Nota Dinas (list/filter/search, create + auto nomor, preview, export PDF + upload storage)
- SOP/Document Center (upload metadata + approval sederhana)
- Agenda (CRUD list)
- Direktori (unit + pejabat)

## Modul Phase 2 (placeholder)
- Surat masuk/keluar & disposisi
- Helpdesk
- Inventaris
- Permohonan layanan
- Dashboard KPI lanjutan
- E-learning
