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
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchWhoisData, addRecentSearch } from '@/store/slices/whoisSlice';

const isValidDomain = (domain: string) => {
  const pattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return pattern.test(domain);
};

export default function WhoisLookup() {
  const [domain, setDomain] = useState('');
  const [validationError, setValidationError] = useState('');
  const dispatch = useAppDispatch();
  const { data, loading, error, recentSearches } = useAppSelector((state) => state.whois);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!domain) {
      setValidationError('Please enter a domain');
      return;
    }

    if (!isValidDomain(domain)) {
      setValidationError('Please enter a valid domain name');
      return;
    }

    dispatch(addRecentSearch(domain));
    dispatch(fetchWhoisData(domain));
  };

  const handleRecentSearch = (domain: string) => {
    setDomain(domain);
    dispatch(fetchWhoisData(domain));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        WHOIS Lookup
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Get detailed information about domain registration, ownership, and nameservers.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Enter domain name"
                variant="outlined"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                error={!!validationError}
                helperText={validationError}
                placeholder="example.com"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                Lookup
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {recentSearches.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <HistoryIcon sx={{ mr: 1 }} fontSize="small" />
            Recent Searches
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {recentSearches.map((search) => (
              <Chip
                key={search}
                label={search}
                onClick={() => handleRecentSearch(search)}
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {data && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Results for {domain}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Registrar
              </Typography>
              <Typography variant="body1">{data.registrar || 'N/A'}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Registration Date
              </Typography>
              <Typography variant="body1">
                {data.createdDate ? new Date(data.createdDate).toLocaleDateString() : 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Expiry Date
              </Typography>
              <Typography variant="body1">
                {data.expiryDate ? new Date(data.expiryDate).toLocaleDateString() : 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Name Servers
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {data.nameServers?.map((ns) => (
                  <Chip key={ns} label={ns} size="small" />
                )) || 'N/A'}
              </Box>
            </Grid>

            {data.contacts?.registrant && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Registrant Information
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {data.contacts.registrant.organization && (
                    <Typography variant="body2">
                      Organization: {data.contacts.registrant.organization}
                    </Typography>
                  )}
                  {data.contacts.registrant.address && (
                    <Typography variant="body2">
                      Address: {data.contacts.registrant.address}
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
