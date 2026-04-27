import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TodoPage from './pages/TodoPage.jsx';
import AnalyticsDashboard from './pages/AnalyticsDashboard.jsx';
import { useEffect } from 'react';

const API_BASE_URL = typeof window !== 'undefined'
  ? `${window.location.origin}/api`
  : 'http://localhost:3000/api';

function App() {
  useEffect(() => {
    // Start session on load
    fetch(`${API_BASE_URL}/analytics/session/start`, {
      method: 'POST',
      credentials: 'include',
    });

    // Track page view
    fetch(`${API_BASE_URL}/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: window.location.pathname, event_type: 'page_view' }),
      credentials: 'include',
    });

    const handleBeforeUnload = () => {
      // End session (simplified; duration calculation client-side)
      const duration = Math.floor(performance.now() / 1000); // in seconds
      fetch(`${API_BASE_URL}/analytics/session/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration }),
        credentials: 'include',
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-500 p-4 text-white">
          <a href="/" className="mr-4">Todos</a>
          <a href="/analytics">Analytics</a>
        </nav>
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;