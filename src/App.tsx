import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { CitizenDashboard } from './components/CitizenDashboard';
import { AuthorityDashboard } from './components/AuthorityDashboard';

type PageView = 'landing' | 'citizen' | 'authority';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');

  return (
    <div className="min-h-screen bg-slate-50">
      {currentPage === 'landing' && (
        <LandingPage 
          onCitizenLogin={() => setCurrentPage('citizen')}
          onAuthorityLogin={() => setCurrentPage('authority')}
        />
      )}
      {currentPage === 'citizen' && (
        <CitizenDashboard onLogout={() => setCurrentPage('landing')} />
      )}
      {currentPage === 'authority' && (
        <AuthorityDashboard onLogout={() => setCurrentPage('landing')} />
      )}
    </div>
  );
}
