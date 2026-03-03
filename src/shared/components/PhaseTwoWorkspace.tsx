import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Box, Button, Chip, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import DoneIcon from '@mui/icons-material/DoneAll';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useForm } from 'react-hook-form';
import { DataTable } from '@/shared/components/DataTable';
import { FormModal } from '@/shared/components/FormModal';
import { Toast } from '@/shared/components/Toast';

type TicketStatus = 'Baru' | 'Diproses' | 'Selesai';
type TicketPriority = 'Rendah' | 'Sedang' | 'Tinggi';

interface TicketItem {
  id: string;
  title: string;
  requester: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  dueDate: string;
  notes: string;
  createdAt: string;
}

interface TicketForm {
  title: string;
  requester: string;
  category: string;
  priority: TicketPriority;
  dueDate: string;
  notes: string;
}

const defaultValues: TicketForm = {
  title: '',
  requester: '',
  category: '',
  priority: 'Sedang',
  dueDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
  notes: '',
};

const loadItems = (storageKey: string): TicketItem[] => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const PhaseTwoWorkspace = ({
  title,
  storageKey,
  categories,
  createLabel,
}: {
  title: string;
  storageKey: string;
  categories: string[];
  createLabel: string;
}) => {
  const [rows, setRows] = useState<TicketItem[]>(() => loadItems(storageKey));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | TicketStatus>('Semua');
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');
  const { register, handleSubmit, reset } = useForm<TicketForm>({ defaultValues });

  const saveRows = (nextRows: TicketItem[]) => {
    setRows(nextRows);
    localStorage.setItem(storageKey, JSON.stringify(nextRows));
  };

  const createTicket = (form: TicketForm) => {
    const next: TicketItem = {
      id: crypto.randomUUID(),
      status: 'Baru',
      createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
      ...form,
    };

    saveRows([next, ...rows]);
    setOpen(false);
    reset(defaultValues);
    setToast('Data berhasil ditambahkan.');
  };

  const updateStatus = (id: string, status: TicketStatus) => {
    const order: TicketStatus[] = ['Baru', 'Diproses', 'Selesai'];
    const nextStatus = order[(order.indexOf(status) + 1) % order.length];
    saveRows(rows.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
  };

  const removeTicket = (id: string) => {
    saveRows(rows.filter((item) => item.id !== id));
    setToast('Data dihapus.');
  };

  const filtered = useMemo(
    () =>
      rows.filter((item) => {
        const matchStatus = statusFilter === 'Semua' || item.status === statusFilter;
        const keyword = `${item.title} ${item.requester} ${item.category}`.toLowerCase();
        return matchStatus && keyword.includes(search.toLowerCase());
      }),
    [rows, search, statusFilter],
  );

  const summary = {
    total: rows.length,
    baru: rows.filter((r) => r.status === 'Baru').length,
    diproses: rows.filter((r) => r.status === 'Diproses').length,
    selesai: rows.filter((r) => r.status === 'Selesai').length,
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{title}</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>{createLabel}</Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} mb={2}>
        <Chip color="default" label={`Total: ${summary.total}`} />
        <Chip color="info" label={`Baru: ${summary.baru}`} />
        <Chip color="warning" label={`Diproses: ${summary.diproses}`} />
        <Chip color="success" label={`Selesai: ${summary.selesai}`} />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <TextField
          size="small"
          fullWidth
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari judul, kategori, atau pemohon"
        />
        <TextField
          size="small"
          select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'Semua' | TicketStatus)}
          sx={{ width: { xs: '100%', md: 180 } }}
        >
          {['Semua', 'Baru', 'Diproses', 'Selesai'].map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>
      </Stack>

      <DataTable
        rows={filtered}
        columns={[
          { key: 'title', header: 'Judul' },
          { key: 'requester', header: 'Pemohon/Pelapor' },
          { key: 'category', header: 'Kategori' },
          { key: 'priority', header: 'Prioritas', render: (item) => <Chip size="small" label={item.priority} /> },
          { key: 'dueDate', header: 'Target' },
          { key: 'status', header: 'Status', render: (item) => <Chip size="small" color={item.status === 'Selesai' ? 'success' : item.status === 'Diproses' ? 'warning' : 'info'} label={item.status} /> },
          {
            key: 'actions',
            header: 'Aksi',
            render: (item) => (
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" onClick={() => updateStatus(item.id, item.status)} title="Ubah status">
                  {item.status === 'Selesai' ? <DoneIcon fontSize="small" /> : <AutorenewIcon fontSize="small" />}
                </IconButton>
                <IconButton size="small" color="error" onClick={() => removeTicket(item.id)} title="Hapus">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ),
          },
        ]}
      />

      <FormModal open={open} title={createLabel} onClose={() => setOpen(false)}>
        <Stack component="form" spacing={2} mt={1} onSubmit={handleSubmit(createTicket)}>
          <TextField label="Judul" required {...register('title')} />
          <TextField label="Pemohon/Pelapor" required {...register('requester')} />
          <TextField label="Kategori" select defaultValue={categories[0]} {...register('category')}>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </TextField>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Prioritas" select defaultValue="Sedang" {...register('priority')} sx={{ width: { xs: '100%', md: 160 } }}>
              {['Rendah', 'Sedang', 'Tinggi'].map((priority) => (
                <MenuItem key={priority} value={priority}>{priority}</MenuItem>
              ))}
            </TextField>
            <TextField label="Target Selesai" type="date" InputLabelProps={{ shrink: true }} {...register('dueDate')} />
          </Stack>
          <TextField label="Catatan" multiline minRows={3} {...register('notes')} />
          <Button type="submit" variant="contained">Simpan</Button>
        </Stack>
      </FormModal>

      <Toast open={!!toast} message={toast} onClose={() => setToast('')} />
    </Box>
  );
};
