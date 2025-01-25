import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface SocialMediaProfile {
  platform: string;
  username: string;
  url: string;
  exists: boolean;
  lastChecked: string;
  activity: string;
  lastActive: string;
  connections: number;
  data?: {
    [key: string]: number | string;
  };
}

interface TimelineEvent {
  date: string;
  event: string;
}

interface PersonaAnalysis {
  username: string;
  profiles: SocialMediaProfile[];
  emailAddresses: string[];
  locations: string[];
  interests: string[];
  associations: string[];
  timeline: TimelineEvent[];
  metadata: {
    searchTimestamp: string;
    query: string;
    platformsCovered: string[];
  };
}

interface ShadowPersonasState {
  data: PersonaAnalysis | null;
  loading: boolean;
  error: string | null;
}

const initialState: ShadowPersonasState = {
  data: null,
  loading: false,
  error: null,
};

export const analyzeShadowPersonas = createAsyncThunk(
  'shadowPersonas/analyze',
  async (target: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/social-media/${encodeURIComponent(target)}`);
      return response.data as PersonaAnalysis;
    } catch (error: any) {
      console.error('Shadow Personas Analysis Error:', error);
      return rejectWithValue(error.message || 'Failed to analyze shadow personas');
    }
  }
);

const shadowPersonasSlice = createSlice({
  name: 'shadowPersonas',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeShadowPersonas.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(analyzeShadowPersonas.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(analyzeShadowPersonas.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload as string || 'Failed to analyze shadow personas';
      });
  },
});

export const { clearResults } = shadowPersonasSlice.actions;
export default shadowPersonasSlice.reducer;
