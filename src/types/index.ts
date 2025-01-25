// Common interfaces
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'free' | 'premium';
  createdAt: string;
}

export interface SearchResult {
  id: string;
  type: 'whois' | 'dns' | 'subdomain' | 'social' | 'file' | 'darkweb';
  query: string;
  timestamp: string;
  data: unknown;
}

// Tool-specific interfaces
export interface WhoisResult {
  domain: string;
  registrar: string;
  createdDate: string;
  expiryDate: string;
  nameServers: string[];
  status: string[];
  contacts: {
    registrant?: ContactInfo;
    admin?: ContactInfo;
    tech?: ContactInfo;
  };
}

interface ContactInfo {
  name?: string;
  organization?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface DnsRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
}

export interface SubdomainScanResult {
  subdomain: string;
  ip: string;
  status: number;
  title?: string;
  server?: string;
}

export interface SocialMediaProfile {
  platform: string;
  username: string;
  url: string;
  bio?: string;
  followers?: number;
  following?: number;
  lastActive?: string;
}

export interface FileMetadata {
  filename: string;
  fileType: string;
  size: number;
  created: string;
  modified: string;
  author?: string;
  software?: string;
  gpsLocation?: {
    latitude: number;
    longitude: number;
  };
  additionalMetadata: Record<string, unknown>;
}
