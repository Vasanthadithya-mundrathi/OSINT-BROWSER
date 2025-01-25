import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
} from '@mui/material';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import DnsIcon from '@mui/icons-material/Dns';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RouterIcon from '@mui/icons-material/Router';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SecurityIcon from '@mui/icons-material/Security';
import GitHubIcon from '@mui/icons-material/GitHub';

const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  boxShadow: '4px 0 8px rgba(0, 0, 0, 0.1)',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 0,
  marginRight: theme.spacing(3),
  justifyContent: 'center',
  transition: theme.transitions.create(['margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '& svg': {
    fontSize: '1.5rem',
    transition: theme.transitions.create(['transform', 'color'], {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  opacity: 1,
  transition: theme.transitions.create(['opacity', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  '& .MuiTypography-root': {
    fontSize: '0.95rem',
    fontWeight: 500,
  },
}));

const StyledListItem = styled(ListItemButton)<{ selected?: boolean }>(({ theme, selected }) => ({
  marginX: theme.spacing(1),
  marginY: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  transition: theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'translateX(4px)',
    '& .MuiListItemIcon-root svg': {
      transform: 'scale(1.1)',
      color: theme.palette.primary.main,
    },
  },
  ...(selected && {
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(33, 150, 243, 0.12)',
    },
    '& .MuiListItemIcon-root svg': {
      color: theme.palette.primary.main,
    },
  }),
}));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'WHOIS Lookup', icon: <SearchIcon />, path: '/whois' },
    { text: 'DNS Lookup', icon: <DnsIcon />, path: '/dns' },
    { text: 'Subdomain Scanner', icon: <AccountTreeIcon />, path: '/subdomain-scanner' },
    { text: 'IP Tool', icon: <RouterIcon />, path: '/ip-tool' },
    { text: 'Shadow Personas', icon: <PersonSearchIcon />, path: '/shadow-personas' },
    { text: 'Dark Web Scanner', icon: <DarkModeIcon />, path: '/dark-web' },
    { text: 'AI Assistant', icon: <SmartToyIcon />, path: '/ai-assistant' },
    { text: 'Data Analysis', icon: <AssessmentIcon />, path: '/data-analysis' },
    { text: 'File Scanner', icon: <FolderOpenIcon />, path: '/file-scanner' },
    { text: 'Hash Checker', icon: <SecurityIcon />, path: '/hash-checker' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            OSINT Browser
          </Typography>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mr: 2,
              display: { xs: 'none', sm: 'block' },
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            Developed by SHADOW
          </Typography>
          <IconButton
            color="inherit"
            component="a"
            href="https://github.com/Vasanthadithya-mundrathi/OSINT-BROWSER"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              '&:hover': {
                transform: 'scale(1.1)',
              },
              transition: 'transform 0.2s',
            }}
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <StyledDrawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <StyledListItem
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <StyledListItemIcon>
                  {item.icon}
                </StyledListItemIcon>
                <StyledListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    visibility: open ? 'visible' : 'hidden',
                  }}
                />
              </StyledListItem>
            </ListItem>
          ))}
        </List>
      </StyledDrawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
