create extension if not exists "uuid-ossp";

create table if not exists users_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null,
  pangkat text,
  jabatan text,
  unit text,
  role text not null check (role in ('ADMIN','TU','PEJABAT','NAKES','LOGISTIK','AUDITOR','VIEWER'))
);

create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references users_profile(id),
  action text not null,
  entity text not null,
  entity_id text,
  metadata_json jsonb,
  created_at timestamptz default now()
);

create table if not exists nota_dinas (
  id uuid primary key default uuid_generate_v4(),
  nomor text not null,
  klasifikasi text not null,
  kepada text not null,
  dari text not null,
  perihal text not null,
  isi text not null,
  tembusan_json jsonb,
  tanggal date not null,
  status text default 'DRAFT',
  file_url text,
  created_by uuid references users_profile(id),
  created_at timestamptz default now()
);

create table if not exists surat (
  id uuid primary key default uuid_generate_v4(), jenis_masuk_keluar text, nomor text, tanggal date, asal_tujuan text,
  perihal text, disposisi_status text, lampiran_url text, created_by uuid references users_profile(id), created_at timestamptz default now()
);
create table if not exists disposisi (
  id uuid primary key default uuid_generate_v4(), surat_id uuid references surat(id) on delete cascade,
  dari text, kepada text, catatan text, status text, due_date date
);
create table if not exists documents (
  id uuid primary key default uuid_generate_v4(), kategori text, judul text, versi text,
  status_approval text default 'DRAFT', file_url text, owner_id uuid references users_profile(id), approved_by uuid references users_profile(id), approved_at timestamptz
);
create table if not exists agenda_events (
  id uuid primary key default uuid_generate_v4(), judul text, lokasi text, mulai timestamptz, selesai timestamptz, unit text, deskripsi text
);
create table if not exists directory_units (
  id uuid primary key default uuid_generate_v4(), nama_unit text not null, parent_id uuid references directory_units(id)
);
create table if not exists directory_people (
  id uuid primary key default uuid_generate_v4(), nama text, jabatan text, kontak text, unit_id uuid references directory_units(id)
);
create table if not exists service_requests (
  id uuid primary key default uuid_generate_v4(), tipe text, pemohon_id uuid references users_profile(id), detail_json jsonb,
  status text, assigned_to uuid references users_profile(id), schedule_at timestamptz
);
create table if not exists inventory_items (
  id uuid primary key default uuid_generate_v4(), nama text, kategori text, stok int default 0, min_stok int default 0, satuan text, lokasi text
);
create table if not exists inventory_tx (
  id uuid primary key default uuid_generate_v4(), item_id uuid references inventory_items(id) on delete cascade,
  tipe_in_out text, qty int, catatan text, actor_id uuid references users_profile(id), created_at timestamptz default now()
);
create table if not exists elearning_courses (
  id uuid primary key default uuid_generate_v4(), judul text, deskripsi text, status text
);
create table if not exists elearning_lessons (
  id uuid primary key default uuid_generate_v4(), course_id uuid references elearning_courses(id) on delete cascade,
  judul text, konten_md text
);
create table if not exists elearning_quizzes (
  id uuid primary key default uuid_generate_v4(), course_id uuid references elearning_courses(id) on delete cascade, json_schema jsonb
);
create table if not exists elearning_results (
  id uuid primary key default uuid_generate_v4(), user_id uuid references users_profile(id),
  course_id uuid references elearning_courses(id), score numeric, passed boolean, created_at timestamptz default now()
);
create table if not exists tickets (
  id uuid primary key default uuid_generate_v4(), kategori text, judul text, deskripsi text,
  prioritas text, status text, created_by uuid references users_profile(id), assigned_to uuid references users_profile(id), created_at timestamptz default now()
);

insert into directory_units (nama_unit) values ('Kesekretariatan'), ('Pelayanan Kesehatan'), ('Logistik') on conflict do nothing;
