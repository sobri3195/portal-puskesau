import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, Outlet } from 'react-router-dom';
import { useUiStore } from '@/shared/hooks/useUiStore';
import { useAuthStore } from '@/shared/hooks/useAuthStore';
import { can } from '@/lib/rbac';

const menu = [
  { to: '/app/dashboard', label: 'Dashboard', perm: 'dashboard:view' },
  { to: '/app/notes', label: 'Nota Dinas', perm: 'nota:view' },
  { to: '/app/documents', label: 'Document Center', perm: 'documents:view' },
  { to: '/app/agenda', label: 'Agenda', perm: 'agenda:view' },
  { to: '/app/directory', label: 'Direktori', perm: 'directory:view' },
  { to: '/app/correspondence', label: 'Surat & Disposisi', perm: 'phase2:view' },
  { to: '/app/helpdesk', label: 'Helpdesk', perm: 'phase2:view' },
  { to: '/app/inventory', label: 'Inventaris', perm: 'phase2:view' },
  { to: '/app/service-requests', label: 'Permohonan Layanan', perm: 'phase2:view' },
  { to: '/app/elearning', label: 'E-learning', perm: 'phase2:view' },
];

export const AppLayout = () => {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" onClick={toggleSidebar}><MenuIcon /></IconButton>
          <Typography sx={{ flexGrow: 1 }}>Portal Puskesau</Typography>
          <Typography>{user?.nama} ({user?.role})</Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="persistent" open={sidebarOpen} sx={{ width: 280, '& .MuiDrawer-paper': { width: 280, top: 64 } }}>
        <List>
          {menu.filter((item) => can(user?.role, item.perm as never)).map((item) => (
            <ListItemButton key={item.to} component={Link} to={item.to}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ p: 3, mt: 8, width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
};
