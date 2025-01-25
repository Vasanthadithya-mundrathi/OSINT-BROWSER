import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { scanSubdomains, clearResults } from '../../../store/slices/subdomainSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Grid,
  Tooltip,
  IconButton,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Launch as LaunchIcon,
  ContentCopy as ContentCopyIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const SubdomainScanner: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [domain, setDomain] = useState('');
  const [scanDepth, setScanDepth] = useState('medium');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [lastScanTime, setLastScanTime] = useState<number | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const { results, loading, error } = useSelector((state: RootState) => state.subdomain);

  // Clear results when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearResults());
    };
  }, [dispatch]);

  // Reset error state when domain changes
  useEffect(() => {
    if (error) {
      dispatch(clearResults());
    }
  }, [domain, dispatch, error]);

  const handleScan = async () => {
    if (!domain) {
      setSnackbar({ open: true, message: 'Please enter a domain' });
      return;
    }
    
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    if (!domainRegex.test(domain)) {
      setSnackbar({ open: true, message: 'Please enter a valid domain name' });
      return;
    }

    if (lastScanTime && Date.now() - lastScanTime < 60000) {
      setSnackbar({
        open: true,
        message: `Please wait ${Math.ceil((60000 - (Date.now() - lastScanTime)) / 1000)} seconds before starting a new scan`,
      });
      return;
    }

    try {
      dispatch(clearResults());
      const result = await dispatch(scanSubdomains({ domain, depth: scanDepth })).unwrap();
      setLastScanTime(Date.now());
      
      if (result.length === 0) {
        setSnackbar({ open: true, message: 'No subdomains found' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to start scan. Please try again.' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: 'Copied to clipboard' });
  };

  const handleExport = () => {
    if (!results.length) return;

    const exportData = {
      domain,
      scanDepth,
      results,
      timestamp: new Date().toISOString(),
      tool: 'OSINT Browser - Subdomain Scanner'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subdomains-${domain}-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const columns: GridColDef[] = [
    {
      field: 'subdomain',
      headerName: 'Subdomain',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>{params.value}</Typography>
          <Tooltip title="Copy">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(params.value as string);
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://${params.value}`, '_blank');
              }}
            >
              <LaunchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: 'ip',
      headerName: 'IP Address',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>{params.value}</Typography>
          {params.value && params.value !== 'N/A' && (
            <Tooltip title="Copy">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(params.value as string);
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        let color = 'error.main';
        let statusText = params.value === 0 ? 'Offline' : params.value;
        
        if (params.value >= 200 && params.value < 300) {
          color = 'success.main';
        } else if (params.value >= 300 && params.value < 400) {
          color = 'info.main';
        } else if (params.value >= 400 && params.value < 500) {
          color = 'warning.main';
        }

        return (
          <Typography sx={{ color }}>
            {statusText}
          </Typography>
        );
      },
    },
    {
      field: 'server',
      headerName: 'Server',
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) => (
        <Typography>
          {params.value === 'N/A' ? '-' : params.value}
        </Typography>
      ),
    },
    {
      field: 'lastChecked',
      headerName: 'Last Checked',
      flex: 0.8,
      minWidth: 180,
      valueFormatter: (params: { value: string | number | Date }) => {
        try {
          return new Date(params.value).toLocaleString();
        } catch (error) {
          return 'Invalid Date';
        }
      },
    },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Subdomain Scanner
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Domain"
              variant="outlined"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={loading}
              error={Boolean(error)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Scan Depth</InputLabel>
              <Select
                value={scanDepth}
                label="Scan Depth"
                onChange={(e) => setScanDepth(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="low">Low (Fast)</MenuItem>
                <MenuItem value="medium">Medium (Recommended)</MenuItem>
                <MenuItem value="high">High (Slow)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleScan}
                disabled={loading || !domain}
                fullWidth
              >
                {loading ? 'Scanning...' : 'Start Scan'}
              </Button>
              {results.length > 0 && (
                <Tooltip title="Export Results">
                  <IconButton onClick={handleExport} disabled={loading}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Grid>
        </Grid>

        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={100} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Scanning subdomains...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {results.length > 0 ? (
        <Paper sx={{ flexGrow: 1, minHeight: 400 }}>
          <DataGrid
            rows={results.map((result, index) => ({
              id: index,
              ...result,
              status: result.status || 0,
              ip: result.ip || 'N/A',
              server: result.server || 'N/A',
              lastChecked: result.lastChecked || new Date().toISOString()
            }))}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            loading={loading}
            sx={{
              '& .MuiDataGrid-cell': {
                whiteSpace: 'normal',
                lineHeight: 'normal',
              },
              height: '100%'
            }}
          />
        </Paper>
      ) : !loading && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            Enter a domain and click "Start Scan" to begin scanning for subdomains
          </Typography>
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
};

export default SubdomainScanner;
