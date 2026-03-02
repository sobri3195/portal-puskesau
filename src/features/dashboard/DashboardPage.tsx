import { Card, CardContent, Grid2, Typography } from '@mui/material';

const cards = [
  ['Nota Dinas', '12 draft / 5 approved'],
  ['Dokumen SOP', '84 dokumen aktif'],
  ['Agenda Minggu Ini', '7 kegiatan'],
  ['Helpdesk Open', '9 tiket'],
];

export const DashboardPage = () => (
  <>
    <Typography variant="h4" mb={3}>Dashboard KPI</Typography>
    <Grid2 container spacing={2}>
      {cards.map(([title, value]) => (
        <Grid2 key={title} size={{ xs: 12, md: 3 }}>
          <Card><CardContent><Typography variant="h6">{title}</Typography><Typography>{value}</Typography></CardContent></Card>
        </Grid2>
      ))}
    </Grid2>
  </>
);
