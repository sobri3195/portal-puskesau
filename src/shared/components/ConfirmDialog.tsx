import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export const ConfirmDialog = ({ open, title, message, onCancel, onConfirm }: { open: boolean; title: string; message: string; onCancel: () => void; onConfirm: () => void; }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>Batal</Button>
      <Button onClick={onConfirm} variant="contained">Konfirmasi</Button>
    </DialogActions>
  </Dialog>
);
