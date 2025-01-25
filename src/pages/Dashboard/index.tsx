import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Icon,
  Tooltip,
  styled,
  useTheme,
} from '@mui/material';
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

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '& .card-icon': {
      transform: 'scale(1.1) rotate(5deg)',
      color: theme.palette.primary.main,
    },
    '& .card-content': {
      backgroundColor: 'rgba(33, 150, 243, 0.08)',
    },
    '& .tool-description': {
      color: theme.palette.text.primary,
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, transparent 0%, rgba(33, 150, 243, 0.1) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  '&:hover::after': {
    opacity: 1,
  },
}));

const CardIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& .card-icon': {
    fontSize: '3rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: theme.palette.text.secondary,
  },
}));

const tools = [
  {
    name: 'WHOIS Lookup',
    description: 'Query domain registration details and ownership information',
    icon: <SearchIcon className="card-icon" />,
    path: '/tools/whois',
  },
  {
    name: 'DNS Lookup',
    description: 'Analyze DNS records and domain configurations',
    icon: <DnsIcon className="card-icon" />,
    path: '/tools/dns',
  },
  {
    name: 'Subdomain Scanner',
    description: 'Discover and map subdomains of target domains',
    icon: <AccountTreeIcon className="card-icon" />,
    path: '/tools/subdomain',
  },
  {
    name: 'IP Tool',
    description: 'Investigate IP addresses and network information',
    icon: <RouterIcon className="card-icon" />,
    path: '/tools/ip',
  },
  {
    name: 'Shadow Personas',
    description: 'Track digital footprints across social platforms',
    icon: <PersonSearchIcon className="card-icon" />,
    path: '/tools/shadow-personas',
  },
  {
    name: 'Dark Web Scanner',
    description: 'Search for compromised data on the dark web',
    icon: <DarkModeIcon className="card-icon" />,
    path: '/tools/dark-web',
  },
  {
    name: 'AI Assistant',
    description: 'Get intelligent insights and analysis assistance',
    icon: <SmartToyIcon className="card-icon" />,
    path: '/tools/ai-assistant',
  },
  {
    name: 'Data Analysis',
    description: 'Analyze patterns and correlations in datasets',
    icon: <AssessmentIcon className="card-icon" />,
    path: '/tools/data-analysis',
  },
  {
    name: 'File Scanner',
    description: 'Scan files for malware and security threats',
    icon: <FolderOpenIcon className="card-icon" />,
    path: '/tools/file-scanner',
  },
  {
    name: 'Hash Checker',
    description: 'Verify file integrity and check for known malware',
    icon: <SecurityIcon className="card-icon" />,
    path: '/tools/hash-checker',
  },
];

const Dashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 600,
          textAlign: 'center',
          mb: 4,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '4px',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '2px',
          },
        }}
      >
        OSINT Browser Tools
      </Typography>
      <Typography
        variant="subtitle1"
        color="textSecondary"
        align="center"
        sx={{ mb: 6 }}
      >
        Powerful tools for open-source intelligence gathering and analysis
      </Typography>
      <Grid container spacing={3}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={tool.name}>
            <Tooltip
              title={`Launch ${tool.name}`}
              placement="top"
              arrow
              enterDelay={500}
            >
              <StyledCard component={Link} to={tool.path}>
                <CardContent
                  className="card-content"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: '100%',
                    p: 3,
                  }}
                >
                  <CardIcon>{tool.icon}</CardIcon>
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    {tool.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="tool-description"
                    sx={{
                      transition: 'color 0.3s ease-in-out',
                      flex: 1,
                    }}
                  >
                    {tool.description}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
