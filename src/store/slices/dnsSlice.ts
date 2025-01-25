import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DnsRecord } from '@/types';
import axios from 'axios';

interface DnsState {
  records: DnsRecord[];
  loading: boolean;
  error: string | null;
  recentSearches: string[];
}

const initialState: DnsState = {
  records: [],
  loading: false,
  error: null,
  recentSearches: [],
};

export const fetchDnsRecords = createAsyncThunk(
  'dns/fetchRecords',
  async (domain: string) => {
    try {
      // Using Google's DNS-over-HTTPS API
      const types = ['a', 'aaaa', 'mx', 'ns', 'txt'];
      const records: DnsRecord[] = [];

      for (const type of types) {
        const response = await axios.get(
          `https://dns.google/resolve?name=${domain}&type=${type}`
        );

        if (response.data.Answer) {
          response.data.Answer.forEach((answer: any) => {
            records.push({
              type: type.toUpperCase(),
              name: answer.name,
              value: answer.data,
              ttl: answer.TTL,
            });
          });
        }
      }

      return records;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch DNS records');
    }
  }
);

const dnsSlice = createSlice({
  name: 'dns',
  initialState,
  reducers: {
    clearDnsRecords: (state) => {
      state.records = [];
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
      .addCase(fetchDnsRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDnsRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchDnsRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch DNS records';
      });
  },
});

export const { clearDnsRecords, addRecentSearch } = dnsSlice.actions;
export default dnsSlice.reducer;
