import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { searchDarkWeb, clearResults } from '../../../store/slices/darkWebSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Launch as LaunchIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const DarkWebScanner: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  
  const { results, loading, error } = useSelector((state: RootState) => state.darkWeb);

  // Clear results when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearResults());
    };
  }, [dispatch]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setSnackbar({ open: true, message: 'Please enter a search query' });
      return;
    }

    try {
      await dispatch(searchDarkWeb(query)).unwrap();
    } catch (err) {
      setSnackbar({ open: true, message: 'Search failed. Please try again.' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: 'Copied to clipboard' });
  };

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5">Dark Web Scanner</Typography>
        <Chip
          label="Beta"
          color="warning"
          size="small"
          icon={<WarningIcon />}
          sx={{ height: 20 }}
        />
      </Box>

      <Alert severity="warning" sx={{ mb: 2 }}>
        This tool searches for information on Tor hidden services and dark web markets.
        Use responsibly and be aware that some content may be sensitive or disturbing.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              label="Search Query"
              variant="outlined"
              placeholder="Enter email, username, domain, or keyword"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleSearch();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              startIcon={<SecurityIcon />}
            >
              {loading ? 'Searching...' : 'Search Dark Web'}
            </Button>
          </Grid>
        </Grid>

        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Searching dark web sources...
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {results.map((result, index) => (
            <Card key={index}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {result.title}
                  </Typography>
                  <Chip
                    label={`Risk: ${result.riskLevel.toUpperCase()}`}
                    color={getRiskLevelColor(result.riskLevel)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {result.content}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {result.category.map((cat, i) => (
                    <Chip
                      key={i}
                      label={cat}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Copy URL">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(result.url)}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {result.url.startsWith('http') && (
                      <Tooltip title="Open URL (Caution)">
                        <IconButton
                          size="small"
                          onClick={() => window.open(result.url, '_blank')}
                        >
                          <LaunchIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Source: {result.source} • Found: {new Date(result.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : !loading && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            Enter a search query to begin scanning the dark web
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

export default DarkWebScanner;
