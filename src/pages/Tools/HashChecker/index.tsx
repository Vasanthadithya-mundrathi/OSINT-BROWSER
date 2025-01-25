import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Fingerprint as FingerprintIcon,
  ContentCopy as ContentCopyIcon,
  Search as SearchIcon,
  UploadFile as UploadIcon,
} from '@mui/icons-material';

type HashType = 'md5' | 'sha1' | 'sha256';

interface HashResult {
  hash: string;
  type: HashType;
  matches: {
    database: string;
    result: string;
    severity: 'clean' | 'suspicious' | 'malicious';
    timestamp: string;
  }[];
}

const HashChecker: React.FC = () => {
  const [hashInput, setHashInput] = useState('');
  const [hashType, setHashType] = useState<HashType>('md5');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HashResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      setError(null);
      setResults(null);
      // TODO: Calculate file hash
    }
  };

  const calculateHash = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement actual hash calculation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockHash = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
      setHashInput(mockHash);
    } catch (err) {
      setError('Failed to calculate hash. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkHash = async () => {
    if (!hashInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // TODO: Implement actual hash checking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResults({
        hash: hashInput,
        type: hashType,
        matches: [
          {
            database: 'VirusTotal',
            result: 'No matches found',
            severity: 'clean',
            timestamp: new Date().toISOString()
          },
          {
            database: 'MalwareDB',
            result: 'Potential malware signature',
            severity: 'suspicious',
            timestamp: new Date().toISOString()
          }
        ]
      });
    } catch (err) {
      setError('Failed to check hash. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSeverityColor = (severity: string): "success" | "warning" | "error" | "default" => {
    switch (severity) {
      case 'clean':
        return 'success';
      case 'suspicious':
        return 'warning';
      case 'malicious':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FingerprintIcon />
        <Typography variant="h5">Hash Checker</Typography>
      </Box>

      <Alert severity="info">
        Check file hashes against multiple threat databases or calculate file hashes.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadIcon />}
                disabled={loading}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>
              {file && (
                <Button
                  variant="contained"
                  onClick={calculateHash}
                  disabled={loading}
                  startIcon={<FingerprintIcon />}
                >
                  Calculate Hash
                </Button>
              )}
            </Box>
          </Grid>

          {file && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Typography>
            </Grid>
          )}

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Hash Type</InputLabel>
              <Select
                value={hashType}
                label="Hash Type"
                onChange={(e) => setHashType(e.target.value as HashType)}
                disabled={loading}
              >
                <MenuItem value="md5">MD5</MenuItem>
                <MenuItem value="sha1">SHA-1</MenuItem>
                <MenuItem value="sha256">SHA-256</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              label="Hash Value"
              variant="outlined"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              disabled={loading}
              placeholder="Enter hash value or calculate from file..."
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={checkHash}
              disabled={loading || !hashInput.trim()}
              sx={{ height: '56px' }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  Check
                  <SearchIcon sx={{ ml: 1 }} />
                </>
              )}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      {results && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Hash Check Results</Typography>
              <Tooltip title="Copy Hash">
                <IconButton onClick={() => copyToClipboard(results.hash)}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Hash Type: {results.type.toUpperCase()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    mt: 1
                  }}
                >
                  {results.hash}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Database Results
                </Typography>
                {results.matches.map((match, index) => (
                  <Paper key={index} sx={{ p: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2">{match.database}</Typography>
                      <Chip
                        label={match.severity.toUpperCase()}
                        color={getSeverityColor(match.severity)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {match.result}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Checked: {new Date(match.timestamp).toLocaleString()}
                    </Typography>
                  </Paper>
                ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default HashChecker;
