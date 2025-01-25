import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
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

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/whois" element={<Whois />} />
            <Route path="/dns" element={<DNS />} />
            <Route path="/subdomain-scanner" element={<SubdomainScanner />} />
            <Route path="/ip-tool" element={<IPTool />} />
            <Route path="/shadow-personas" element={<ShadowPersonas />} />
            <Route path="/dark-web" element={<DarkWebScanner />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/data-analysis" element={<DataAnalysis />} />
            <Route path="/file-scanner" element={<FileScanner />} />
            <Route path="/hash-checker" element={<HashChecker />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
