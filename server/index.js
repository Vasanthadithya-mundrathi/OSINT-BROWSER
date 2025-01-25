import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mock data generator
const generateMockResponse = (toolName) => ({
  success: true,
  timestamp: new Date().toISOString(),
  tool: toolName,
  data: {
    message: `Mock response from ${toolName}`,
    status: 'completed'
  }
});

// WHOIS Lookup
app.post('/api/whois', (req, res) => {
  const { domain } = req.body;
  res.json({
    ...generateMockResponse('WHOIS Lookup'),
    data: {
      domain,
      registrar: 'Example Registrar, LLC',
      createdDate: '2023-01-01',
      expiryDate: '2024-01-01',
      nameservers: ['ns1.example.com', 'ns2.example.com']
    }
  });
});

// DNS Lookup
app.post('/api/dns', (req, res) => {
  const { domain, recordType } = req.body;
  res.json({
    ...generateMockResponse('DNS Lookup'),
    data: {
      domain,
      recordType,
      records: [
        { type: 'A', value: '93.184.216.34' },
        { type: 'AAAA', value: '2606:2800:220:1:248:1893:25c8:1946' }
      ]
    }
  });
});

// Subdomain Scanner
app.post('/api/subdomain-scanner', (req, res) => {
  const { domain } = req.body;
  res.json({
    ...generateMockResponse('Subdomain Scanner'),
    data: {
      domain,
      subdomains: [
        { subdomain: 'www', ip: '93.184.216.34', status: 'active' },
        { subdomain: 'mail', ip: '93.184.216.35', status: 'active' },
        { subdomain: 'blog', ip: '93.184.216.36', status: 'active' }
      ]
    }
  });
});

// IP Tool
app.post('/api/ip-tool', (req, res) => {
  const { ip } = req.body;
  res.json({
    ...generateMockResponse('IP Tool'),
    data: {
      ip,
      location: {
        country: 'United States',
        city: 'Mountain View',
        coordinates: { lat: 37.4056, lng: -122.0775 }
      },
      isp: 'Google LLC',
      asn: 'AS15169'
    }
  });
});

// Shadow Personas
app.post('/api/shadow-personas', (req, res) => {
  const { username, platforms } = req.body;
  res.json({
    ...generateMockResponse('Shadow Personas'),
    data: {
      username,
      platforms: platforms.map(platform => ({
        platform,
        found: true,
        url: `https://${platform}.com/${username}`,
        lastActive: '2024-01-20'
      }))
    }
  });
});

// Dark Web Scanner
app.post('/api/dark-web', (req, res) => {
  const { query, scanType } = req.body;
  res.json({
    ...generateMockResponse('Dark Web Scanner'),
    data: {
      query,
      scanType,
      findings: [
        {
          source: 'Dark Market A',
          date: '2024-01-15',
          severity: 'medium',
          details: 'Found in leaked database'
        }
      ]
    }
  });
});

// AI Assistant
app.post('/api/ai-assistant', (req, res) => {
  const { text } = req.body;
  res.json({
    ...generateMockResponse('AI Assistant'),
    data: {
      input: text,
      analysis: 'This appears to be a Google DNS server IP address.',
      recommendations: [
        'Consider checking for DNS security features',
        'Verify DNS response times'
      ]
    }
  });
});

// Data Analysis
app.post('/api/data-analysis', (req, res) => {
  const { data, analysisType } = req.body;
  res.json({
    ...generateMockResponse('Data Analysis'),
    data: {
      input: data,
      analysisType,
      patterns: [
        { type: 'frequency', value: 'High occurrence of numeric values' },
        { type: 'structure', value: 'Consistent data format detected' }
      ]
    }
  });
});

// File Scanner
app.post('/api/file-scanner', (req, res) => {
  const { filename, content } = req.body;
  res.json({
    ...generateMockResponse('File Scanner'),
    data: {
      filename,
      size: content.length,
      scan: {
        malware: false,
        suspicious: false,
        signatures: ['clean', 'no-known-threats']
      }
    }
  });
});

// Hash Checker
app.post('/api/hash-checker', (req, res) => {
  const { hash, type } = req.body;
  res.json({
    ...generateMockResponse('Hash Checker'),
    data: {
      hash,
      type,
      results: [
        {
          database: 'VirusTotal',
          matches: 0,
          lastSeen: null,
          classification: 'clean'
        },
        {
          database: 'MalwareDB',
          matches: 0,
          lastSeen: null,
          classification: 'unknown'
        }
      ]
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
