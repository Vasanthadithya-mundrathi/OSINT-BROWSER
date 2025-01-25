import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, Avatar, Chip, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InterestsIcon from '@mui/icons-material/Interests';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';

interface Profile {
  platform: string;
  username: string;
  url: string;
  exists: boolean;
  lastChecked: string;
  avatar?: string;
  data?: Record<string, any>;
}

interface SearchResults {
  username: string;
  profiles: Profile[];
  emailAddresses: string[];
  phoneNumbers: string[];
  images: Array<{
    url: string;
    source: string;
    type: string;
  }>;
  locations: string[];
  interests: string[];
  associations: string[];
  timeline: Array<{
    date: string;
    platform: string;
    event: string;
    details?: Record<string, any>;
  }>;
  metadata: {
    searchTimestamp: string;
    query: string;
    platformsCovered: string[];
    errors: Array<{
      platform: string;
      status?: number;
      message?: string;
    }>;
  };
}

const ShadowPersonas: React.FC = () => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResults | null>(null);

  const handleSearch = async () => {
    if (!query) {
      setError('Please enter a username, email, or phone number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/social-media/${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch results');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Shadow Personas - OSINT Tool
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Enter a username, email address, or phone number to search across multiple platforms.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Username / Email / Phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Profiles Section */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profiles Found
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {results.profiles.map((profile, index) => (
                  <Card key={index} sx={{ minWidth: 275, maxWidth: 345 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {profile.avatar ? (
                          <Avatar src={profile.avatar} sx={{ mr: 2 }} />
                        ) : (
                          <Avatar sx={{ mr: 2 }}>{profile.platform[0]}</Avatar>
                        )}
                        <Typography variant="h6">{profile.platform}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Username: {profile.username}
                      </Typography>
                      <Button
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mt: 1 }}
                      >
                        View Profile
                      </Button>
                      {profile.data && (
                        <Box sx={{ mt: 2 }}>
                          {Object.entries(profile.data).map(([key, value]) => (
                            <Typography key={key} variant="body2">
                              {key}: {value?.toString()}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {results.emailAddresses.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1 }} /> Email Addresses
                    </Typography>
                    {results.emailAddresses.map((email, index) => (
                      <Chip key={index} label={email} sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                )}
                {results.phoneNumbers.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ mr: 1 }} /> Phone Numbers
                    </Typography>
                    {results.phoneNumbers.map((phone, index) => (
                      <Chip key={index} label={phone} sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {results.locations.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon sx={{ mr: 1 }} /> Locations
                    </Typography>
                    {results.locations.map((location, index) => (
                      <Chip key={index} label={location} sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                )}
                {results.interests.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <InterestsIcon sx={{ mr: 1 }} /> Interests
                    </Typography>
                    {results.interests.map((interest, index) => (
                      <Chip key={index} label={interest} sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                )}
                {results.associations.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <GroupIcon sx={{ mr: 1 }} /> Associations
                    </Typography>
                    {results.associations.map((association, index) => (
                      <Chip key={index} label={association} sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Timeline */}
          {results.timeline.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimelineIcon sx={{ mr: 1 }} /> Timeline
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {results.timeline.map((event, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">
                        {new Date(event.date).toLocaleDateString()} - {event.platform}
                      </Typography>
                      <Typography variant="body2">{event.event}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Error Log */}
          {results.metadata.errors.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Search Errors
                </Typography>
                {results.metadata.errors.map((error, index) => (
                  <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                    {error.platform}: {error.message}
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ShadowPersonas;
