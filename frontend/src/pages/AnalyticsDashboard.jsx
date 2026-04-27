import { useState, useEffect } from 'react';

const API_BASE_URL = typeof window !== 'undefined'
  ? `${window.location.origin}/api`
  : 'http://localhost:3000/api';

function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    unique_visitors: 0,
    page_views: 0,
    avg_duration: 0,
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/analytics/summary`)
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(() => setMetrics({ unique_visitors: 0, page_views: 0, avg_duration: 0 }));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow">
          <h2>Unique Visitors</h2>
          <p className="text-3xl">{metrics.unique_visitors}</p>
        </div>
        <div className="bg-white p-4 shadow">
          <h2>Page Views</h2>
          <p className="text-3xl">{metrics.page_views}</p>
        </div>
        <div className="bg-white p-4 shadow">
          <h2>Avg Session Duration (s)</h2>
          <p className="text-3xl">{Math.floor(metrics.avg_duration)}</p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;