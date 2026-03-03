import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Alert, Box, Button, Card, CardContent, Chip, IconButton, LinearProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import DoneIcon from '@mui/icons-material/DoneAll';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EditIcon from '@mui/icons-material/EditOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
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

interface TicketStatusOption {
  label: string;
  value: 'Semua' | TicketStatus;
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
  const [priorityFilter, setPriorityFilter] = useState<'Semua' | TicketPriority>('Semua');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const { register, handleSubmit, reset } = useForm<TicketForm>({ defaultValues });

  const statusOptions: TicketStatusOption[] = [
    { label: 'Semua', value: 'Semua' },
    { label: 'Baru', value: 'Baru' },
    { label: 'Diproses', value: 'Diproses' },
    { label: 'Selesai', value: 'Selesai' },
  ];

  const closeModal = () => {
    setOpen(false);
    setEditingId(null);
    reset(defaultValues);
  };

  const openCreateModal = () => {
    setEditingId(null);
    reset({ ...defaultValues, category: categories[0] ?? '' });
    setOpen(true);
  };

  const saveRows = (nextRows: TicketItem[]) => {
    setRows(nextRows);
    localStorage.setItem(storageKey, JSON.stringify(nextRows));
  };

  const createTicket = (form: TicketForm) => {
    if (editingId) {
      saveRows(rows.map((item) => (item.id === editingId ? { ...item, ...form } : item)));
      setToast('Data berhasil diperbarui.');
      closeModal();
      return;
    }

    const next: TicketItem = {
      id: crypto.randomUUID(),
      status: 'Baru',
      createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
      ...form,
    };

    saveRows([next, ...rows]);
    closeModal();
    setToast('Data berhasil ditambahkan.');
  };

  const editTicket = (item: TicketItem) => {
    setEditingId(item.id);
    reset({
      title: item.title,
      requester: item.requester,
      category: item.category,
      priority: item.priority,
      dueDate: item.dueDate,
      notes: item.notes,
    });
    setOpen(true);
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
      rows
        .filter((item) => {
          const matchStatus = statusFilter === 'Semua' || item.status === statusFilter;
          const matchPriority = priorityFilter === 'Semua' || item.priority === priorityFilter;
          const keyword = `${item.title} ${item.requester} ${item.category}`.toLowerCase();
          return matchStatus && matchPriority && keyword.includes(search.toLowerCase());
        })
        .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf()),
    [rows, search, statusFilter, priorityFilter],
  );

  const summary = {
    total: rows.length,
    baru: rows.filter((r) => r.status === 'Baru').length,
    diproses: rows.filter((r) => r.status === 'Diproses').length,
    selesai: rows.filter((r) => r.status === 'Selesai').length,
    overdue: rows.filter((r) => dayjs(r.dueDate).isBefore(dayjs(), 'day') && r.status !== 'Selesai').length,
  };

  const completion = summary.total === 0 ? 0 : Math.round((summary.selesai / summary.total) * 100);

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'start', md: 'center' }} mb={2} gap={2}>
        <Box>
          <Typography variant="h5">{title}</Typography>
          <Typography color="text.secondary" variant="body2">Kelola permintaan, pantau SLA, dan tindak lanjuti progres dalam satu workspace.</Typography>
        </Box>
        <Button variant="contained" onClick={openCreateModal}>{createLabel}</Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} mb={2}>
        <Card sx={{ minWidth: 160 }}><CardContent><Stack direction="row" alignItems="center" spacing={1}><AssignmentTurnedInIcon color="primary" /><Typography>Total</Typography></Stack><Typography variant="h5">{summary.total}</Typography></CardContent></Card>
        <Card sx={{ minWidth: 160 }}><CardContent><Stack direction="row" alignItems="center" spacing={1}><PlaylistAddCheckCircleIcon color="warning" /><Typography>Diproses</Typography></Stack><Typography variant="h5">{summary.diproses}</Typography></CardContent></Card>
        <Card sx={{ minWidth: 160 }}><CardContent><Stack direction="row" alignItems="center" spacing={1}><PriorityHighIcon color="error" /><Typography>Terlambat</Typography></Stack><Typography variant="h5">{summary.overdue}</Typography></CardContent></Card>
      </Stack>

      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" mb={0.5}><Typography variant="body2">Tingkat Penyelesaian</Typography><Typography variant="body2" fontWeight={600}>{completion}%</Typography></Stack>
        <LinearProgress variant="determinate" value={completion} sx={{ height: 8, borderRadius: 8 }} />
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} mb={2}>
        <Chip color="default" label={`Baru: ${summary.baru}`} />
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
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value as 'Semua' | TicketPriority)}
          sx={{ width: { xs: '100%', md: 180 } }}
        >
          {['Semua', 'Rendah', 'Sedang', 'Tinggi'].map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>
      </Stack>

      {filtered.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>Belum ada data yang cocok dengan filter saat ini.</Alert>
      ) : null}

      <DataTable
        rows={filtered}
        columns={[
          { key: 'title', header: 'Judul' },
          { key: 'requester', header: 'Pemohon/Pelapor' },
          { key: 'category', header: 'Kategori' },
          { key: 'priority', header: 'Prioritas', render: (item) => <Chip size="small" label={item.priority} /> },
          {
            key: 'dueDate',
            header: 'Target',
            render: (item) => {
              const overdue = dayjs(item.dueDate).isBefore(dayjs(), 'day') && item.status !== 'Selesai';
              return <Chip size="small" color={overdue ? 'error' : 'default'} label={item.dueDate} />;
            },
          },
          { key: 'status', header: 'Status', render: (item) => <Chip size="small" color={item.status === 'Selesai' ? 'success' : item.status === 'Diproses' ? 'warning' : 'info'} label={item.status} /> },
          { key: 'notes', header: 'Catatan', render: (item) => item.notes || '-' },
          {
            key: 'actions',
            header: 'Aksi',
            render: (item) => (
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" onClick={() => editTicket(item)} title="Ubah data">
                  <EditIcon fontSize="small" />
                </IconButton>
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

      <FormModal open={open} title={editingId ? `Ubah Data - ${title}` : createLabel} onClose={closeModal}>
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
          <Button type="submit" variant="contained">{editingId ? 'Perbarui' : 'Simpan'}</Button>
        </Stack>
      </FormModal>

      <Toast open={!!toast} message={toast} onClose={() => setToast('')} />
    </Box>
  );
};
