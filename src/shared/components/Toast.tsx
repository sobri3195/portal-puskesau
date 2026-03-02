import { Alert, Snackbar } from '@mui/material';

export const Toast = ({ open, message, severity = 'success', onClose }: { open: boolean; message: string; severity?: 'success' | 'error' | 'info' | 'warning'; onClose: () => void; }) => (
  <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
    <Alert onClose={onClose} severity={severity} variant="filled">{message}</Alert>
  </Snackbar>
);
