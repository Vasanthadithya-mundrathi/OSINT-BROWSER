import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchIpInfo } from '../../../store/slices/ipSlice';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';

const IPTool: React.FC = () => {
  const [ip, setIp] = useState('');
  const dispatch = useAppDispatch();
  const { data, loading, error, recentSearches } = useAppSelector((state) => state.ip);

  const handleLookup = async () => {
    if (ip) {
      dispatch(fetchIpInfo(ip));
    }
  };

  const renderPrivacyFlags = () => {
    if (!data?.privacy) return null;
    const flags = Object.entries(data.privacy)
      .filter(([_, value]) => value)
      .map(([key]) => key.toUpperCase());

    return flags.map((flag) => (
      <Chip
        key={flag}
        label={flag}
        color="warning"
        size="small"
        icon={<WarningIcon />}
        sx={{ mr: 1, mb: 1 }}
      />
    ));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        IP Information Tool
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Enter IP address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          disabled={loading}
        />
        <Button
          variant="contained"
          onClick={handleLookup}
          disabled={!ip || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Lookup'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {data && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                <LocationOnIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                Location Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="IP Address"
                    secondary={data.ip}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Location"
                    secondary={`${data.city || ''}, ${data.region || ''}, ${data.country || ''}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Coordinates"
                    secondary={data.loc || 'N/A'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Timezone"
                    secondary={data.timezone || 'N/A'}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                <BusinessIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                Network Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Organization"
                    secondary={data.org || 'N/A'}
                  />
                </ListItem>
                {data.asn && (
                  <>
                    <ListItem>
                      <ListItemText
                        primary="ASN"
                        secondary={`${data.asn.asn} (${data.asn.name})`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Network Type"
                        secondary={data.asn.type || 'N/A'}
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                <SecurityIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                Security Information
              </Typography>
              {renderPrivacyFlags()}
              {data.abuse && (
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Abuse Contact"
                      secondary={data.abuse.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Network"
                      secondary={data.abuse.network}
                    />
                  </ListItem>
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {recentSearches.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Searches
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {recentSearches.map((search) => (
              <Chip
                key={search}
                label={search}
                onClick={() => setIp(search)}
                clickable
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default IPTool;
