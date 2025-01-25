import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  TablePagination,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import { Download, ContentCopy } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDnsRecords, addRecentSearch } from '@/store/slices/dnsSlice';

const isValidDomain = (domain: string) => {
  const pattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return pattern.test(domain);
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dns-tabpanel-${index}`}
      aria-labelledby={`dns-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DnsLookup() {
  const [domain, setDomain] = useState('');
  const [validationError, setValidationError] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const dispatch = useAppDispatch();
  const { records, loading, error, recentSearches } = useAppSelector((state) => state.dns);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setPage(0); // Reset pagination on new search

    if (!domain) {
      setValidationError('Please enter a domain');
      return;
    }

    if (!isValidDomain(domain)) {
      setValidationError('Please enter a valid domain name');
      return;
    }

    dispatch(addRecentSearch(domain));
    dispatch(fetchDnsRecords(domain));
  };

  const handleRecentSearch = (domain: string) => {
    setDomain(domain);
    setPage(0); // Reset pagination on recent search
    dispatch(fetchDnsRecords(domain));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: 'Copied to clipboard' });
  };

  const handleExport = () => {
    if (!records.length) return;

    const exportData = {
      domain,
      records,
      timestamp: new Date().toISOString(),
      tool: 'OSINT Browser - DNS Lookup'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dns-lookup-${domain}-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const recordTypes = ['A', 'MX', 'NS', 'TXT'];
  const filteredRecords = records.filter(record => record.type === recordTypes[selectedTab]);
  const paginatedRecords = filteredRecords.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        DNS Lookup
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Query DNS records including A, MX, NS, and TXT records for any domain.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Enter domain name"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                error={Boolean(validationError)}
                helperText={validationError}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={1}>
                <Grid item xs>
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </Grid>
                {records.length > 0 && (
                  <Grid item>
                    <Tooltip title="Export Results">
                      <IconButton onClick={handleExport} color="primary">
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {recentSearches.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Recent Searches
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {recentSearches.slice(0, 5).map((search, index) => (
              <Chip
                key={index}
                label={search}
                onClick={() => handleRecentSearch(search)}
                icon={<HistoryIcon />}
              />
            ))}
          </Box>
        </Paper>
      )}

      {records.length > 0 && (
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => {
              setSelectedTab(newValue);
              setPage(0); // Reset pagination on tab change
            }}
            variant="fullWidth"
          >
            {recordTypes.map((type, index) => (
              <Tab
                key={type}
                label={`${type} Records (${records.filter(r => r.type === type).length})`}
                id={`dns-tab-${index}`}
              />
            ))}
          </Tabs>

          {recordTypes.map((type, index) => (
            <TabPanel key={type} value={selectedTab} index={index}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Record</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>TTL</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRecords.map((record, recordIndex) => (
                      <TableRow key={recordIndex}>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{record.value}</TableCell>
                        <TableCell>{record.ttl}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Copy Value">
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(record.value)}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredRecords.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </TabPanel>
          ))}
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );
}
