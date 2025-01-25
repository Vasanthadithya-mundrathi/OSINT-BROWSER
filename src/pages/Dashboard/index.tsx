import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tooltip,
  styled,
  useTheme,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
  '& .MuiAccordionSummary-root': {
    padding: theme.spacing(0, 2),
    '&:hover': {
      backgroundColor: 'rgba(33, 150, 243, 0.08)',
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(2),
  },
}));

const tools = [
  {
    name: 'WHOIS Lookup',
    description: 'Query domain registration details and ownership information',
    icon: <SearchIcon className="card-icon" />,
    path: '/tools/whois',
    guide: 'Enter a domain name to retrieve registration information including registrar details, creation date, expiration date, and nameservers. Useful for domain ownership verification and contact information.',
  },
  {
    name: 'DNS Lookup',
    description: 'Analyze DNS records and domain configurations',
    icon: <DnsIcon className="card-icon" />,
    path: '/tools/dns',
    guide: 'Input a domain to view its DNS records (A, AAAA, MX, TXT, etc.). Helps in understanding domain configuration, mail servers, and DNS-based security measures.',
  },
  {
    name: 'Subdomain Scanner',
    description: 'Discover and map subdomains of target domains',
    icon: <AccountTreeIcon className="card-icon" />,
    path: '/tools/subdomain',
    guide: 'Scan domains to find active subdomains. Uses various techniques including DNS enumeration, SSL certificates, and web crawling. Essential for mapping attack surface.',
  },
  {
    name: 'IP Tool',
    description: 'Investigate IP addresses and network information',
    icon: <RouterIcon className="card-icon" />,
    path: '/tools/ip',
    guide: 'Enter an IP address to get geolocation, ISP information, open ports, and associated domains. Useful for network reconnaissance and threat investigation.',
  },
  {
    name: 'Shadow Personas',
    description: 'Track digital footprints across social platforms',
    icon: <PersonSearchIcon className="card-icon" />,
    path: '/tools/shadow-personas',
    guide: 'Search usernames and email addresses across multiple social platforms. Helps in digital footprint analysis and social media presence mapping.',
  },
  {
    name: 'Dark Web Scanner',
    description: 'Search for compromised data on the dark web',
    icon: <DarkModeIcon className="card-icon" />,
    path: '/tools/dark-web',
    guide: 'Safely scan dark web sources for leaked credentials, personal information, and other sensitive data. Includes historical data from breaches and real-time monitoring.',
  },
  {
    name: 'AI Assistant',
    description: 'Get intelligent insights and analysis assistance',
    icon: <SmartToyIcon className="card-icon" />,
    path: '/tools/ai-assistant',
    guide: 'AI-powered assistant that helps analyze OSINT data, identify patterns, and provide actionable insights. Can process natural language queries and generate reports.',
  },
  {
    name: 'Data Analysis',
    description: 'Analyze patterns and correlations in datasets',
    icon: <AssessmentIcon className="card-icon" />,
    path: '/tools/data-analysis',
    guide: 'Upload and analyze datasets to find patterns, correlations, and anomalies. Supports various data formats and provides visualization tools.',
  },
  {
    name: 'File Scanner',
    description: 'Scan files for malware and security threats',
    icon: <FolderOpenIcon className="card-icon" />,
    path: '/tools/file-scanner',
    guide: 'Upload files to scan for malware, viruses, and other security threats. Uses multiple antivirus engines and provides detailed analysis reports.',
  },
  {
    name: 'Hash Checker',
    description: 'Verify file integrity and check for known malware',
    icon: <SecurityIcon className="card-icon" />,
    path: '/tools/hash-checker',
    guide: 'Input file hashes (MD5, SHA1, SHA256) to check against malware databases and verify file integrity. Includes reputation data from multiple sources.',
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

      <Paper
        sx={{
          mt: 6,
          p: 3,
          backgroundColor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <HelpOutlineIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="h2">
            Tool Guides & Information
          </Typography>
        </Box>
        <Typography variant="body1" color="textSecondary" paragraph>
          Learn how to effectively use each tool for your OSINT investigations
        </Typography>
        <Divider sx={{ my: 2 }} />
        {tools.map((tool) => (
          <StyledAccordion key={tool.name}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 2, color: 'primary.main' }}>{tool.icon}</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {tool.name}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="textSecondary">
                {tool.guide}
              </Typography>
            </AccordionDetails>
          </StyledAccordion>
        ))}
      </Paper>
    </Box>
  );
};

export default Dashboard;
