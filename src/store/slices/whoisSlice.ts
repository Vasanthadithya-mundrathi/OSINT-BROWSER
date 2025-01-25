import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axios';

interface WhoisData {
  domainName: string;
  registrar: {
    name: string;
    whoisServer: string;
    referralUrl: string;
  };
  registrant: {
    organization: string;
    state: string;
    country: string;
    email: string;
  };
  administrativeContact: {
    organization: string;
    state: string;
    country: string;
    email: string;
  };
  technicalContact: {
    organization: string;
    state: string;
    country: string;
    email: string;
  };
  nameServers: string[];
  created: string;
  updated: string;
  expires: string;
  status: string[];
}

interface WhoisState {
  data: WhoisData | null;
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
    const response = await api.post('/whois', { domain });
    return response.data.data;
  }
);

const whoisSlice = createSlice({
  name: 'whois',
  initialState,
  reducers: {
    clearWhoisData: (state) => {
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
