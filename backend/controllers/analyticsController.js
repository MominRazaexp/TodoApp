import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../models/db.js';

export const trackEvent = (req, res) => {
  const db = getDB();
  let { visitor_id, page, event_type } = req.body || {};
  page = page || '/';
  event_type = event_type || 'page_view';

  if (!visitor_id) {
    visitor_id = uuidv4();
    res.cookie('visitor_id', visitor_id, { maxAge: 900000, httpOnly: true });
  }

  db.run('INSERT INTO analytics (visitor_id, page, event_type) VALUES (?, ?, ?)', [visitor_id, page, event_type], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to track event' });
    }
    res.json({ message: 'Event tracked' });
  });
};

export const startSession = (req, res) => {
  const db = getDB();
  let { visitor_id } = req.body || {};
  if (!visitor_id) {
    visitor_id = req.cookies.visitor_id || uuidv4();
    res.cookie('visitor_id', visitor_id, { maxAge: 900000, httpOnly: true });
  }
  // For simplicity, we track start as a page_view event with duration null
  db.run('INSERT INTO analytics (visitor_id, page, event_type, duration) VALUES (?, ?, ?, ?)', [visitor_id, '/', 'session_start', null], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to start session' });
    }
    res.json({ message: 'Session started' });
  });
};

export const endSession = (req, res) => {
  const db = getDB();
  const { visitor_id, duration } = req.body || {};
  if (!visitor_id) {
    return res.status(400).json({ error: 'Visitor ID required' });
  }
  db.run('INSERT INTO analytics (visitor_id, page, event_type, duration) VALUES (?, ?, ?, ?)', [visitor_id, '/', 'session_end', duration || 0], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to end session' });
    }
    res.json({ message: 'Session ended' });
  });
};

export const getSummary = (req, res) => {
  const db = getDB();
  db.all('SELECT COUNT(DISTINCT visitor_id) as unique_visitors FROM analytics', [], (err, rows1) => {
    if (err) return res.status(500).json({ error: 'Failed to get summary' });
    db.all('SELECT COUNT(*) as page_views FROM analytics WHERE event_type = "page_view"', [], (err, rows2) => {
      if (err) return res.status(500).json({ error: 'Failed to get summary' });
      db.get('SELECT AVG(duration) as avg_duration FROM analytics WHERE event_type = "session_end" AND duration IS NOT NULL', (err, row3) => {
        if (err) return res.status(500).json({ error: 'Failed to get summary' });
        res.json({
          unique_visitors: rows1[0].unique_visitors || 0,
          page_views: rows2[0].page_views || 0,
          avg_duration: row3.avg_duration || 0
        });
      });
    });
  });
};