import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import whois from 'whois-json';
import dns from 'dns';
import { promisify } from 'util';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// WHOIS Lookup
app.post('/api/whois', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const result = await whois(domain);
    res.json({ data: result });
  } catch (error) {
    console.error('WHOIS Error:', error);
    res.status(500).json({ error: 'Failed to fetch WHOIS data' });
  }
});

// DNS Lookup
app.post('/api/dns', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const resolve4 = promisify(dns.resolve4);
    const resolveMx = promisify(dns.resolveMx);
    const resolveTxt = promisify(dns.resolveTxt);
    const resolveNs = promisify(dns.resolveNs);

    const [ipAddresses, mxRecords, txtRecords, nsRecords] = await Promise.all([
      resolve4(domain).catch(() => []),
      resolveMx(domain).catch(() => []),
      resolveTxt(domain).catch(() => []),
      resolveNs(domain).catch(() => []),
    ]);

    res.json({
      data: {
        ipAddresses,
        mxRecords,
        txtRecords,
        nsRecords,
      },
    });
  } catch (error) {
    console.error('DNS Error:', error);
    res.status(500).json({ error: 'Failed to fetch DNS records' });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
