import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { writeAuditLog } from '@/lib/audit';
import { can } from '@/lib/rbac';
import { supabase } from '@/lib/supabase';
import { FormModal } from '@/shared/components/FormModal';
import { DataTable } from '@/shared/components/DataTable';
import { Toast } from '@/shared/components/Toast';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

const romawi = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const schema = z.object({
  klasifikasi: z.enum(['SR', 'R', 'B']), urut: z.string(), tahun: z.string(), kode_satuan: z.string(),
  kepada: z.string(), dari: z.string(), perihal: z.string(), isi: z.string(), tembusan: z.string(), status: z.string().default('DRAFT'),
});
type NoteForm = z.infer<typeof schema>;

export const NotesPage = () => {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [q, setQ] = useState('');
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, reset } = useForm<NoteForm>({ resolver: zodResolver(schema), defaultValues: { klasifikasi: 'SR', status: 'DRAFT' } });

  const notesQuery = useQuery({ queryKey: ['nota'], queryFn: async () => (await supabase.from('nota_dinas').select('*').order('created_at', { ascending: false })).data ?? [] });

  const saveMutation = useMutation({
    mutationFn: async (payload: NoteForm) => {
      const nomor = `${payload.klasifikasi}/ND-${payload.urut}/${romawi[dayjs().month()]}/${payload.tahun}/${payload.kode_satuan}`;
      const save = { ...payload, nomor, tanggal: dayjs().format('YYYY-MM-DD'), tembusan_json: payload.tembusan.split(',').map((t) => t.trim()), created_by: user?.id };
      const { data, error } = await supabase.from('nota_dinas').insert(save).select('*').single();
      if (error) throw error;
      await writeAuditLog({ actor_id: user?.id, action: 'create', entity: 'nota_dinas', entity_id: data.id, metadata_json: { nomor } });
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['nota'] }); setToast('Nota dinas disimpan'); setOpen(false); reset(); },
  });

  const exportPdf = async (note: Record<string, any>) => {
    const doc = new jsPDF();
    doc.text('NOTA DINAS', 20, 20);
    doc.text(`Nomor: ${note.nomor}`, 20, 30);
    doc.text(`Kepada: ${note.kepada}`, 20, 40);
    doc.text(`Dari: ${note.dari}`, 20, 50);
    doc.text(`Perihal: ${note.perihal}`, 20, 60);
    doc.text(note.isi, 20, 70, { maxWidth: 170 });
    const blob = doc.output('blob');
    const filePath = `nota-dinas/${note.id}.pdf`;
    await supabase.storage.from('portal-files').upload(filePath, blob, { upsert: true, contentType: 'application/pdf' });
    const { data } = supabase.storage.from('portal-files').getPublicUrl(filePath);
    await supabase.from('nota_dinas').update({ file_url: data.publicUrl }).eq('id', note.id);
    await writeAuditLog({ actor_id: user?.id, action: 'export', entity: 'nota_dinas', entity_id: note.id, metadata_json: { file_url: data.publicUrl } });
    setToast('PDF berhasil diexport');
  };

  const filtered = useMemo(() => (notesQuery.data ?? []).filter((n: any) => n.perihal?.toLowerCase().includes(q.toLowerCase()) || n.nomor?.toLowerCase().includes(q.toLowerCase())), [notesQuery.data, q]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={2}><Typography variant="h5">Nota Dinas</Typography>{can(user?.role, 'nota:create') && <Button variant="contained" onClick={() => setOpen(true)}>Buat Nota</Button>}</Stack>
      <TextField size="small" placeholder="Cari nomor/perihal" value={q} onChange={(e) => setQ(e.target.value)} sx={{ mb: 2 }} />
      <DataTable rows={filtered} columns={[
        { key: 'nomor', header: 'Nomor' },
        { key: 'perihal', header: 'Perihal' },
        { key: 'status', header: 'Status', render: (r: any) => <Chip label={r.status} size="small" /> },
        { key: 'tanggal', header: 'Tanggal' },
        { key: 'aksi', header: 'Aksi', render: (r: any) => can(user?.role, 'nota:export') ? <Button size="small" onClick={() => exportPdf(r)}>Export PDF</Button> : null },
      ]} />

      <FormModal open={open} title="Buat Nota Dinas" onClose={() => setOpen(false)}>
        <Stack component="form" spacing={2} mt={1} onSubmit={handleSubmit((v) => saveMutation.mutate(v))}>
          <Stack direction="row" spacing={2}><TextField label="Klasifikasi (SR/R/B)" {...register('klasifikasi')} /><TextField label="Nomor Urut" {...register('urut')} /><TextField label="Tahun" {...register('tahun')} /><TextField label="Kode Satuan" {...register('kode_satuan')} /></Stack>
          <TextField label="Kepada" {...register('kepada')} /><TextField label="Dari" {...register('dari')} /><TextField label="Perihal" {...register('perihal')} />
          <TextField label="Isi" multiline minRows={4} {...register('isi')} /><TextField label="Tembusan (pisahkan koma)" {...register('tembusan')} />
          <Box sx={{ p: 2, border: '1px dashed #aaa' }}>
            <Typography variant="subtitle1">Preview Lembar Nota Dinas</Typography>
            <Typography>NOTA DINAS</Typography>
            <Typography>Nomor: {watch('klasifikasi')}/ND-{watch('urut')}/{romawi[dayjs().month()]}/{watch('tahun')}/{watch('kode_satuan')}</Typography>
            <Typography>Kepada: {watch('kepada')}</Typography><Typography>Dari: {watch('dari')}</Typography><Typography>Perihal: {watch('perihal')}</Typography><Typography>{watch('isi')}</Typography>
            <Typography>{dayjs().format('DD MMMM YYYY')}</Typography>
          </Box>
          <Button type="submit" variant="contained" disabled={saveMutation.isPending}>Simpan</Button>
        </Stack>
      </FormModal>
      <Toast open={!!toast} message={toast} onClose={() => setToast('')} />
    </Box>
  );
};
