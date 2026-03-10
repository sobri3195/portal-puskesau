import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  Grid2,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SpeedIcon from '@mui/icons-material/Speed';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

type Severity = 'high' | 'medium' | 'low';

const cards = [
  { title: 'Nota Dinas', value: '12 draft / 5 approved', trend: '+15%', icon: <FactCheckIcon color="primary" /> },
  { title: 'Dokumen SOP', value: '84 dokumen aktif', trend: '+9%', icon: <TrendingUpIcon color="primary" /> },
  { title: 'Agenda Minggu Ini', value: '7 kegiatan', trend: '3 prioritas', icon: <AlarmOnIcon color="primary" /> },
  { title: 'Helpdesk Open', value: '9 tiket', trend: '-2 dari kemarin', icon: <SpeedIcon color="primary" /> },
];

const quickActions = [
  { label: 'Buat Nota Dinas', icon: <FactCheckIcon fontSize="small" /> },
  { label: 'Upload SOP', icon: <PictureAsPdfIcon fontSize="small" /> },
  { label: 'Publikasi Pengumuman', icon: <NotificationsActiveIcon fontSize="small" /> },
  { label: 'Sinkronisasi Laporan', icon: <DownloadDoneIcon fontSize="small" /> },
];

const moduleHealth = [
  { module: 'Dokumen', score: 88 },
  { module: 'Agenda', score: 76 },
  { module: 'Direktori', score: 92 },
  { module: 'Helpdesk', score: 64 },
  { module: 'Telemedicine', score: 79 },
];

const agendaItems = [
  { title: 'Rapat koordinasi kepala unit', time: '08:30', unit: 'Manajemen' },
  { title: 'Review SOP klinik gigi', time: '10:00', unit: 'Mutu' },
  { title: 'Audit stok farmasi', time: '13:00', unit: 'Farmasi' },
  { title: 'Sosialisasi dashboard baru', time: '15:00', unit: 'IT' },
];

const initialTasks = [
  { id: 1, label: 'Validasi 5 dokumen SOP baru', done: false },
  { id: 2, label: 'Konfirmasi jadwal dokter jaga', done: true },
  { id: 3, label: 'Tutup tiket helpdesk prioritas tinggi', done: false },
  { id: 4, label: 'Approve 2 permintaan layanan internal', done: false },
];

const alerts: Array<{ title: string; detail: string; severity: Severity }> = [
  { title: 'Server integrasi lambat', detail: 'Waktu respon > 900ms di jam sibuk.', severity: 'high' },
  { title: 'Stok 2 item farmasi menipis', detail: 'Perlu restock sebelum Jumat.', severity: 'medium' },
  { title: '3 tiket helpdesk menunggu verifikasi', detail: 'Belum ada update selama 24 jam.', severity: 'low' },
];

const rangeOptions = ['Hari ini', '7 hari', '30 hari'];

export const DashboardPage = () => {
  const [query, setQuery] = useState('');
  const [dateRange, setDateRange] = useState('7 hari');
  const [severity, setSeverity] = useState<Severity | 'all'>('all');
  const [tasks, setTasks] = useState(initialTasks);

  const filteredCards = useMemo(
    () => cards.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const filteredAlerts = useMemo(
    () => alerts.filter((item) => severity === 'all' || item.severity === severity),
    [severity],
  );

  const completedTasks = tasks.filter((task) => task.done).length;

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  const exportSnapshot = () => {
    const report = [
      `Snapshot Dashboard (${dateRange})`,
      `Kartu terlihat: ${filteredCards.length}`,
      `Task selesai: ${completedTasks}/${tasks.length}`,
      `Alert aktif: ${filteredAlerts.length}`,
    ].join('\n');

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `snapshot-dashboard-${dateRange.replace(' ', '-')}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between" gap={2}>
        <div>
          <Typography variant="h4" mb={1}>Dashboard KPI</Typography>
          <Typography color="text.secondary">Ringkasan real-time untuk memantau performa seluruh modul Portal Puskesau.</Typography>
        </div>
        <Button variant="contained" startIcon={<RocketLaunchIcon />} onClick={exportSnapshot}>
          Export Snapshot
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Cari modul"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Contoh: agenda, helpdesk"
            />
            <ButtonGroup variant="outlined">
              {rangeOptions.map((item) => (
                <Button key={item} variant={item === dateRange ? 'contained' : 'outlined'} onClick={() => setDateRange(item)}>
                  {item}
                </Button>
              ))}
            </ButtonGroup>
          </Stack>
        </CardContent>
      </Card>

      <Grid2 container spacing={2}>
        {filteredCards.map((item) => (
          <Grid2 key={item.title} size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">{item.title}</Typography>
                  {item.icon}
                </Stack>
                <Typography variant="body1" fontWeight={600}>{item.value}</Typography>
                <Chip size="small" sx={{ mt: 1 }} label={item.trend} />
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Quick Actions</Typography>
              <Stack spacing={1}>
                {quickActions.map((action) => (
                  <Button key={action.label} variant="outlined" startIcon={action.icon}>
                    {action.label}
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Task Harian ({completedTasks}/{tasks.length})</Typography>
              <List dense>
                {tasks.map((task) => (
                  <ListItem key={task.id} disableGutters>
                    <Checkbox checked={task.done} onChange={() => toggleTask(task.id)} />
                    <ListItemText
                      primary={task.label}
                      primaryTypographyProps={{
                        sx: { textDecoration: task.done ? 'line-through' : 'none' },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Agenda Berikutnya</Typography>
              <Stack spacing={1.5}>
                {agendaItems.map((item) => (
                  <Alert key={item.title} severity="info" variant="outlined">
                    <Typography fontWeight={600}>{item.time} • {item.title}</Typography>
                    <Typography variant="body2">Unit: {item.unit}</Typography>
                  </Alert>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Kesehatan Modul</Typography>
                <Chip label={dateRange} size="small" />
              </Stack>
              <Stack spacing={1.5}>
                {moduleHealth.map((item) => (
                  <div key={item.module}>
                    <Stack direction="row" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">{item.module}</Typography>
                      <Typography variant="body2" fontWeight={700}>{item.score}%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={item.score} />
                  </div>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Pusat Alert Operasional</Typography>
                <TextField
                  size="small"
                  select
                  label="Severity"
                  value={severity}
                  onChange={(event) => setSeverity(event.target.value as Severity | 'all')}
                  sx={{ minWidth: 130 }}
                >
                  <MenuItem value="all">Semua</MenuItem>
                  <MenuItem value="high">Tinggi</MenuItem>
                  <MenuItem value="medium">Sedang</MenuItem>
                  <MenuItem value="low">Rendah</MenuItem>
                </TextField>
              </Stack>
              <Stack divider={<Divider flexItem />} spacing={1}>
                {filteredAlerts.map((item) => (
                  <Alert key={item.title} severity={item.severity === 'high' ? 'error' : item.severity === 'medium' ? 'warning' : 'info'}>
                    <Typography fontWeight={600}>{item.title}</Typography>
                    <Typography variant="body2">{item.detail}</Typography>
                  </Alert>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Stack>
  );
};
