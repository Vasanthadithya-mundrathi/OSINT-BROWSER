import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface IpInfo {
  ip: string;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
  asn?: {
    asn: string;
    name: string;
    domain: string;
    route: string;
    type: string;
  };
  company?: {
    name: string;
    domain: string;
    type: string;
  };
  privacy?: {
    vpn: boolean;
    proxy: boolean;
    tor: boolean;
    relay: boolean;
    hosting: boolean;
  };
  abuse?: {
    address: string;
    country: string;
    email: string;
    name: string;
    network: string;
    phone: string;
  };
}

interface IpState {
  data: IpInfo | null;
  loading: boolean;
  error: string | null;
  recentSearches: string[];
}

const initialState: IpState = {
  data: null,
  loading: false,
  error: null,
  recentSearches: [],
};

export const fetchIpInfo = createAsyncThunk(
  'ip/fetchInfo',
  async (ip: string) => {
    try {
      // Basic IP info from ipapi.co (free, no API key required)
      const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json'
        }
      });

      // Additional abuse and privacy check using AbuseIPDB if API key is available
      let abuseInfo;
      let privacyInfo = {
        vpn: false,
        proxy: false,
        tor: false,
        relay: false,
        hosting: false
      };

      const abuseIPDBKey = process.env.REACT_APP_ABUSEIPDB_API_KEY;
      if (abuseIPDBKey) {
        try {
          const abuseResponse = await axios.get(
            `https://api.abuseipdb.com/api/v2/check`,
            {
              params: {
                ipAddress: ip,
                maxAgeInDays: 90,
                verbose: true
              },
              headers: {
                'Key': abuseIPDBKey,
                'Accept': 'application/json'
              }
            }
          );

          const data = abuseResponse.data.data;
          abuseInfo = {
            address: data.abuseConfidenceScore > 0 ? data.address || '' : '',
            country: data.countryCode || '',
            email: data.abuseConfidenceScore > 0 ? data.email || '' : '',
            name: data.abuseConfidenceScore > 0 ? data.domain || '' : '',
            network: data.network || '',
            phone: data.abuseConfidenceScore > 0 ? data.phone || '' : ''
          };

          // Update privacy info based on usage type
          privacyInfo.hosting = data.usageType?.toLowerCase().includes('hosting') || false;
          privacyInfo.vpn = data.usageType?.toLowerCase().includes('vpn') || false;
        } catch (error) {
          console.log('AbuseIPDB check failed or not available');
        }
      }

      // Get ASN information from ipapi response
      const asnInfo = response.data.asn && {
        asn: `AS${response.data.asn}`,
        name: response.data.org || '',
        domain: response.data.domain || '',
        route: response.data.network || '',
        type: response.data.type || ''
      };

      // Combine all information
      return {
        ip: response.data.ip,
        hostname: response.data.hostname || '',
        city: response.data.city,
        region: response.data.region,
        country: response.data.country_name,
        loc: `${response.data.latitude},${response.data.longitude}`,
        org: response.data.org,
        postal: response.data.postal,
        timezone: response.data.timezone,
        asn: asnInfo,
        company: {
          name: response.data.org || '',
          domain: response.data.domain || '',
          type: response.data.type || ''
        },
        privacy: privacyInfo,
        abuse: abuseInfo
      };
    } catch (error: any) {
      // Try fallback to ip-api.com if ipapi.co fails
      try {
        const fallbackResponse = await axios.get(`http://ip-api.com/json/${ip}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'application/json'
          }
        });

        return {
          ip: fallbackResponse.data.query,
          city: fallbackResponse.data.city,
          region: fallbackResponse.data.regionName,
          country: fallbackResponse.data.country,
          loc: `${fallbackResponse.data.lat},${fallbackResponse.data.lon}`,
          org: fallbackResponse.data.org || fallbackResponse.data.isp,
          timezone: fallbackResponse.data.timezone,
          asn: {
            asn: `AS${fallbackResponse.data.as?.split(' ')[0].substring(2)}`,
            name: fallbackResponse.data.org || fallbackResponse.data.isp,
            domain: '',
            route: '',
            type: ''
          }
        };
      } catch (fallbackError) {
        throw new Error('Failed to fetch IP information from all available sources');
      }
    }
  }
);

const ipSlice = createSlice({
  name: 'ip',
  initialState,
  reducers: {
    clearIpData: (state) => {
      state.data = null;
      state.error = null;
    },
    addRecentSearch: (state, action) => {
      if (!state.recentSearches.includes(action.payload)) {
        state.recentSearches.unshift(action.payload);
        if (state.recentSearches.length > 5) {
          state.recentSearches.pop();
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIpInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIpInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIpInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch IP information';
      });
  },
});

export const { clearIpData, addRecentSearch } = ipSlice.actions;
export default ipSlice.reducer;
