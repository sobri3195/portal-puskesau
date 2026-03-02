import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { writeAuditLog } from '@/lib/audit';
import { can } from '@/lib/rbac';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/shared/components/DataTable';
import { FormModal } from '@/shared/components/FormModal';
import { Toast } from '@/shared/components/Toast';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

const schema = z.object({ kategori: z.string(), judul: z.string(), versi: z.string(), status_approval: z.string().default('DRAFT') });
type Form = z.infer<typeof schema>;

export const DocumentsPage = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState('');
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm<Form>({ resolver: zodResolver(schema) });
  const docs = useQuery({ queryKey: ['documents'], queryFn: async () => (await supabase.from('documents').select('*').order('id', { ascending: false })).data ?? [] });

  const upload = useMutation({
    mutationFn: async (values: Form) => {
      let file_url = '';
      if (file) {
        const path = `documents/${Date.now()}-${file.name}`;
        await supabase.storage.from('portal-files').upload(path, file, { upsert: true });
        file_url = supabase.storage.from('portal-files').getPublicUrl(path).data.publicUrl;
      }
      const { data, error } = await supabase.from('documents').insert({ ...values, file_url, owner_id: user?.id }).select('*').single();
      if (error) throw error;
      await writeAuditLog({ actor_id: user?.id, action: 'upload', entity: 'documents', entity_id: data.id, metadata_json: { judul: values.judul } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['documents'] }); setToast('Dokumen tersimpan'); setOpen(false); reset(); },
  });

  const approve = async (id: string) => {
    await supabase.from('documents').update({ status_approval: 'APPROVED', approved_by: user?.id, approved_at: new Date().toISOString() }).eq('id', id);
    await writeAuditLog({ actor_id: user?.id, action: 'approve', entity: 'documents', entity_id: id });
    qc.invalidateQueries({ queryKey: ['documents'] });
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={2}><Typography variant="h5">SOP & Document Center</Typography>{can(user?.role, 'documents:upload') && <Button variant="contained" onClick={() => setOpen(true)}>Upload</Button>}</Stack>
      <DataTable rows={docs.data ?? []} columns={[
        { key: 'judul', header: 'Judul' }, { key: 'kategori', header: 'Kategori' }, { key: 'versi', header: 'Versi' },
        { key: 'status_approval', header: 'Status', render: (r: any) => <Chip label={r.status_approval} size="small" /> },
        { key: 'aksi', header: 'Aksi', render: (r: any) => can(user?.role, 'documents:approve') && r.status_approval !== 'APPROVED' ? <Button size="small" onClick={() => approve(r.id)}>Approve</Button> : null },
      ]} />
      <FormModal open={open} title="Upload Dokumen" onClose={() => setOpen(false)}>
        <Stack component="form" spacing={2} mt={1} onSubmit={handleSubmit((v) => upload.mutate(v))}>
          <TextField label="Kategori" {...register('kategori')} /><TextField label="Judul" {...register('judul')} /><TextField label="Versi" {...register('versi')} />
          <Button variant="outlined" component="label">Pilih File<input type="file" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></Button>
          <Button variant="contained" type="submit">Simpan</Button>
        </Stack>
      </FormModal>
      <Toast open={!!toast} message={toast} onClose={() => setToast('')} />
    </Box>
  );
};
