import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  ContentCopy as ContentCopyIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual AI API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResponse(`AI Analysis for: "${input}"\n\nThis is a simulated AI response that would analyze the provided input for potential security implications, patterns, and insights.`);
    } catch (err) {
      setError('Failed to get AI analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PsychologyIcon />
        <Typography variant="h5">AI Assistant</Typography>
      </Box>

      <Alert severity="info">
        The AI Assistant helps analyze text, code, or data for security implications and provides insights.
      </Alert>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Enter text, code, or data for analysis..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            sx={{ minWidth: 120 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                Analyze
                <SendIcon sx={{ ml: 1 }} />
              </>
            )}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      {response && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" gutterBottom>Analysis Results</Typography>
              <Tooltip title="Copy Results">
                <IconButton onClick={() => copyToClipboard(response)}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
                mt: 2
              }}
            >
              {response}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AIAssistant;
