import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Collapse,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DnsIcon from '@mui/icons-material/Dns';
import LanguageIcon from '@mui/icons-material/Language';
import RouterIcon from '@mui/icons-material/Router';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DescriptionIcon from '@mui/icons-material/Description';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate, useLocation } from 'react-router-dom';

interface ToolItem {
  name: string;
  path: string;
  icon: string;
}

interface ToolCategory {
  category: string;
  items: ToolItem[];
}

interface SidebarProps {
  tools: ToolCategory[];
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'search':
      return <SearchIcon />;
    case 'dns':
      return <DnsIcon />;
    case 'language':
      return <LanguageIcon />;
    case 'router':
      return <RouterIcon />;
    case 'dashboard':
      return <DashboardIcon />;
    case 'analytics':
      return <AnalyticsIcon />;
    case 'description':
      return <DescriptionIcon />;
    case 'fingerprint':
      return <FingerprintIcon />;
    case 'psychology':
      return <PsychologyIcon />;
    case 'person_search':
      return <PersonSearchIcon />;
    default:
      return <SearchIcon />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ tools }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openCategories, setOpenCategories] = useState<string[]>(['Recon Tools']);

  const handleCategoryClick = (category: string) => {
    setOpenCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const isSelected = (path: string) => location.pathname === path;

  return (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          OSINT Browser
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/'}
            onClick={() => navigate('/')}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {tools.map((category) => (
          <React.Fragment key={category.category}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleCategoryClick(category.category)}>
                <ListItemText primary={category.category} />
                {openCategories.includes(category.category) ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>
            <Collapse
              in={openCategories.includes(category.category)}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {category.items.map((item) => (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      selected={isSelected(item.path)}
                      onClick={() => navigate(item.path)}
                    >
                      <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
