import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Whois from './pages/Tools/Whois';
import DNS from './pages/Tools/Dns';
import SubdomainScanner from './pages/Tools/Subdomain';
import IPTool from './pages/Tools/IP';
import ShadowPersonas from './pages/Tools/ShadowPersonas';
import DarkWebScanner from './pages/Tools/DarkWeb';
import AIAssistant from './pages/Tools/AIAssistant';
import DataAnalysis from './pages/Tools/DataAnalysis';
import FileScanner from './pages/Tools/FileScanner';
import HashChecker from './pages/Tools/HashChecker';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tools">
          <Route path="whois" element={<Whois />} />
          <Route path="dns" element={<DNS />} />
          <Route path="subdomain" element={<SubdomainScanner />} />
          <Route path="ip" element={<IPTool />} />
          <Route path="shadow-personas" element={<ShadowPersonas />} />
          <Route path="dark-web" element={<DarkWebScanner />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="data-analysis" element={<DataAnalysis />} />
          <Route path="file-scanner" element={<FileScanner />} />
          <Route path="hash-checker" element={<HashChecker />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
