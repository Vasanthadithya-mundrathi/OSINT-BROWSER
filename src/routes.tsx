import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WhoisLookup from './pages/Tools/Whois';
import DnsLookup from './pages/Tools/Dns';
import SubdomainScanner from './pages/Tools/Subdomain';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tools/whois" element={<WhoisLookup />} />
      <Route path="/tools/dns-lookup" element={<DnsLookup />} />
      <Route path="/tools/subdomain-scanner" element={<SubdomainScanner />} />
      {/* Add more routes as we create the pages */}
    </Routes>
  );
}
