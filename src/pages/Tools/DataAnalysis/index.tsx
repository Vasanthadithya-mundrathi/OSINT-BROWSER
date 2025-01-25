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
  TextField,
  Chip,
} from '@mui/material';
import {
  UploadFile as UploadIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

interface AnalysisResult {
  type: string;
  count: number;
  patterns: string[];
  insights: string[];
}

const DataAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      setError(null);
      setResults(null);
    }
  };

  const analyzeData = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      // TODO: Implement actual data analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResults({
        type: file.type || 'unknown',
        count: Math.floor(Math.random() * 1000),
        patterns: [
          'Frequent IP addresses',
          'Common user agents',
          'Time-based patterns',
        ],
        insights: [
          'High activity during business hours',
          'Multiple failed login attempts',
          'Suspicious access patterns detected',
        ],
      });
    } catch (err) {
      setError('Failed to analyze data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AnalyticsIcon />
        <Typography variant="h5">Data Analysis</Typography>
      </Box>

      <Alert severity="info">
        Upload data files (logs, network captures, etc.) for automated analysis and pattern detection.
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
                accept=".txt,.log,.pcap,.csv,.json"
              />
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              startIcon={<AssessmentIcon />}
              onClick={analyzeData}
              disabled={!file || loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Analyze Data'}
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
      </Paper>

      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      {results && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Analysis Results</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>File Information</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>Type: {results.type}</Typography>
                  <Typography>Data Points: {results.count}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Detected Patterns</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {results.patterns.map((pattern, index) => (
                    <Chip
                      key={index}
                      label={pattern}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Key Insights</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {results.insights.map((insight, index) => (
                    <Alert key={index} severity="info" sx={{ '& .MuiAlert-message': { width: '100%' } }}>
                      {insight}
                    </Alert>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DataAnalysis;
