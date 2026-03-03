import { Card, CardContent, Chip, Grid2, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SpeedIcon from '@mui/icons-material/Speed';

const cards = [
  { title: 'Nota Dinas', value: '12 draft / 5 approved', trend: '+15%', icon: <FactCheckIcon color="primary" /> },
  { title: 'Dokumen SOP', value: '84 dokumen aktif', trend: '+9%', icon: <TrendingUpIcon color="primary" /> },
  { title: 'Agenda Minggu Ini', value: '7 kegiatan', trend: '3 prioritas', icon: <AlarmOnIcon color="primary" /> },
  { title: 'Helpdesk Open', value: '9 tiket', trend: '-2 dari kemarin', icon: <SpeedIcon color="primary" /> },
];

export const DashboardPage = () => (
  <>
    <Typography variant="h4" mb={1}>Dashboard KPI</Typography>
    <Typography color="text.secondary" mb={3}>Ringkasan real-time untuk memantau performa seluruh modul Portal Puskesau.</Typography>
    <Grid2 container spacing={2}>
      {cards.map((item) => (
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
  </>
);
