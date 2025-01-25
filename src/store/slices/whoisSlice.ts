import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Contact {
  name: string;
  organization: string;
  email: string;
  phone: string;
  address: string;
}

interface WhoisResult {
  domain: string;
  registrar: string;
  createdDate: string;
  expiryDate: string;
  lastUpdated: string;
  nameServers: string[];
  status: string[];
  contacts: {
    registrant?: Contact;
    admin?: Contact;
    tech?: Contact;
  };
}

interface WhoisState {
  data: WhoisResult | null;
  loading: boolean;
  error: string | null;
  recentSearches: string[];
}

const initialState: WhoisState = {
  data: null,
  loading: false,
  error: null,
  recentSearches: [],
};

export const fetchWhoisData = createAsyncThunk(
  'whois/fetchData',
  async (domain: string) => {
    try {
      // First try RDAP lookup
      const rdapResponse = await axios.get(
        `https://rdap.verisign.com/com/v1/domain/${domain}`
      );

      const whoisData = rdapResponse.data;
      const registrantEntity = whoisData.entities?.find((e: any) => 
        e.roles?.includes('registrant')
      );
      const adminEntity = whoisData.entities?.find((e: any) => 
        e.roles?.includes('administrative')
      );
      const techEntity = whoisData.entities?.find((e: any) => 
        e.roles?.includes('technical')
      );

      const extractContactInfo = (entity: any) => {
        if (!entity?.vcardArray?.[1]) return undefined;
        const vcard = entity.vcardArray[1];
        const findValue = (key: string) => {
          const item = vcard.find((arr: any[]) => arr[0] === key);
          return item ? item[3] : undefined;
        };

        return {
          name: findValue('fn'),
          organization: findValue('org'),
          email: findValue('email'),
          phone: findValue('tel'),
          address: findValue('adr')?.join(', ')
        };
      };

      return {
        domain: whoisData.ldhName?.toLowerCase(),
        registrar: whoisData.entities?.find((e: any) => e.roles?.includes('registrar'))?.vcardArray?.[1]?.find((arr: any[]) => arr[0] === 'fn')?.[3] || 'Unknown',
        createdDate: whoisData.events?.find((e: any) => e.eventAction === 'registration')?.eventDate,
        expiryDate: whoisData.events?.find((e: any) => e.eventAction === 'expiration')?.eventDate,
        lastUpdated: whoisData.events?.find((e: any) => e.eventAction === 'last changed')?.eventDate,
        nameServers: whoisData.nameservers?.map((ns: any) => ns.ldhName) || [],
        status: whoisData.status || [],
        contacts: {
          registrant: extractContactInfo(registrantEntity),
          admin: extractContactInfo(adminEntity),
          tech: extractContactInfo(techEntity)
        }
      };
    } catch (error) {
      // If RDAP fails, try alternative RDAP servers
      try {
        const rdapBootstrap = await axios.get('https://rdap.org/domain/' + domain);
        const rdapUrl = rdapBootstrap.request?.res?.responseUrl;
        if (rdapUrl) {
          const rdapResponse = await axios.get(rdapUrl);
          // Process response same as above
          return processRdapResponse(rdapResponse.data);
        }
      } catch (fallbackError) {
        throw new Error('Failed to fetch WHOIS data. Domain may not exist or RDAP servers are unavailable.');
      }
    }
  }
);

const processRdapResponse = (whoisData: any) => {
  // Same processing logic as above to maintain consistency
  const registrantEntity = whoisData.entities?.find((e: any) => 
    e.roles?.includes('registrant')
  );
  const adminEntity = whoisData.entities?.find((e: any) => 
    e.roles?.includes('administrative')
  );
  const techEntity = whoisData.entities?.find((e: any) => 
    e.roles?.includes('technical')
  );

  const extractContactInfo = (entity: any) => {
    if (!entity?.vcardArray?.[1]) return undefined;
    const vcard = entity.vcardArray[1];
    const findValue = (key: string) => {
      const item = vcard.find((arr: any[]) => arr[0] === key);
      return item ? item[3] : undefined;
    };

    return {
      name: findValue('fn'),
      organization: findValue('org'),
      email: findValue('email'),
      phone: findValue('tel'),
      address: findValue('adr')?.join(', ')
    };
  };

  return {
    domain: whoisData.ldhName?.toLowerCase(),
    registrar: whoisData.entities?.find((e: any) => e.roles?.includes('registrar'))?.vcardArray?.[1]?.find((arr: any[]) => arr[0] === 'fn')?.[3] || 'Unknown',
    createdDate: whoisData.events?.find((e: any) => e.eventAction === 'registration')?.eventDate,
    expiryDate: whoisData.events?.find((e: any) => e.eventAction === 'expiration')?.eventDate,
    lastUpdated: whoisData.events?.find((e: any) => e.eventAction === 'last changed')?.eventDate,
    nameServers: whoisData.nameservers?.map((ns: any) => ns.ldhName) || [],
    status: whoisData.status || [],
    contacts: {
      registrant: extractContactInfo(registrantEntity),
      admin: extractContactInfo(adminEntity),
      tech: extractContactInfo(techEntity)
    }
  };
};

const whoisSlice = createSlice({
  name: 'whois',
  initialState,
  reducers: {
    clearWhoisData: (state) => {
      state.data = null;
      state.error = null;
    },
    addRecentSearch: (state, action: { payload: string }) => {
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
      .addCase(fetchWhoisData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWhoisData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWhoisData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch WHOIS data';
      });
  },
});

export const { clearWhoisData, addRecentSearch } = whoisSlice.actions;
export default whoisSlice.reducer;
