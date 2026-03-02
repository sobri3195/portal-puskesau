import { Alert, Typography } from '@mui/material';

export const PlaceholderPage = ({ title }: { title: string }) => (
  <>
    <Typography variant="h5" mb={2}>{title}</Typography>
    <Alert severity="info">Module phase 2 - placeholder siap dikembangkan.</Alert>
  </>
);
