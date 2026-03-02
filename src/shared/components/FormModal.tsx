import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { PropsWithChildren } from 'react';

export const FormModal = ({ open, title, onClose, children }: PropsWithChildren<{ open: boolean; title: string; onClose: () => void; }>) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{children}</DialogContent>
  </Dialog>
);
