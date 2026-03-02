import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { can } from '@/lib/rbac';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/shared/components/DataTable';
import { FormModal } from '@/shared/components/FormModal';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

const schema = z.object({ judul: z.string(), lokasi: z.string(), mulai: z.string(), selesai: z.string(), unit: z.string(), deskripsi: z.string() });

export const AgendaPage = () => {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const query = useQuery({ queryKey: ['agenda'], queryFn: async () => (await supabase.from('agenda_events').select('*').order('mulai')).data ?? [] });

  const save = useMutation({ mutationFn: async (v: z.infer<typeof schema>) => supabase.from('agenda_events').insert(v), onSuccess: () => { qc.invalidateQueries({ queryKey: ['agenda'] }); setOpen(false); reset(); } });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={2}><Typography variant="h5">Agenda</Typography>{can(user?.role, 'agenda:manage') && <Button variant="contained" onClick={() => setOpen(true)}>Tambah Event</Button>}</Stack>
      <DataTable rows={query.data ?? []} columns={[{ key: 'judul', header: 'Judul' }, { key: 'lokasi', header: 'Lokasi' }, { key: 'mulai', header: 'Mulai' }, { key: 'selesai', header: 'Selesai' }, { key: 'unit', header: 'Unit' }]} />
      <FormModal open={open} title="Tambah Agenda" onClose={() => setOpen(false)}>
        <Stack component="form" spacing={2} mt={1} onSubmit={handleSubmit((v) => save.mutate(v))}>
          <TextField label="Judul" {...register('judul')} /><TextField label="Lokasi" {...register('lokasi')} /><TextField type="datetime-local" {...register('mulai')} /><TextField type="datetime-local" {...register('selesai')} /><TextField label="Unit" {...register('unit')} /><TextField label="Deskripsi" multiline minRows={3} {...register('deskripsi')} />
          <Button type="submit" variant="contained">Simpan</Button>
        </Stack>
      </FormModal>
    </Box>
  );
};
