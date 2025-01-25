import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface DarkWebResult {
  title: string;
  content: string;
  url: string;
  source: string;
  timestamp: string;
  riskLevel: 'low' | 'medium' | 'high';
  category: string[];
  matches: string[];
}

interface DarkWebState {
  results: DarkWebResult[];
  loading: boolean;
  error: string | null;
}

const initialState: DarkWebState = {
  results: [],
  loading: false,
  error: null,
};

export const searchDarkWeb = createAsyncThunk(
  'darkWeb/search',
  async (query: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock data with different risk levels and categories
      const mockResults: DarkWebResult[] = [
        {
          title: 'Dark Market Listing',
          content: `Found potential match for "${query}" in marketplace listings. This entry was discovered in a recent database containing sensitive information.`,
          url: 'http://darkmarket.onion',
          source: 'Dark Market Index',
          timestamp: new Date().toISOString(),
          riskLevel: 'high',
          category: ['marketplace', 'sensitive'],
          matches: [query],
        },
        {
          title: 'Forum Discussion',
          content: `Reference to "${query}" found in forum discussions. The context appears to be general conversation without immediate security concerns.`,
          url: 'http://forum.onion',
          source: 'Tor Forum Network',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          riskLevel: 'low',
          category: ['forum', 'discussion'],
          matches: [query],
        },
        {
          title: 'Data Breach Record',
          content: `Information related to "${query}" appeared in a historical data breach. Recommended to change associated passwords and enable 2FA where possible.`,
          url: 'http://breach.onion',
          source: 'Breach Database',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          riskLevel: 'medium',
          category: ['breach', 'credentials'],
          matches: [query],
        },
      ];

      return mockResults;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to search dark web');
    }
  }
);

const darkWebSlice = createSlice({
  name: 'darkWeb',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchDarkWeb.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDarkWeb.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchDarkWeb.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search dark web';
      });
  },
});

export const { clearResults } = darkWebSlice.actions;
export default darkWebSlice.reducer;
