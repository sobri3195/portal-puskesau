import { useMemo, useState } from 'react';
import { AppBar, Avatar, Badge, Box, Chip, Divider, Drawer, IconButton, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, Stack, TextField, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import FolderIcon from '@mui/icons-material/FolderOutlined';
import EventIcon from '@mui/icons-material/EventOutlined';
import ContactsIcon from '@mui/icons-material/ContactsOutlined';
import MailIcon from '@mui/icons-material/ForwardToInboxOutlined';
import SupportIcon from '@mui/icons-material/HeadsetMicOutlined';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import RequestPageIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospitalOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAltOutlined';
import PaymentsIcon from '@mui/icons-material/PaymentsOutlined';
import MedicationIcon from '@mui/icons-material/MedicationOutlined';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CircleIcon from '@mui/icons-material/Circle';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useUiStore } from '@/shared/hooks/useUiStore';
import { useAuthStore } from '@/shared/hooks/useAuthStore';
import { can } from '@/lib/rbac';

const menu = [
  { to: '/app/dashboard', label: 'Dashboard', perm: 'dashboard:view', icon: <DashboardIcon fontSize="small" /> },
  { to: '/app/notes', label: 'Nota Dinas', perm: 'nota:view', icon: <DescriptionIcon fontSize="small" /> },
  { to: '/app/documents', label: 'Document Center', perm: 'documents:view', icon: <FolderIcon fontSize="small" /> },
  { to: '/app/agenda', label: 'Agenda', perm: 'agenda:view', icon: <EventIcon fontSize="small" /> },
  { to: '/app/directory', label: 'Direktori', perm: 'directory:view', icon: <ContactsIcon fontSize="small" /> },
  { to: '/app/correspondence', label: 'Surat & Disposisi', perm: 'phase2:view', icon: <MailIcon fontSize="small" /> },
  { to: '/app/helpdesk', label: 'Helpdesk', perm: 'phase2:view', icon: <SupportIcon fontSize="small" /> },
  { to: '/app/inventory', label: 'Inventaris', perm: 'phase2:view', icon: <InventoryIcon fontSize="small" /> },
  { to: '/app/service-requests', label: 'Permohonan Layanan', perm: 'phase2:view', icon: <RequestPageIcon fontSize="small" /> },
  { to: '/app/elearning', label: 'E-learning', perm: 'phase2:view', icon: <SchoolIcon fontSize="small" /> },
  { to: '/app/telemedicine', label: 'Telemedicine', perm: 'phase2:view', icon: <LocalHospitalIcon fontSize="small" /> },
  { to: '/app/hr', label: 'Kepegawaian', perm: 'phase2:view', icon: <PeopleAltIcon fontSize="small" /> },
  { to: '/app/finance', label: 'Keuangan', perm: 'phase2:view', icon: <PaymentsIcon fontSize="small" /> },
  { to: '/app/pharmacy', label: 'Farmasi', perm: 'phase2:view', icon: <MedicationIcon fontSize="small" /> },
  { to: '/app/reports', label: 'Laporan Kinerja', perm: 'phase2:view', icon: <AssessmentIcon fontSize="small" /> },
];

export const AppLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const location = useLocation();

  const filteredMenu = useMemo(
    () => menu.filter((item) => can(user?.role, item.perm as never) && item.label.toLowerCase().includes(search.toLowerCase())),
    [search, user?.role],
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ backdropFilter: 'blur(8px)', bgcolor: 'rgba(9, 35, 70, 0.92)' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={toggleSidebar} sx={{ mr: 1 }}><MenuIcon /></IconButton>
          <Stack sx={{ flexGrow: 1 }}>
            <Typography fontWeight={700}>Portal Puskesau</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Pusat Komando Operasional Administrasi</Typography>
          </Stack>
          <Chip size="small" icon={<CircleIcon color="success" />} label="Sistem Online" color="default" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }} />
          <Tooltip title={`${user?.nama} (${user?.role})`}>
            <IconButton sx={{ ml: 1 }}>
              <Badge overlap="circular" color="success" variant="dot">
                <Avatar>{user?.nama?.charAt(0).toUpperCase()}</Avatar>
              </Badge>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{ width: 300, '& .MuiDrawer-paper': { width: 300, top: isMobile ? 0 : 64, borderRight: 0, p: 2, bgcolor: '#0E2442', color: 'white' } }}
      >
        <TextField
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari modul"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: 'white', bgcolor: 'rgba(255,255,255,0.08)' } }}
        />
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
        <List sx={{ mt: 1 }}>
          {filteredMenu.map((item) => (
            <ListItemButton key={item.to} component={Link} to={item.to} onClick={isMobile ? toggleSidebar : undefined} selected={location.pathname === item.to} sx={{ borderRadius: 2, mb: 0.5, '&.Mui-selected': { bgcolor: 'rgba(144,202,249,0.2)' } }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ p: { xs: 2, md: 3 }, mt: 9, width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
};
