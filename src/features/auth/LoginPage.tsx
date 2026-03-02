import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
type FormValue = z.infer<typeof schema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const setUser = useAuthStore((s) => s.setUser);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValue>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValue) => {
    setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword(values);
    if (authError || !data.user) return setError(authError?.message ?? 'Gagal login');
    const { data: profile } = await supabase.from('users_profile').select('*').eq('id', data.user.id).single();
    if (!profile) return setError('Profil tidak ditemukan');
    setUser(profile);
    navigate('/app/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Paper sx={{ p: 4, width: 380 }}>
        <Typography variant="h5" mb={2}>Login Portal Puskesau</Typography>
        <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
          <TextField label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          <TextField label="Password" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" disabled={isSubmitting}>Masuk</Button>
        </Stack>
      </Paper>
    </Box>
  );
};
