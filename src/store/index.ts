import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import whoisReducer from './slices/whoisSlice';
import dnsReducer from './slices/dnsSlice';
import subdomainReducer from './slices/subdomainSlice';
import ipReducer from './slices/ipSlice';
import shadowPersonasReducer from './slices/shadowPersonasSlice';
import darkWebReducer from './slices/darkWebSlice';

export const store = configureStore({
  reducer: {
    whois: whoisReducer,
    dns: dnsReducer,
    subdomain: subdomainReducer,
    ip: ipReducer,
    shadowPersonas: shadowPersonasReducer,
    darkWeb: darkWebReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
