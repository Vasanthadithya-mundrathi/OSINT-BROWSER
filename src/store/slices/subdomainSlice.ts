import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface SubdomainScanResult {
  subdomain: string;
  ip: string;
  status: number;
  title: string;
  server: string;
  lastChecked: string;
}

interface SubdomainState {
  results: SubdomainScanResult[];
  loading: boolean;
  error: string | null;
  progress: number;
}

const initialState: SubdomainState = {
  results: [],
  loading: false,
  error: null,
  progress: 0,
};

interface ScanSubdomainsParams {
  domain: string;
  depth: string;
}

export const scanSubdomains = createAsyncThunk(
  'subdomain/scan',
  async ({ domain, depth }: ScanSubdomainsParams, { dispatch }) => {
    const results: SubdomainScanResult[] = [];
    const subdomains = new Set<string>();
    let progress = 0;
    
    try {
      // Update initial progress
      dispatch({ type: 'subdomain/updateProgress', payload: progress += 10 });

      // 1. Try RapidAPI's Subdomains API
      try {
        const rapidApiKey = process.env.REACT_APP_RAPIDAPI_KEY;
        if (rapidApiKey) {
          const options = {
            method: 'GET',
            url: 'https://subdomains-lookup.p.rapidapi.com/api/v1/subdomain/search',
            params: { domain },
            headers: {
              'X-RapidAPI-Key': rapidApiKey,
              'X-RapidAPI-Host': 'subdomains-lookup.p.rapidapi.com'
            }
          };
          const response = await axios.request(options);
          response.data.subdomains?.forEach((sub: string) => {
            subdomains.add(sub.toLowerCase());
          });
        }
      } catch (error) {
        console.warn('RapidAPI lookup failed:', error);
      }

      dispatch({ type: 'subdomain/updateProgress', payload: progress += 20 });

      // 2. Try DNS enumeration using common subdomains
      const commonSubdomains = depth === 'low' ? [
        'www', 'mail', 'ftp', 'smtp', 'pop', 'ns1', 'ns2'
      ] : depth === 'medium' ? [
        'www', 'mail', 'ftp', 'smtp', 'pop', 'ns1', 'ns2', 'dns', 'dns1', 'dns2',
        'mx', 'webmail', 'email', 'dev', 'staging', 'test', 'api'
      ] : [
        'www', 'mail', 'ftp', 'smtp', 'pop', 'ns1', 'ns2', 'dns', 'dns1', 'dns2',
        'mx', 'webmail', 'email', 'dev', 'staging', 'test', 'api', 'admin', 'blog',
        'demo', 'portal', 'vpn', 'support', 'docs', 'git', 'gitlab', 'jenkins',
        'cdn', 'cloud', 'images', 'img', 'download', 'downloads', 'app', 'apps'
      ];

      const dnsPromises = commonSubdomains.map(async (prefix) => {
        const subdomain = `${prefix}.${domain}`;
        try {
          const dnsResponse = await axios.get(
            `https://dns.google/resolve?name=${subdomain}&type=A`,
            { timeout: 5000 }
          );
          if (dnsResponse.data.Answer) {
            subdomains.add(subdomain);
          }
        } catch (error) {
          // Ignore DNS resolution errors
        }
      });

      await Promise.allSettled(dnsPromises);
      dispatch({ type: 'subdomain/updateProgress', payload: progress += 30 });

      // 3. Try crt.sh (Certificate Transparency) for medium and high depth scans
      if (depth !== 'low') {
        try {
          const crtResponse = await axios.get(
            `https://crt.sh/?q=%.${domain}&output=json`,
            {
              timeout: 10000,
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
              }
            }
          );

          if (Array.isArray(crtResponse.data)) {
            crtResponse.data.forEach((cert: any) => {
              const names = cert.name_value.split('\\n');
              names.forEach((name: string) => {
                if (name.endsWith(domain) && name !== domain) {
                  subdomains.add(name.trim().toLowerCase());
                }
              });
            });
          }
        } catch (error) {
          console.warn('Certificate transparency lookup failed:', error);
        }
      }

      dispatch({ type: 'subdomain/updateProgress', payload: progress += 20 });

      // Check each subdomain's status
      const checkPromises = Array.from(subdomains).map(async (subdomain) => {
        let status = 0;
        let title = '';
        let ip = '';
        let server = '';

        // Get IP address first
        try {
          const dnsResponse = await axios.get(
            `https://dns.google/resolve?name=${subdomain}&type=A`,
            { timeout: 5000 }
          );
          if (dnsResponse.data.Answer) {
            ip = dnsResponse.data.Answer[0].data;
          }
        } catch (error) {
          console.warn(`DNS lookup failed for ${subdomain}:`, error);
        }

        // Try HTTPS first
        try {
          const response = await axios.get(`https://${subdomain}`, {
            timeout: 5000,
            validateStatus: () => true,
            headers: { 'User-Agent': 'Mozilla/5.0' }
          });

          status = response.status;
          server = response.headers['server'] || '';
          const titleMatch = response.data.match(/<title>(.*?)<\/title>/i);
          title = titleMatch ? titleMatch[1].trim() : '';
        } catch (error) {
          // Try HTTP if HTTPS fails
          try {
            const response = await axios.get(`http://${subdomain}`, {
              timeout: 5000,
              validateStatus: () => true,
              headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            status = response.status;
            server = response.headers['server'] || '';
            const titleMatch = response.data.match(/<title>(.*?)<\/title>/i);
            title = titleMatch ? titleMatch[1].trim() : '';
          } catch (httpError) {
            console.warn(`HTTP request failed for ${subdomain}:`, httpError);
          }
        }

        return {
          subdomain,
          ip: ip || 'N/A',
          status: status || 0,
          title: title || '',
          server: server || 'N/A',
          lastChecked: new Date().toISOString()
        };
      });

      const results = await Promise.all(checkPromises);
      
      // Sort results: active domains first, then by subdomain name
      return results.sort((a, b) => {
        const aActive = a.status >= 200 && a.status < 400;
        const bActive = b.status >= 200 && b.status < 400;
        if (aActive !== bActive) return bActive ? 1 : -1;
        return a.subdomain.localeCompare(b.subdomain);
      });

    } catch (error) {
      console.error('Subdomain scan failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to scan subdomains');
    }
  }
);

const subdomainSlice = createSlice({
  name: 'subdomain',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.error = null;
      state.progress = 0;
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(scanSubdomains.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.progress = 0;
        state.results = [];
      })
      .addCase(scanSubdomains.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.progress = 100;
      })
      .addCase(scanSubdomains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to scan subdomains';
        state.progress = 0;
      });
  },
});

export const { clearResults, updateProgress } = subdomainSlice.actions;
export default subdomainSlice.reducer;
