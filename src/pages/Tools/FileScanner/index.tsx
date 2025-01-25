import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  UploadFile as UploadIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Description as FileIcon,
} from '@mui/icons-material';

interface ScanResult {
  fileName: string;
  fileSize: number;
  fileType: string;
  threats: {
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
  signatures: {
    name: string;
    matched: boolean;
  }[];
  scanTime: string;
}

const FileScanner: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      setError(null);
      setResults(null);
      setProgress(0);
    }
  };

  const scanFile = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate scanning progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }

      // Mock scan results
      setResults({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        threats: [
          {
            severity: 'low',
            description: 'Suspicious string pattern detected'
          },
          {
            severity: 'medium',
            description: 'Potential obfuscated code'
          }
        ],
        signatures: [
          { name: 'Known malware signature', matched: false },
          { name: 'Suspicious patterns', matched: true },
          { name: 'Code injection patterns', matched: false }
        ],
        scanTime: new Date().toISOString()
      });
    } catch (err) {
      setError('Failed to scan file. Please try again.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SecurityIcon />
        <Typography variant="h5">File Scanner</Typography>
      </Box>

      <Alert severity="info">
        Upload files to scan for malware, suspicious patterns, and potential security threats.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadIcon />}
              fullWidth
              disabled={loading}
            >
              Choose File
              <input
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              startIcon={<SecurityIcon />}
              onClick={scanFile}
              disabled={!file || loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Scan File'}
            </Button>
          </Grid>
        </Grid>

        {file && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </Typography>
          </Box>
        )}

        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Scanning... {progress}%
            </Typography>
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      {results && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Scan Results</Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>File Information</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <FileIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="File Name"
                      secondary={results.fileName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="File Size"
                      secondary={`${(results.fileSize / 1024).toFixed(2)} KB`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="File Type"
                      secondary={results.fileType}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Scan Time"
                      secondary={new Date(results.scanTime).toLocaleString()}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Detected Threats</Typography>
                <List dense>
                  {results.threats.map((threat, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {threat.severity === 'high' ? (
                          <ErrorIcon color="error" />
                        ) : threat.severity === 'medium' ? (
                          <WarningIcon color="warning" />
                        ) : (
                          <WarningIcon color="info" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={threat.description}
                        secondary={
                          <Chip
                            label={threat.severity.toUpperCase()}
                            size="small"
                            color={getSeverityColor(threat.severity)}
                            sx={{ mt: 0.5 }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Signature Analysis</Typography>
                <List dense>
                  {results.signatures.map((sig, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {sig.matched ? (
                          <WarningIcon color="warning" />
                        ) : (
                          <CheckCircleIcon color="success" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={sig.name}
                        secondary={sig.matched ? 'Detected' : 'Not Detected'}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default FileScanner;
