import { useQuery } from '@tanstack/react-query';
import { Box, Grid2, Paper, Typography } from '@mui/material';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/shared/components/DataTable';

export const DirectoryPage = () => {
  const units = useQuery({ queryKey: ['units'], queryFn: async () => (await supabase.from('directory_units').select('*')).data ?? [] });
  const people = useQuery({ queryKey: ['people'], queryFn: async () => (await supabase.from('directory_people').select('*,directory_units(nama_unit)')).data ?? [] });

  return (
    <Box>
      <Typography variant="h5" mb={2}>Direktori Pejabat & Unit</Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 4 }}><Paper sx={{ p: 2 }}><Typography variant="h6">Struktur Unit</Typography>{units.data?.map((u: any) => <Typography key={u.id}>• {u.nama_unit}</Typography>)}</Paper></Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <DataTable rows={people.data ?? []} columns={[{ key: 'nama', header: 'Nama' }, { key: 'jabatan', header: 'Jabatan' }, { key: 'kontak', header: 'Kontak' }, { key: 'unit', header: 'Unit', render: (r: any) => r.directory_units?.nama_unit ?? '-' }]} />
        </Grid2>
      </Grid2>
    </Box>
  );
};
